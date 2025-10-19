const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
       model: 'users',
       key: 'id'
  }
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

// Associations
Course.associate = (models) => {
  Course.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
  Course.hasMany(models.CourseContent, { foreignKey: "courseId", as: "contents" });
  Course.hasMany(models.Enrollment, { foreignKey: "courseId", as: "enrollments" });
};

module.exports = Course;
