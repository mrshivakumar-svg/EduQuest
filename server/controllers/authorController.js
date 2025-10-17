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

    let newStatus = course.status;
    if (course.status === "approved") {
      newStatus = "pending";
    }

    await course.update({
      title,
      description,
      price,
      expiryDate,
      thumbnailUrl,
      status: newStatus, 
    });

    res.json({
      message:
        newStatus === "pending"
          ? "Course updated successfully and sent for re-approval."
          : "Course updated successfully.",
      course,
    });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: err.message });
  }
};

const addCourseContent = async (req, res) => {
  try {
    const { title, fileUrl, contentType } = req.body;
    const courseId = req.params.courseId; 

    const course = await Course.findOne({ where: { id: courseId, authorId: req.user.id } });
    if (!course) return res.status(404).json({ message: "Course not found or you are not the author" });

    // Create content
    const content = await CourseContent.create({
      courseId,
      title,
      fileUrl,
      contentType
    });

    res.status(201).json({ message: "Content added successfully", content });
  } catch (err) {
    console.error("Error adding content:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateCourseContent = async (req, res) => {
  try {
    const { title, fileUrl, contentType } = req.body;
    const { contentId } = req.params;

    // Find the content along with its course to verify ownership
    const content = await CourseContent.findOne({
      where: { id: contentId },
      include: [{ model: Course, as: "Course" }],
    });

    if (!content) return res.status(404).json({ message: "Content not found" });

    // Check if the logged-in user is the course author
    if (content.Course.authorId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this content" });
    }

    // Update content
    await content.update({ title, fileUrl, contentType });

    // If the parent course was approved, set it to pending again
    if (content.Course.status === "approved") {
      await content.Course.update({ status: "pending" });
    }

    res.json({
      message: "Content updated successfully. Course set to pending for re-approval.",
      content,
    });
  } catch (err) {
    console.error("Error updating content:", err);
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { id: req.params.id, authorId: req.user.id },
      include: [
        {
          model: CourseContent,
          as: "contents",
        },
      ],
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ course }); // wrap course inside an object for consistency
  } catch (err) {
    console.error("Error fetching course:", err);
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
  getCourseById,
  updateCourseContent
};









