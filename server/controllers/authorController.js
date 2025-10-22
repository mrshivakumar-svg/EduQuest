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

const getAuthorProfile = async (req, res) => {
  try {
    // Fetch author details with their courses
    const author = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Course,
          as: "courses", // must match association alias in User model
          attributes: ["id", "title"],
          include: [
            {
              model: Enrollment,
              as: "enrollments", // must match alias in Course model
              attributes: [],
            },
          ],
        },
      ],
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Count enrollments for each course
    const coursesWithCounts = await Promise.all(
      author.courses.map(async (course) => {
        const enrollmentsCount = await Enrollment.count({
          where: { courseId: course.id },
        });
        return {
          id: course.id,
          title: course.title,
          enrollments: enrollmentsCount,
        };
      })
    );

    res.json({
      id: author.id,
      name: author.name,
      email: author.email,
      courses: coursesWithCounts,
    });
  } catch (err) {
    console.error("Error fetching author profile:", err);
    res.status(500).json({ message: err.message });
  }
};



const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnailUrl, expiryDate } = req.body;

    // Find the course
    const course = await Course.findOne({ where: { id } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify author ownership
    if (course.authorId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this course" });
    }

    // ✅ Update course details but preserve approval status if already approved
    const updatedData = {
      title,
      description,
      price,
      thumbnailUrl,
      expiryDate,
    };

    // Only change status if it’s *not* approved
    if (course.status !== "approved") {
      updatedData.status = "pending";
    }

    await course.update(updatedData);

    res.json({
      message: `Course updated successfully. Status remains '${course.status}'.`,
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
    // if (content.Course.status === "approved") {
    //   await content.Course.update({ status: "pending" });
    // }

    res.json({
      message: "Content updated successfully",
      content,
    });
  } catch (err) {
    console.error("Error updating content:", err);
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Allow both authors (checking authorId) and students (no author restriction)
    const whereCondition = req.user.role === "author" 
      ? { id, authorId: req.user.id }
      : { id }; // students just fetch approved courses

    const course = await Course.findOne({
      where: whereCondition,
      include: [
        {
          model: CourseContent,
          as: "contents",
          attributes: ["id", "title", "fileUrl", "contentType"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "status",
        "thumbnailUrl",
        "expiryDate",
        "createdAt"
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: err.message });
  }
};


const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { authorId: req.user.id },
      include: [
        {
          model: CourseContent,
          as: "contents",
        },
        {
          model: Enrollment,
          as: "enrollments",
          attributes: ["id"], // minimal attributes
        },
      ],
    });

    // Map courses to include enrollments count
    const coursesWithEnrollments = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      status: course.status,
      thumbnailUrl: course.thumbnailUrl,
      enrollmentsCount: course.enrollments.length,
    }));

    res.json({ courses: coursesWithEnrollments });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createCourse,
  updateCourse,
  addCourseContent,
  getMyCourses,
  getCourseById,
  updateCourseContent,
  getAuthorProfile,
};









