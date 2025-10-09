// server/server.js (skeleton)
require('dotenv').config();
const { connectDB } = require('./config/db'); 
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads')); // dev: serve uploaded files
connectDB();
app.get('/', (req, res) => res.json({ ok: true, message: 'EduQuest API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
