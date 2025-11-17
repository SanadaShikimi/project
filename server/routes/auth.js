// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // <-- THÊM DÒNG NÀY
const User = require('../models/User.model'); // <-- Quan trọng

// POST /api/auth/register (Đăng ký)
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // 1. Kiểm tra email đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email đã tồn tại' });
    }

    // 2. Tạo user mới
    user = new User({ fullName, email, password });
    await user.save(); // Mật khẩu sẽ tự động được mã hóa (nhờ pre-save hook)

    // 3. Tạo và trả về token (JWT)
    const payload = { user: { id: user.id } };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Lấy key bí mật từ file .env
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server');
  }
});

// POST /api/auth/login (Đăng nhập)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Kiểm tra email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng' });
    }

    // 3. Tạo và trả về token
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server');
  }
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Bước 2: Google sẽ redirect về đây sau khi thành công
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login`, // Thất bại về trang login
    session: false // Không dùng session
  }),
  (req, res) => {
    // Thành công! passport.use() đã chạy và trả về { token } trong req.user
    const token = req.user.token;
    // Chuyển hướng về Frontend, gửi kèm token qua URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;