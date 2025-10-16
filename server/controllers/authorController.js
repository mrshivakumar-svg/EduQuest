const { Course, CourseContent, Enrollment, User } = require("../models");
const createCourse = async (req, res) => {
    try {
        const { title, description, price, expiryDate, thumbnailUrl } = req.body;
        console.debug("Creating course with data:", {
            title,
            description,
            price,
            expiryDate,
            thumbnailUrl,
            authorId: req.user.id,
        });
        const course = await Course.create({
            title,
            description,
            price,
            expiryDate,
            thumbnailUrl,
            authorId: req.user.id,
        });
        console.debug("Course created:", course);
        res.status(201).json({
            message: "Course created successfully, pending admin approval",
            course,
        });
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: err.message });
    }
};
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, expiryDate, thumbnailUrl } = req.body;
    const course = await Course.findOne({ where: { id, authorId: req.user.id } });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.status !== "pending") {
      return res.status(403).json({ message: "Cannot edit approved/rejected courses" });
    }
    await course.update({ title, description, price, expiryDate, thumbnailUrl });
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: err.message });
  }
};
const addCourseContent = async (req, res) => {
  try {
    const { courseId, title, fileUrl, contentType } = req.body;
    // Ensure the author owns this course
    const course = await Course.findOne({ where: { id: courseId, authorId: req.user.id } });
    if (!course) return res.status(404).json({ message: "Course not found" });
    const content = await CourseContent.create({ courseId, title, fileUrl, contentType });
    res.status(201).json({ message: "Content added successfully", content });
  } catch (err) {
    console.error("Error adding content:", err);
    res.status(500).json({ message: err.message });
  }
};
const getMyCourses = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    console.log("🔑 Logged-in user:", req.user);
    const courses = await Course.findAll({
      where: { authorId: req.user.id },
      include: [
        {
          model: CourseContent,
          as: "contents",
        },
      ],
    });

    console.log("📚 Courses fetched:", courses.length);

    res.json({ courses });
  } catch (err) {
    console.error("❌ Error fetching author's courses:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  addCourseContent,
  getMyCourses,
};









