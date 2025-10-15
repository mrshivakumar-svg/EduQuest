const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const studentController = require("../controllers/studentController");

router.use(authMiddleware);
router.use(roleMiddleware("student"));


router.get("/courses", studentController.getAllCourses);


router.get("/courses/:id", studentController.getCourseDetails);


router.post("/courses/:id/enroll", studentController.enrollInCourse);


router.get("/my-enrollments", studentController.getMyEnrollments);


router.get("/courses/:courseId/contents/:contentId", studentController.getCourseContent);

//  Optional: Unenroll
router.delete("/courses/:id/unenroll", studentController.unenrollFromCourse);

module.exports = router;
