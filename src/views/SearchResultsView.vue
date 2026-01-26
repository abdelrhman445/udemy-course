<template>
  <div class="search-page-wrapper">
    <div class="hero-glow" />
    
    <div class="container">
      <header class="page-header">
        <div class="search-meta">
          <h1 class="glitch-title">
            نتائج البحث عن: <span class="query-text">"{{ searchQuery }}"</span>
          </h1>
          <div v-if="results.length > 0" class="results-badge">
            <span class="pulse-icon" />
            تم العثور على {{ results.length }} دورة
          </div>
        </div>
      </header>

      <div v-if="loading" class="loading-zone">
        <div class="cyber-spinner">
          <div class="spinner-inner" />
        </div>
        <p class="loading-text">جاري استخراج البيانات من المنجم...</p>
      </div>

      <main v-else-if="results.length > 0" class="results-grid">
        <div 
          v-for="(course, index) in results" 
          :key="course._id" 
          class="cyber-card"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="card-inner">
            <div class="image-box">
              <img :src="course.image" :alt="course.title">
              <div class="img-overlay" />
              <div class="type-tag">عرض محدود</div>
            </div>
            
            <div class="card-body">
              <h3 class="course-title">{{ course.title }}</h3>
              
              <div class="card-footer">
                <span class="price-neon">100% OFF</span>
                <div class="btn-group">
                  <router-link :to="'/course/' + course._id" class="btn-secondary">
                    التفاصيل
                  </router-link>
                  <a :href="course.udemyLink" target="_blank" class="btn-primary">
                    Get Now 🚀
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section v-else class="empty-state-cyber">
        <div class="error-box">
          <div class="error-icon">📡</div>
          <h2 class="error-msg">ملقتش دورة بالاسم دا يا صحبي!</h2>
          <p class="error-hint">جرب كلمات تانية زي "Python" أو "NodeJS"</p>
          <router-link to="/" class="btn-back">
            <span>العودة للصفحة الرئيسية</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // السنترال المربوط بـ Vercel

export default {
  name: 'SearchResultsView',
  data() {
    return {
      results: [],
      loading: true,
      searchQuery: ""
    };
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(newVal) {
        this.searchQuery = newVal;
        this.fetchResults();
      }
    }
  },
  methods: {
    async fetchResults() {
      if (!this.searchQuery) return;
      this.loading = true;
      try {
        const res = await api.get(`/courses/search?q=${this.searchQuery}`);
        this.results = res.data;
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* الإعدادات الكلية */
.search-page-wrapper {
  padding-top: clamp(100px, 15vh, 140px);
  min-height: 100vh;
  background: #080810;
  position: relative;
  overflow-x: hidden;
  direction: rtl;
}

.hero-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1000px;
  height: 600px;
  background: radial-gradient(circle, rgba(164, 53, 240, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 5;
}

/* الهيدر المحسن */
.glitch-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
}

.query-text {
  color: #a435f0;
  text-shadow: 0 0 20px rgba(164, 53, 240, 0.5);
}

.results-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(164, 53, 240, 0.1);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(164, 53, 240, 0.3);
  color: #ccc;
  font-weight: bold;
  margin-bottom: 40px;
}

.pulse-icon {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
  animation: pulse 1.5s infinite;
}

/* الشبكة (نفس مقاس الهوم) */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 30px;
  padding-bottom: 100px;
}

/* تصميم الكارت البريميم */
.cyber-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: 0.4s;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.card-inner {
  background: #12121f;
  border-radius: 23px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cyber-card:hover {
  transform: translateY(-10px);
  border-color: #a435f0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(164, 53, 240, 0.2);
}

.image-box {
  position: relative;
  aspect-ratio: 16/9;
}

.image-box img { width: 100%; height: 100%; object-fit: cover; }

.type-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 900;
  color: #fff;
}

.card-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  height: 3.3rem;
  overflow: hidden;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.price-neon {
  color: #00ff88;
  font-weight: 900;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

.btn-group { display: flex; gap: 10px; }

.btn-primary {
  flex: 1.5;
  background: linear-gradient(90deg, #a435f0, #6e21a8);
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.btn-secondary {
  flex: 1;
  background: rgba(164, 53, 240, 0.1);
  color: #a435f0;
  text-decoration: none;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
  border: 1px solid rgba(164, 53, 240, 0.3);
}

/* حالة الفراغ المطورة */
.empty-state-cyber {
  padding: 100px 0;
  text-align: center;
}

.error-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(164, 53, 240, 0.2);
  padding: 60px;
  border-radius: 30px;
  display: inline-block;
  backdrop-filter: blur(10px);
}

.error-icon { font-size: 4rem; margin-bottom: 20px; }
.error-msg { color: #fff; font-size: 1.8rem; margin-bottom: 10px; }
.error-hint { color: #888; margin-bottom: 30px; }

.btn-back {
  display: inline-block;
  color: #a435f0;
  text-decoration: none;
  border: 1px solid #a435f0;
  padding: 12px 30px;
  border-radius: 50px;
  transition: 0.3s;
  font-weight: bold;
}

.btn-back:hover {
  background: #a435f0;
  color: #fff;
  box-shadow: 0 0 20px #a435f0;
}

/* أنيميشن */
@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

@media (max-width: 600px) {
  .results-grid { grid-template-columns: 1fr; }
  .error-box { padding: 30px; width: 100%; }
}
</style>