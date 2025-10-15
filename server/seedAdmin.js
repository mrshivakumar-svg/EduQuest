'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// --- 1. Database Configuration ---
const dbConfig = {
  database: 'EduQuest',
  username: 'postgres',
  password: '8340@Simran', 
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
};

// --- 2. Create a new Sequelize instance ---
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false
});

// --- 3. Define the User model ---
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'author', 'student'),
    allowNull: false,
  },
  // ✅ FIX: Define the timestamp columns for Sequelize
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'users',
  timestamps: true // ✅ FIX: Change this from false to true
});


// --- 4. Main function to create the admin ---
const createSeedAdmin = async () => {
  try {
    console.log('Connecting to the database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    const adminEmail = 'admin@eduquest.com';
    const adminPassword = 'adminpassword123';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists. No action taken.');
      return;
    }

    console.log('Admin user not found. Creating a new one...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');

  } catch (error) {
    console.error('❌ Error creating seed admin:', error);
  } finally {
    console.log('Closing database connection...');
    await sequelize.close();
  }
};

// --- 5. Run the function ---
createSeedAdmin();