// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // Phải khớp với Google Console
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Hàm callback này chạy sau khi Google xác thực thành công
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Nếu user đã tồn tại (đăng ký bằng email thường)
          // Bạn có thể thêm logic gộp tài khoản (ví dụ: user.googleId = profile.id)
        } else {
          // Nếu user chưa tồn tại, tạo user mới
          user = new User({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            // googleId: profile.id, // Bạn có thể thêm trường này vào Model
            password: 'google_user_no_password', // Mật khẩu tạm (sẽ không bao giờ dùng)
          });
          // Lưu ý: pre-save hook sẽ hash mật khẩu này
          await user.save();
        }
        
        // Tạo JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Gửi token đi qua hàm done
        done(null, { token });

      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Passport không cần serialize/deserialize user khi dùng JWT
// Chỉ cần thiết lập để nó không dùng session
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});