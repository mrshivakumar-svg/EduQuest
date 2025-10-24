const express = require('express');
const router = express.Router();

// Import the entire controller object
const adminController = require('../controllers/adminController');

// ✅ CORRECTED: Import both middleware functions from the object
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// ✅ CORRECTED: Apply both middleware functions correctly
// This protects all subsequent routes in this file
router.use(authMiddleware, roleMiddleware('admin'));


// === Author Management Routes ===
router.get('/authors', adminController.getAllAuthors);
router.post('/authors', adminController.createAuthor);
router.delete('/authors/:id', adminController.deleteAuthor);

// === Course Management Routes ===
router.get('/courses', adminController.getAllCourses);
router.get('/courses/:id', adminController.getCourseDetailsForAdmin);
router.put('/courses/:id/publish', adminController.publishCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.get('/courses/:id/enrollments', adminController.getCourseEnrollments);

// === Student Management Routes ===
router.get('/students', adminController.getAllStudents);
router.delete('/students/:id', adminController.deleteStudent);
router.get('/students/:id/enrollments', adminController.getStudentEnrollments);


module.exports = router;

