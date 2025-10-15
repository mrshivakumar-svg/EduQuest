const bcrypt = require('bcryptjs');
const { User, Course, Enrollment, Sequelize } = require('../models'); // Adjust if your model import is different

// === Author Management ===

/**
 * @desc    Create a new author account
 * @route   POST /api/admin/authors
 * @access  Private/Admin
 */
const createAuthor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if author already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password and create user with 'author' role
    const hashedPassword = await bcrypt.hash(password, 10);
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
      role: author.role,
    });
  } catch (err) {
    console.error('Create Author Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all author accounts
 * @route   GET /api/admin/authors
 * @access  Private/Admin
 */
const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.findAll({
      where: { role: 'author' },
      attributes: ['id', 'name', 'email', 'createdAt'] // Exclude password from response
    });
    res.status(200).json(authors);
  } catch (err) {
    console.error('Get All Authors Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete an author account
 * @route   DELETE /api/admin/authors/:id
 * @access  Private/Admin
 */
const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const result = await User.destroy({ where: { id: authorId, role: 'author' } });

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

/**
 * @desc    Get all courses from all authors
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'] // Include author's name
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Get All Courses Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Publish a course (change status to 'approved')
 * @route   PUT /api/admin/courses/:id/publish
 * @access  Private/Admin
 */
const publishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.status = 'approved'; // As per your schema 'approved' status
    await course.save();

    res.status(200).json({ message: 'Course published successfully', course });
  } catch (err) {
    console.error('Publish Course Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all enrollments for a specific course
 * @route   GET /api/admin/courses/:id/enrollments
 * @access  Private/Admin
 */
const getCourseEnrollments = async (req, res) => {
  try {
    const courseId = req.params.id;
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{
        model: User, // Include the student's details
        attributes: ['id', 'name', 'email']
      }]
    });
    res.status(200).json(enrollments);
  } catch (err) {
    console.error('Get Enrollments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createAuthor,
  getAllAuthors,
  deleteAuthor,
  getAllCourses,
  publishCourse,
  getCourseEnrollments
};