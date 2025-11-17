// server/routes/cvs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import middleware bảo vệ
const CV = require('../models/CV.model');
const User = require('../models/User.model'); // <-- THÊM DÒNG NÀY
// Dữ liệu CV mặc định cho một CV mới
const initialResumeData = {
  style: {
    themeColor: '#007bff',
    fontFamily: "'Inter', sans-serif",
    template: 'modern',
  },
  personal: {
    fullName: "Nguyễn Văn A",
    jobTitle: "Chuyên gia...",
    email: "example@email.com",
    phone: "",
    address: "",
  },
  experience: [],
  education: [],
  skills: []
};


// @route   GET /api/cvs/all
// @desc    Lấy TẤT CẢ CV của người dùng (chỉ lấy tên và id)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user.id })
                      .select('cvName updatedAt'); // Chỉ chọn Tên và ngày cập nhật
    res.json(cvs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server');
  }
});

// @route   GET /api/cvs/load/:cvId
// @desc    Tải MỘT CV CỤ THỂ bằng ID
// @access  Private
router.get('/load/:cvId', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({
      _id: req.params.cvId,
      user: req.user.id // Đảm bảo CV này là của user
    });

    if (!cv) {
      return res.status(404).json({ msg: 'Không tìm thấy CV' });
    }
    res.json(cv.resumeData); // Trả về data
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') { // Nếu ID không đúng định dạng
      return res.status(404).json({ msg: 'Không tìm thấy CV' });
    }
    res.status(500).send('Lỗi Server');
  }
});

// @route   POST /api/cvs/save/:cvId
// @desc    Lưu (cập nhật) MỘT CV CỤ THỂ
// @access  Private
router.post('/save/:cvId', auth, async (req, res) => {
  const resumeData = req.body;
  const userId = req.user.id;

  try {
    let cv = await CV.findOne({
      _id: req.params.cvId,
      user: userId
    });

    if (!cv) {
      return res.status(404).json({ msg: 'Không tìm thấy CV' });
    }
    
    // Cập nhật
    cv.resumeData = resumeData;
    // Cập nhật tên CV nếu có (ví dụ)
    // cv.cvName = resumeData.personal.fullName; 
    
    await cv.save();
    res.json({ msg: 'CV đã được cập nhật', data: cv.resumeData });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server');
  }
});

// @route   POST /api/cvs/create
// @desc    Tạo một CV mới, rỗng
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    // Lấy email và tên của user để điền sẵn
    const user = await User.findById(req.user.id).select('email fullName');
    
    let defaultData = JSON.parse(JSON.stringify(initialResumeData)); // Copy
    defaultData.personal.fullName = user.fullName;
    defaultData.personal.email = user.email;

    const newCV = new CV({
      user: req.user.id,
      cvName: "CV mới (Chưa có tên)", // Tên mặc định
      resumeData: defaultData
    });

    await newCV.save();
    res.status(201).json(newCV); // Trả về CV đầy đủ (gồm cả ID mới)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi Server');
  }
});

module.exports = router;