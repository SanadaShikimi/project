// server/index.js
require('dotenv').config(); // Phải gọi đầu tiên
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // <-- 1. Import file
const passport = require('passport'); // <-- 1. Import
const session = require('express-session'); // <-- 2. Import

require('./config/passport');
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Kết nối Database
connectDB(); 

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use(
  session({
    secret: 'm_luoi_qua_bao_oi_ngu_di', // Thay bằng key bí mật
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// API Routes
app.use('/api/auth', require('./routes/auth'));
app.get('/api/test', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với Backend API!' });
});

// Tích hợp Auth Routes (Bây giờ đã có thể chạy)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cvs', require('./routes/cvs')); 
app.use('/api/ai', require('./routes/ai'));

app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});