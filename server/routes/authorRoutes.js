const express = require('express');
const router = express.Router();

// ✅ UPDATED: Import both middleware functions correctly
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Import controller functions (assuming your authorController exports these)
// Make sure your authorController.js exports all these functions
const authorController = require('../controllers/authorController');

// ✅ CORRECTED: Apply both middleware functions correctly
// This protects all routes defined after this line in this file
router.use(authMiddleware, roleMiddleware('author'));

// All routes below are now protected and require an author role

// --- Course Routes ---
router.post('/courses', authorController.createCourse);
router.put('/courses/:id', authorController.updateCourse);
router.get('/courses', authorController.getMyCourses); // Assuming this gets author's courses
router.get('/courses/:id', authorController.getCourseById);

// --- Content Routes ---
router.post('/courses/:courseId/contents', authorController.addCourseContent);
router.put('/contents/:contentId', authorController.updateCourseContent);
router.delete('/contents/:contentId', authorController.deleteCourseContent);

// --- Profile Route ---
router.get('/profile', authorController.getAuthorProfile); // Already protected by router.use above

module.exports = router;

