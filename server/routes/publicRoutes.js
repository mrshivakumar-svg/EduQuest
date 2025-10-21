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
      attributes: ["id", "title", "price", "thumbnailUrl", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      courses: rows,
      total: count,
      hasMore: offset + limit < count,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching public courses", error: err.message });
  }
});

module.exports = router;
