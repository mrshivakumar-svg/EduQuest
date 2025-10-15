const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseContent = sequelize.define(
  "CourseContent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contentType: {
      type: DataTypes.ENUM("video", "pdf", "text", "image"),
      allowNull: false,
    },
  },
  {
    tableName: "course_contents",
    timestamps: true,
  }
);

// Associations
CourseContent.associate = (models) => {
  CourseContent.belongsTo(models.Course, { foreignKey: "courseId" });
};

module.exports = CourseContent;
