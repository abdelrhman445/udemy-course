<template>
  <div class="about-page">
    <div class="container">
      <div class="glass-card main-info">
        <div class="profile-section">
          <div class="avatar-glow">
            <img
              src="../../public/profile.jpg"
              alt="RILLZO"
              class="avatar"
            >
          </div>
          <h1 class="neon-title">
            AbdUlrahMan Elsaid
          </h1>
          <p class="role">
            InfoSec Enthusiast | Full-Stack Developer
          </p>
          
          <div class="social-badges">
            <a
              href="https://www.youtube.com/@NullSpecterAcademy"
              target="_blank"
              class="social-link"
            >
              <span class="badge yt">YouTube</span>
            </a>
            <a
              href="https://discord.gg/jacRHySAv2"
              target="_blank"
              class="social-link"
            >
              <span class="badge tg">Discord</span>
            </a>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="glass-card detail-box">
          <h3>🛡️ Cybersecurity</h3>
          <p>متخصص في تحليل الأنظمة واكتشاف الثغرات. هدفي هو بناء مجتمع ليكون مرجعاً لكل مهتم بالأمن السيبراني.</p>
        </div>

        <div class="glass-card detail-box">
          <h3>💻 Development</h3>
          <p>    انا مبرمج مهتم بال (full-stack) واحب عمل كل ما هو جديد واريد نشر العلم وانشاء مجتمع تقني قوي مهتم بالامان منافس للاجانب</p>
        </div>

        <div class="glass-card detail-box full-width">
          <h3>🚀 The Vision</h3>
          <p>توفير المحتوى التعليمي عالي الجودة (مثل كورسات Udemy) مجاناً للجميع، لدعم الجيل القادم من المبرمجين والهاكرز الأخلاقيين.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* إعدادات الصفحة الأساسية */
.about-page {
  background: #050505;
  min-height: 100vh;
  padding: 140px 20px 80px 20px;
  color: #e0e0e0;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* تأثير الزجاج (Glassmorphism) */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 24px;
  transition: 0.4s ease;
}

.glass-card:hover {
  border-color: #00f2ff;
  box-shadow: 0 0 30px rgba(0, 242, 255, 0.1);
  transform: translateY(-5px);
}

/* البروفايل */
.profile-section {
  text-align: center;
}

.avatar-glow {
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(45deg, #00f2ff, #7000ff);
  box-shadow: 0 0 25px rgba(0, 242, 255, 0.5);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #050505;
}

.neon-title {
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(to right, #00f2ff, #7000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 10px 0;
}

.role {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

/* البادجات والروابط */
.social-badges {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  text-decoration: none !important; /* ✅ السطر السحري اللي بيشيل الخط السفلي */
  display: inline-block;
}

.badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.95rem;
  font-weight: bold;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* تأثيرات الـ Hover للأزرار */
.badge:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.yt { 
  background: rgba(255, 0, 0, 0.2); 
  color: #ff4d4d; 
  border: 1px solid #ff0000; 
}

.tg { 
  background: rgba(88, 101, 242, 0.2); /* لون ديسكورد الرسمي */
  color: #5865f2; 
  border: 1px solid #5865f2; 
}

/* شبكة المعلومات (Responsive Grid) */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-box h3 {
  color: #00f2ff;
  margin-bottom: 15px;
}

.full-width {
  grid-column: span 2;
}

/* توافق الشاشات الصغيرة (Mobile) */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
  .neon-title {
    font-size: 2.5rem;
  }
}
</style>