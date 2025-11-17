// server/routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Vẫn dùng middleware bảo vệ
const { GoogleGenerativeAI } = require('@google/generative-ai'); // <-- 1. Import thư viện Google

// 2. Khởi tạo client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Định nghĩa vai trò của AI (prompt hệ thống)
const systemPrompt = `Bạn là một chuyên gia tuyển dụng HR. 
Nhiệm vụ của bạn là nhận một đoạn mô tả công việc (từ CV) 
và viết lại nó một cách chuyên nghiệp, súc tích, 
sửa lỗi chính tả, ngữ pháp, và tập trung vào kết quả. 
Chỉ trả về đoạn văn bản đã được viết lại, không thêm lời chào hay giải thích.`;

// @route   POST /api/ai/enhance
// @desc    Nhận văn bản, gửi đến Gemini và trả về kết quả
// @access  Private
router.post('/enhance', auth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ msg: 'Văn bản đầu vào quá ngắn' });
  }

  try {
    // 4. Chọn model (gemini-1.5-flash là model nhanh, hiệu quả)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      systemInstruction: systemPrompt, // <-- Định nghĩa vai trò của AI
    });
    
    // 5. Gửi yêu cầu đến Gemini
    const result = await model.generateContent(text); // Chỉ cần gửi text của người dùng
    const response = await result.response;
    
    // 6. Lấy kết quả trả về
    const enhancedText = response.text();
    
    res.json({ enhancedText }); // Vẫn trả về JSON format như cũ

  } catch (err) {
    console.error('Lỗi khi gọi Google Gemini API:', err);
    res.status(500).send('Lỗi Server khi xử lý AI');
  }
});

module.exports = router;