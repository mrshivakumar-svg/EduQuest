const express = require('express');
const router = express.Router();

// ✅ Import both middleware functions correctly
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// ✅ Import all necessary controller functions
const {
  getAllCourses, // Renamed from getAllPublishedCourses for clarity, assuming controller has this
  getCourseDetails,
  enrollInCourse,
  getMyEnrollments,
  getCourseContentUnified,
  unenrollFromCourse,
  getProfile, // Assuming studentController exports this
  getMyCourses, // Assuming studentController exports this
  getPublicCourses // Assuming studentController exports this
} = require('../controllers/studentController');

// --- Public Routes ---
// Anyone can see the list of published courses
router.get('/public-courses', getPublicCourses);

// --- Protected Routes (Require Student Login) ---
// Apply middleware specifically to routes that need protection

// Get all courses (requires login, maybe shows enrolled status?)
router.get('/courses', authMiddleware, roleMiddleware('student'), getAllCourses);

// Get details for a specific course (requires login)
router.get('/courses/:id', authMiddleware, roleMiddleware('student'), getCourseDetails);

// Enroll in a course (requires login)
router.post('/courses/:id/enroll', authMiddleware, roleMiddleware('student'), enrollInCourse);

// View personal enrollments (requires login)
router.get('/my-enrollments', authMiddleware, roleMiddleware('student'), getMyEnrollments);

// Access specific course content (requires login)
router.get('/courses/:courseId/contents/:contentId', authMiddleware, getCourseContentUnified);

// Unenroll from a course (requires login)
router.delete('/courses/:id/unenroll', authMiddleware, roleMiddleware('student'), unenrollFromCourse);

// Get student profile (requires login)
router.get('/profile', authMiddleware, roleMiddleware('student'), getProfile);

// Get enrolled courses (requires login)
router.get('/my-courses', authMiddleware, roleMiddleware('student'), getMyCourses);

module.exports = router;

