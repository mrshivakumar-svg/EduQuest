const bcrypt = require('bcryptjs');
const { User, Course, Enrollment, Sequelize } = require('../models');

// === Author Management ===
const createAuthor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const author = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'author'
    });

    // Remove password from response
    const { password: _, ...authorData } = author.toJSON();
    res.status(201).json(authorData);
  } catch (err) {
    console.error('Create Author Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.findAll({
      where: { role: 'author' },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.status(200).json(authors);
  } catch (err) {
    console.error('Get All Authors Error:', err);
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

// === Course Management ===
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Get All Courses Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const publishCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isPublished = true;
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error('Publish Course Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { courseId: req.params.id },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Get Course Enrollments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === Student Management === // ✅ ADDED SECTION

/**
 * @desc    Get all student accounts
 * @route   GET /api/admin/students
 * @access  Private/Admin
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.status(200).json(students);
  } catch (err) {
    console.error('Get All Students Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a student account
 * @route   DELETE /api/admin/students/:id
 * @access  Private/Admin
 */
const deleteStudent = async (req, res) => {
    try {
        const result = await User.destroy({ where: { id: req.params.id, role: 'student' } });

        if (result === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Delete Student Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
  createAuthor,
  getAllAuthors,
  deleteAuthor,
  getAllCourses,
  publishCourse,
  getCourseEnrollments,
  getAllStudents,   // ✅ ADDED
  deleteStudent     // ✅ ADDED
};