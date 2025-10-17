const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorController = require("../controllers/authorController");
router.use(authMiddleware());
// course routes
router.post("/courses", authorController.createCourse);
router.put("/courses/:id", authorController.updateCourse);
router.get("/courses", authorController.getMyCourses);
router.get("/courses/:id", authorController.getCourseById);
// content routes
router.post("/courses/:courseId/contents", authorController.addCourseContent);
router.put("/contents/:contentId", authorController.updateCourseContent);

module.exports = router;