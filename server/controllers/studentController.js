const { Course, CourseContent, Enrollment, User } = require("../models");
const { Op } = require("sequelize");
// Pagination helper
const getPagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return { limit, offset, page };
};
// Get all approved courses
exports.getAllCourses = async (req, res) => {
  try {
    const { q } = req.query;
    const { limit, offset, page } = getPagination(req);
    const where = {
      status: "approved",
      ...(q
        ? {
            [Op.or]: [
              { title: { [Op.iLike]: `%${q}%` } },
              { description: { [Op.iLike]: `%${q}%` } },
            ],
          }
        : {}),
    };
    const { count, rows } = await Course.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Enrollment,
          as: "enrollments",
          where: { userId: req.user.id }, // only current student's enrollments
          required: false, // include course even if not enrolled
        },
      ],
    });
    // Add isEnrolled flag to each course
    const coursesWithEnrollment = rows.map(course => ({
      ...course.dataValues,
      isEnrolled: course.enrollments && course.enrollments.length > 0
    }));
    res.status(200).json({ page, total: count, courses: coursesWithEnrollment });
  } catch (err) {
    console.error("Error fetching approved courses:", err);
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};
// Get single course details
exports.getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const course = await Course.findByPk(courseId, {
      include: [{ model: CourseContent, as: "contents" }],
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    const enrollment = await Enrollment.findOne({ where: { userId, courseId } });
    const isEnrolled = !!enrollment;
    const contents = isEnrolled
      ? course.contents
      : course.contents.map(c => ({
          id: c.id,
          title: c.title,
          contentType: c.contentType
        }));
    res.json({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      status: course.status,
      isEnrolled,
      contents
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details", error: err.message });
  }
};
// Enroll in course
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.status !== "approved")
      return res.status(400).json({ message: "Course not available" });
    const existing = await Enrollment.findOne({ where: { userId, courseId } });
    if (existing) return res.status(400).json({ message: "Already enrolled" });
    await Enrollment.create({ userId, courseId });
    res.status(201).json({ message: "Enrolled successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error enrolling", error: err.message });
  }
};
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: "course", // must match alias in Enrollment model!
          attributes: ["id", "title", "description", "thumbnailUrl", "status", "price"],
        },
      ],
    });
    res.json({ total: enrollments.length, enrollments });
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ message: "Error fetching enrollments", error: err.message });
  }
};
// Access course content
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;
    const enrollment = await Enrollment.findOne({ where: { userId, courseId } });
    if (!enrollment) return res.status(403).json({ message: "Access denied" });
    const content = await CourseContent.findOne({ where: { id: contentId, courseId } });
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Error fetching content", error: err.message });
  }
};
// Unenroll
exports.unenrollFromCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    const deleted = await Enrollment.destroy({ where: { userId, courseId } });
    if (!deleted) return res.status(404).json({ message: "Not enrolled in this course" });
    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unenrolling", error: err.message });
  }
};
// :white_check_mark: NEW: Get student profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id","name","email","createdAt"]
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};
// :white_check_mark: NEW: Get my courses (simplified for frontend)
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [{
        model: Course,
        as: "course", // must match alias in model
        attributes: ["id", "title", "description", "thumbnailUrl", "price"]
      }],
    });
    const courses = enrollments.map(e => e.course);
    res.json({ total: courses.length, courses });
  } catch (err) {
    console.error("Error fetching my courses:", err);
    res.status(500).json({ message: "Error fetching my courses", error: err.message });
  }
};

