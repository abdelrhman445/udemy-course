<template>
  <div class="details-wrapper">
    <div class="container" v-if="course">
      <div class="glass-container">
        <div class="image-section">
          <div class="image-glow">
            <img :src="course.image" :alt="course.title" class="main-img">
          </div>
        </div>

        <div class="content-section">
          <div class="meta-data">
            <span class="category-tag">{{ course.category }}</span>
            <span class="date-tag">📅 {{ formatDate(course.addedAt) }}</span>
          </div>

          <h1 class="course-title">{{ course.title }}</h1>
          
          <div class="pricing-card">
            <div class="price-row">
              </div>
            <div class="price-row highlight">
              <span class="price-label">العرض الحالي:</span>
              <span class="free-text">مجاني تماماً ⚡</span>
            </div>
          </div>

          <div class="action-bar">
            <a :href="course.udemyLink" target="_blank" class="mega-btn">
              GET COUPON NOW 
            </a>
            <p class="secure-text">🛡️ رابط آمن مباشر للكوبون</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loader-wrapper">
      <div class="neon-pulse"></div>
      <p>جاري سحب البيانات من المنجم...</p>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // السنترال المربوط بـ Vercel/HuggingFace

export default {
  data() { return { course: null }; },
  async created() {
    try {
      const id = this.$route.params.id; // استلام الـ ID من الرابط
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* الكارت الزجاجي المطور */
.glass-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(164, 53, 240, 0.2);
  border-radius: 35px;
  display: flex;
  flex-wrap: wrap; 
  gap: 50px;
  padding: 50px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

/* تنسيق الصورة النيون */
.image-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
}

.image-glow {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.image-glow::after {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: #a435f0;
  filter: blur(60px);
  opacity: 0.2;
  z-index: 1;
}

.main-img {
  width: 100%;
  border-radius: 20px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
}

.category-tag {
  background: rgba(164, 53, 240, 0.15);
  color: #a435f0;
  padding: 6px 20px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.9rem;
  border: 1px solid rgba(164, 53, 240, 0.3);
}

.date-tag { color: #888; font-size: 0.9rem; }

.course-title {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 35px;
  text-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* كارت التسعير */
.pricing-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 40px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.price-label { color: #bbb; font-weight: 600; }
.free-text { color: #00ff88; font-weight: 900; font-size: 1.5rem; text-shadow: 0 0 10px rgba(0, 255, 136, 0.3); }

/* زر التحميل العملاق */
.mega-btn {
  display: block;
  background: linear-gradient(135deg, #a435f0 0%, #7e22ce 100%);
  color: #fff;
  text-align: center;
  text-decoration: none;
  padding: 20px;
  border-radius: 60px;
  font-weight: 900;
  font-size: 1.4rem;
  box-shadow: 0 15px 35px rgba(164, 53, 240, 0.4);
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mega-btn:hover {
  transform: translateY(-7px);
  box-shadow: 0 20px 50px rgba(164, 53, 240, 0.6);
}

.secure-text {
  text-align: center;
  margin-top: 20px;
  color: #555;
  font-size: 0.85rem;
}

/* شاشة التحميل */
.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.neon-pulse {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #a435f0;
  box-shadow: 0 0 30px #a435f0;
  animation: pulse 1.5s infinite;
  margin-bottom: 20px;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.6; }
}

/* استعلامات الوسائط (Responsiveness) */
@media (max-width: 992px) {
  .glass-container { padding: 30px; gap: 30px; }
  .course-title { font-size: 2rem; }
}

@media (max-width: 768px) {
  .glass-container { flex-direction: column; align-items: center; text-align: center; }
  .meta-data { justify-content: center; }
  .image-section { order: -1; } 
  .course-title { font-size: 1.8rem; }
  .mega-btn { font-size: 1.1rem; }
}
</style>