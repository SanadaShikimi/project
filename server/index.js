// server/index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport'); 
const session = require('express-session'); 

require('./config/passport');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Kết nối Database
connectDB(); 

// 2. Cấu hình CORS (SỬA ĐỔI QUAN TRỌNG)
// Cho phép cả localhost (khi dev) và Netlify (khi production)
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));

app.use(express.json());

// 3. Cấu hình Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'm_luoi_qua_bao_oi_ngu_di', // Nên dùng biến môi trường
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 4. Route kiểm tra Server (ĐÃ CHUYỂN LÊN TRÊN)
// Đây là route để Render biết server đang sống, không bị lỗi 404
app.get('/', (req, res) => {
  res.send('Backend Server is Running Successfully!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với Backend API!' });
});

// 5. Các API Routes chính
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cvs', require('./routes/cvs')); 
app.use('/api/ai', require('./routes/ai'));
// (Bạn bị lặp dòng app.use('/api/auth'...) nên tôi đã xóa bớt 1 dòng)

// 6. Khởi chạy Server (LUÔN Ở CUỐI CÙNG)
app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});