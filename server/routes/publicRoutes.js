const express = require("express");
const router = express.Router();
const { Course } = require("../models");

router.get("/courses", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const { count, rows } = await Course.findAndCountAll({
      where: { status: "approved" },
      attributes: ["id", "title", "description", "price", "thumbnailUrl", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      courses: rows,
      total: count,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
    });
  } catch (err) {
    console.error("Error fetching public courses:", err);
    res.status(500).json({ message: "Error fetching public courses", error: err.message });
  }
});


module.exports = router;
