const express = require('express');
const router = express.Router();

// ✅ CORRECTED IMPORTS
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {
  createAuthor,
  getAllAuthors,
  deleteAuthor,
  getAllCourses,
  publishCourse,
  getCourseEnrollments
} = require('../controllers/adminController');


// This middleware will protect all routes in this file
// It first checks for a valid token, then checks if the user role is 'admin'
router.use(authMiddleware, roleMiddleware('admin'));


// === Author Management Routes ===
router.get('/authors', getAllAuthors);
router.post('/authors', createAuthor);
router.delete('/authors/:id', deleteAuthor);

// === Course Management Routes ===
router.get('/courses', getAllCourses);
router.put('/courses/:id/publish', publishCourse);
router.get('/courses/:id/enrollments', getCourseEnrollments);


module.exports = router;