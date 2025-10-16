const express = require('express');
const router = express.Router();

const {
  createAuthor,
  getAllAuthors,
  deleteAuthor,
  getAllCourses,
  publishCourse,
  getCourseEnrollments,
  getAllStudents,
  deleteStudent
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');

// This middleware protects all routes in this file
router.use(authMiddleware('admin'));

// === Author Management Routes ===
router.get('/authors', getAllAuthors);
router.post('/authors', createAuthor);
router.delete('/authors/:id', deleteAuthor);

// === Course Management Routes ===
router.get('/courses', getAllCourses);
router.put('/courses/:id/publish', publishCourse);
router.get('/courses/:id/enrollments', getCourseEnrollments);

// === Student Management Routes ===
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);

module.exports = router;