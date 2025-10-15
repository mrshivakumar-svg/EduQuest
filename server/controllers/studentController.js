const { Course, CourseContent, Enrollment } = require("../models");
const { Op } = require("sequelize");

// Helper for pagination
const getPagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return { limit, offset, page };
};

// 1️⃣ Get all approved courses
exports.getAllCourses = async (req, res) => {
  try {
    const { q } = req.query; // search keyword
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
    });

    res.status(200).json({
      page,
      total: count,
      courses: rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

// 2️⃣ Get single course details
exports.getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findByPk(courseId, {
      include: [{ model: CourseContent, as: "contents" }],
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    // check if student is enrolled
    const enrollment = await Enrollment.findOne({ where: { userId, courseId } });
    const isEnrolled = !!enrollment;

    // hide file URLs if not enrolled
    const contents = isEnrolled
      ? course.contents
      : course.contents.map((c) => ({
          id: c.id,
          title: c.title,
          contentType: c.contentType,
        }));

    res.json({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      status: course.status,
      isEnrolled,
      contents,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details", error: err.message });
  }
};

// 3️⃣ Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.status !== "approved")
      return res.status(400).json({ message: "Course not available for enrollment" });

    const existing = await Enrollment.findOne({ where: { userId, courseId } });
    if (existing)
      return res.status(400).json({ message: "Already enrolled in this course" });

    await Enrollment.create({ userId, courseId });
    res.status(201).json({ message: "Enrolled successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error enrolling", error: err.message });
  }
};

// 4️⃣ View all enrolled courses
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        { model: Course, attributes: ["id", "title", "thumbnailUrl", "status", "price"] },
      ],
    });

    res.json({ total: enrollments.length, enrollments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching enrollments", error: err.message });
  }
};

// 5️⃣ Access specific course content
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ where: { userId, courseId } });
    if (!enrollment)
      return res.status(403).json({ message: "Access denied: not enrolled" });

    const content = await CourseContent.findOne({
      where: { id: contentId, courseId },
    });

    if (!content)
      return res.status(404).json({ message: "Content not found" });

    res.json({
      id: content.id,
      title: content.title,
      fileUrl: content.fileUrl,
      contentType: content.contentType,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching content", error: err.message });
  }
};

// 6️⃣ Unenroll from a course
exports.unenrollFromCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const deleted = await Enrollment.destroy({ where: { userId, courseId } });
    if (!deleted)
      return res.status(404).json({ message: "You are not enrolled in this course" });

    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unenrolling", error: err.message });
  }
};
