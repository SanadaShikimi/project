// server/models/CV.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa cấu trúc data (phải khớp với state trong React)
const ResumeDataSchema = new Schema({
  personal: {
    fullName: String,
    jobTitle: String,
    email: String,
    phone: String,
    address: String,
  },
  experience: [
    {
      id: Schema.Types.Mixed, // Dùng Mixed vì ID có thể là số (Date.now())
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String
    }
  ],
  education: [
    {
      id: Schema.Types.Mixed,
      school: String,
      degree: String,
      startDate: String,
      endDate: String
    }
  ],
  skills: [String]
});

const CVSchema = new Schema({
  // Liên kết CV này với một người dùng
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model 'User'
    required: true
  },
  
  // CV chính của người dùng (chúng ta chỉ làm 1 CV/user trước)
  resumeData: {
    type: ResumeDataSchema,
    required: true
  },
  
  // Tên CV (để sau này quản lý nhiều CV)
  cvName: {
    type: String,
    default: "CV Chính"
  }
}, { timestamps: true });

module.exports = mongoose.model('CV', CVSchema);