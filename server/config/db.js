// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Lấy chuỗi kết nối từ file .env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Các tùy chọn này để tránh cảnh báo của Mongoose
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Lỗi kết nối MongoDB: ${err.message}`);
    // Thoát khỏi quy trình với lỗi
    process.exit(1);
  }
};

module.exports = connectDB;