const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "enrollments",
    timestamps: false,
    indexes: [{ unique: true, fields: ["userId", "courseId"] }],
  }
);

// Associations
Enrollment.associate = (models) => {
  Enrollment.belongsTo(models.User, { foreignKey: "userId", as: "student" });
  Enrollment.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
};

module.exports = Enrollment;
