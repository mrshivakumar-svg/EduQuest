const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const studentController = require("../controllers/studentController");

// Use auth middleware with role "student"
router.use(authMiddleware("student"));

// Routes
router.get("/courses", studentController.getAllCourses);
router.get("/courses/:id", studentController.getCourseDetails);
router.post("/courses/:id/enroll", studentController.enrollInCourse);
router.get("/my-enrollments", studentController.getMyEnrollments);
router.get("/courses/:courseId/contents/:contentId", studentController.getCourseContent);
router.delete("/courses/:id/unenroll", studentController.unenrollFromCourse);

// NEW ROUTE: Get student profile
router.get("/profile", studentController.getProfile);

// NEW ROUTE: Get my courses (same as enrollments but simplified for frontend)
router.get("/my-courses", studentController.getMyCourses);

module.exports = router;
