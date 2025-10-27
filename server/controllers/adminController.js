const bcrypt = require('bcryptjs');
// Ensure all necessary models are imported
const { User, Course, CourseContent, Enrollment } = require('../models');

// === Author Management ===

const createAuthor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Use the correct password column name ('password' based on previous context)
    const author = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'author'
    });
    res.status(201).json({
      id: author.id,
      name: author.name,
      email: author.email,
      role: author.role
    });
  } catch (err) {
    console.error('Create Author Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.findAll({
      where: { role: 'author' },
      attributes: ['id', 'name', 'email', 'createdAt'] // Exclude password
    });
    res.status(200).json(authors);
  } catch (err) {
    console.error('Get All Authors Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const result = await User.destroy({
      where: {
        id: req.params.id,
        role: 'author'
      }
    });
    if (result === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    console.error('Delete Author Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// === Course Management ===

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'author', // Ensure this matches the alias in Course.belongsTo(User)
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']] // Optional: Order by creation date
    });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Get All Courses Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCourseDetailsForAdmin = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                { model: User, as: 'author', attributes: ['name', 'email'] }, // Alias from Course.belongsTo
                { model: CourseContent, as: 'contents' } // Alias from Course.hasMany (confirmed from error log)
            ]
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        // Use 'error' instead of 'err' to match the variable name in catch block
        console.error('Get Course Details Error:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const publishCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.status = 'approved'; // Using 'status' column and 'approved' value
    await course.save();
    res.status(200).json({ message: 'Course published successfully', course });
  } catch (err) {
    console.error('Publish Course Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteCourse = async (req, res) => {
    try {
        const result = await Course.destroy({ where: { id: req.params.id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        // Use 'error' instead of 'err' to match the variable name in catch block
        console.error('Delete Course Error:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { courseId: req.params.id },
      include: [{
        model: User,
        as: 'student', // IMPORTANT: Confirm this alias in models/enrollment.js
        attributes: ['id', 'name', 'email']
      }]
    });
    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Get Course Enrollments Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// === Student Management ===

const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.status(200).json(students);
  } catch (err) {
    console.error('Get All Students Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteStudent = async (req, res) => {
    try {
        const result = await User.destroy({ where: { id: req.params.id, role: 'student' } });
        if (result === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        // Use 'error' instead of 'err' to match the variable name in catch block
        console.error('Delete Student Error:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getStudentEnrollments = async (req, res) => {
    try {
        const userId = req.params.id;
        const enrollments = await Enrollment.findAll({
            where: { userId: userId },
            include: [{
                model: Course,
                as: 'course', // IMPORTANT: Confirm this alias in models/enrollment.js
                attributes: ['id', 'title']
            }]
        });
        const student = await User.findOne({ where: { id: userId, role: 'student' } });
        if (!student) {
             return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(enrollments);
    } catch (error) {
        // Use 'error' instead of 'err' to match the variable name in catch block
        console.error('Get Student Enrollments Error:', error); 
        res.status(500).json({ message: 'Error fetching student enrollments', error: error.message });
    }
};

// Ensure all functions are correctly exported
module.exports = {
  createAuthor,
  getAllAuthors,
  deleteAuthor,
  getAllCourses,
  getCourseDetailsForAdmin,
  publishCourse,
  deleteCourse,
  getCourseEnrollments,
  getAllStudents,
  deleteStudent,
  getStudentEnrollments
};

