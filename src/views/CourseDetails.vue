<template>
  <div class="details-wrapper">
    <div
      v-if="course"
      class="container"
    >
      <div class="glass-container">
        <div class="image-section">
          <div class="image-glow">
            <img
              :src="course.image || fallbackImage"
              :alt="course.title"
              class="main-img"
              @error="handleImageError"
            >
          </div>
        </div>

        <div class="content-section">
          <div class="meta-data">
            <span class="category-tag">{{ course.category }}</span>
            <span class="date-tag">📅 {{ formatDate(course.addedAt) }}</span>
          </div>

          <h1 class="course-title">
            {{ course.title }}
          </h1>
          
          <div class="pricing-card">
            <div class="price-row" />
            <div class="price-row highlight">
              <span class="price-label">العرض الحالي:</span>
              <span class="free-text">مجاني تماماً ⚡</span>
            </div>
          </div>

          <div class="action-bar">
            <a
              :href="course.udemyLink"
              target="_blank"
              class="mega-btn cyber-hover"
            >
              GET COUPON NOW 
            </a>
            <p class="secure-text">
              🛡️ رابط آمن مباشر للكوبون
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="loader-wrapper"
    >
      <div class="water-vortex">
        <div class="core-point" />
        <span class="ring-outer" />
        <span class="ring-inner" />
      </div>
      <p class="loader-text">
        جاري سحب البيانات من المنجم...
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // السنترال المربوط بـ Vercel/HuggingFace

export default {
  data() { 
    return { 
      course: null,
      // صورة احتياطية مرسومة بالكود عشان نمنع إيرور ERR_NAME_NOT_RESOLVED
      fallbackImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%2312121f' stroke='%23a435f0' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' fill='%2300ff88' font-family='Arial, sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E404 - NO IMAGE%3C/text%3E%3C/svg%3E"
    }; 
  },
  async created() {
    try {
      const id = this.$route.params.id || window.location.pathname.split('/').pop(); 
      const res = await api.get(`/courses/${id}`);
      this.course = res.data;
    } catch (err) { 
      console.error("خطأ في جلب التفاصيل يا وحش:", err); 
    }
  },
  methods: {
    formatDate(date) { 
      return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }); 
    },
    // دالة التعامل مع الصور البايظة
    handleImageError(event) {
      event.target.src = this.fallbackImage;
    }
  }
}
</script>

<style scoped>
/* الإعدادات الأساسية وتحسين التجاوب */
.details-wrapper {
  padding-top: 140px;
  min-height: 100vh;
  background: radial-gradient(circle at top, #121225 0%, #080810 100%);
  direction: rtl;
  color: #fff;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* الكارت الزجاجي المطور */
.glass-container {
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(164, 53, 240, 0.3);
  border-radius: 35px;
  display: flex;
  flex-wrap: wrap; 
  gap: 50px;
  padding: 50px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(164,53,240,0.05);
  animation: slideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

/* تنسيق الصورة النيون */
.image-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-glow {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.image-glow::after {
  content: "";
  position: absolute;
  top: 50%; left: 50%; 
  transform: translate(-50%, -50%);
  width: 110%; height: 110%;
  background: #a435f0;
  filter: blur(60px);
  opacity: 0.25;
  z-index: 1;
  animation: pulseGlow 3s infinite alternate;
}

.main-img {
  width: 100%;
  border-radius: 20px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.6);
  transition: transform 0.5s ease;
}
.main-img:hover {
  transform: scale(1.03);
}

/* تنسيق المحتوى */
.content-section {
  flex: 1.2;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.meta-data {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
}

.category-tag {
  background: rgba(164, 53, 240, 0.15);
  color: #fff;
  padding: 8px 22px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.95rem;
  border: 1px solid rgba(164, 53, 240, 0.5);
  box-shadow: 0 0 15px rgba(164,53,240,0.2);
}

.date-tag { color: #a0a0b0; font-size: 0.9rem; font-weight: 600; }

.course-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  line-height: 1.3;
  margin-bottom: 35px;
  background: linear-gradient(135deg, #fff 30%, #a435f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 10px rgba(164,53,240,0.2));
}

/* كارت التسعير */
.pricing-card {
  background: rgba(10, 10, 18, 0.6);
  padding: 25px 30px;
  border-radius: 20px;
  margin-bottom: 40px;
  border: 1px solid rgba(0,255,136,0.15);
  box-shadow: inset 0 0 20px rgba(0,255,136,0.02);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label { color: #ccc; font-weight: 700; font-size: 1.1rem; }
.free-text { color: #00ff88; font-weight: 900; font-size: 1.8rem; text-shadow: 0 0 15px rgba(0, 255, 136, 0.4); animation: pulseText 2s infinite alternate;}

/* زر التحميل العملاق */
.mega-btn {
  display: block;
  background: linear-gradient(135deg, #a435f0 0%, #6e21a8 100%);
  color: #fff;
  text-align: center;
  text-decoration: none;
  padding: 22px;
  border-radius: 60px;
  font-weight: 900;
  font-size: 1.4rem;
  box-shadow: 0 15px 35px rgba(164, 53, 240, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid transparent;
}

/* تأثير اللمعة (Sweep Effect) للزر */
.cyber-hover {
  position: relative;
  overflow: hidden;
}
.cyber-hover::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: 0.6s ease;
}
.cyber-hover:hover::before {
  left: 100%;
}
.cyber-hover:hover {
  transform: translateY(-7px) scale(1.02);
  box-shadow: 0 20px 40px rgba(164, 53, 240, 0.6);
  background: linear-gradient(135deg, #b84df5 0%, #852bc9 100%);
}

.secure-text {
  text-align: center;
  margin-top: 20px;
  color: #888;
  font-size: 0.95rem;
  font-weight: 600;
}

/* شاشة التحميل - مفاعل النيون */
.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.water-vortex { position: relative; width: 120px; height: 120px; display: flex; justify-content: center; align-items: center; margin-bottom: 30px;}
.core-point { position: absolute; width: 70px; height: 70px; border-radius: 50%; border: 4px solid transparent; border-top-color: #00ff88; border-bottom-color: #a435f0; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; box-shadow: 0 0 25px rgba(164,53,240,0.5); z-index: 3; }
.ring-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed rgba(0,255,136,0.5); animation: spinReverse 4s linear infinite; z-index: 1; }
.ring-inner { position: absolute; width: 35px; height: 35px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 35px #a435f0; animation: pulseCore 0.8s infinite alternate; z-index: 2; }

.loader-text {
  color: #a435f0;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
  animation: pulseText 1.5s infinite alternate;
}

/* Keyframes الأنيميشن */
@keyframes slideIn { 
  to { opacity: 1; transform: translateY(0) scale(1); } 
}
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spinReverse { 100% { transform: rotate(-360deg); } }
@keyframes pulseCore { from{opacity:0.6; transform:scale(0.8)} to{opacity:1; transform:scale(1.2)} }
@keyframes pulseGlow { from{opacity:0.15; transform: translate(-50%, -50%) scale(0.9)} to{opacity:0.3; transform: translate(-50%, -50%) scale(1.1)} }
@keyframes pulseText { from{opacity:0.7;} to{opacity:1;} }

/* استعلامات الوسائط (Responsiveness) */
@media (max-width: 992px) {
  .glass-container { padding: 40px 30px; gap: 40px; }
}

@media (max-width: 768px) {
  .glass-container { flex-direction: column; align-items: center; text-align: center; padding: 30px 20px;}
  .meta-data { justify-content: center; }
  .image-section { order: -1; width: 100%; } 
  .mega-btn { font-size: 1.2rem; padding: 18px; }
  .price-row { flex-direction: column; gap: 10px; justify-content: center; }
}
</style>