// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware này sẽ giải mã token, lấy user.id và gán vào req.user
module.exports = function(req, res, next) {
  // Lấy token từ header
  const token = req.header('x-auth-token');

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
  }

  // Xác thực token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Gán user (chứa { id: ... }) vào request
    next(); // Đi tiếp
  } catch (err) {
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};