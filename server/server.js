require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();

// Import your models
const User = require('./models/userModel'); // ✅ make sure this line is here
const Course = require('./models/course');
const CourseContent = require('./models/courseContent');
const Enrollment = require('./models/enrollment');

// Import models index to set up associations
const db = require('./models');

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoute"));

app.get('/', (req, res) => res.json({ ok: true, message: 'EduQuest API running' }));

const PORT = process.env.PORT || 5000;

// ✅ Initialize database and sync tables before starting server
const startServer = async () => {
  try {
    await connectDB();

    // ✅ This creates the tables automatically if they don’t exist
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized with the database");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
