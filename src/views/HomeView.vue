<template>
  <div class="home-page">
    <div class="hero-glow" />
    <header class="main-header">
      <h1 class="glitch-text">
        أحدث الكوبونات المحدثة
      </h1>
      <p>تعلم مجاناً من أفضل المحاضرين حول العالم</p>
    </header>

    <div class="courses-wrapper">
      <transition-group
        name="stagger"
        tag="div"
        class="grid-layout"
        appear
      >
        <div
          v-for="(course, index) in courses"
          :key="course._id"
          class="cyber-card"
          :class="{ 'limited-pulse': isLimitedDeal(course.category) }"
          :style="{ '--i': index }"
        >
          <div class="card-inner">
            <div
              class="badge-wrapper"
              :class="{ 'limited-badge': isLimitedDeal(course.category) }"
            >
              <span v-if="isLimitedDeal(course.category)">🔥 عرض محدود</span>
              <span v-else>{{ course.category }}</span>
            </div>

            <div class="img-box">
              <img
                :src="course.image || 'https://via.placeholder.com/300x150'"
                alt="Course"
              >
              <div class="img-overlay" />
            </div>

            <div class="content">
              <h3 class="course-title">
                {{ course.title }}
              </h3>

              <div class="card-footer">
                <div class="card-meta">
                  <span
                    class="price-tag"
                    :class="
                      isLimitedDeal(course.category)
                        ? 'discount-text'
                        : 'free-text'
                    "
                  >
                    {{ isLimitedDeal(course.category) ? "100% OFF" : "FREE" }}
                  </span>
                  <span class="status-dot" />
                  <span class="time">متاح الآن</span>
                </div>

                <a
                  :href="course.udemyLink"
                  target="_blank"
                  class="cyber-btn"
                >
                  <span>Get Coupon </span>
                  <i class="fas fa-bolt" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="water-vortex">
          <div class="core-point" />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      courses: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const res = await api.get("/courses/all");
      this.courses = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    isLimitedDeal(category) {
      if (!category) return false;
      const limitedKeywords = ["100% Off", "Scorpion", "Coupon"];
      return limitedKeywords.some((keyword) => category.includes(keyword));
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-top: clamp(80px, 15vh, 120px); /* حشو مرن حسب ارتفاع الشاشة */
  min-height: 100vh;
  position: relative;
  background: #0a0a12;
  overflow-x: hidden; /* منع التمرير الأفقي في الشاشات الصغيرة */
}

/* توهج الخلفية مرن */
.hero-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(300px, 100vw, 800px);
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(164, 53, 240, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.main-header {
  text-align: center;
  margin-bottom: clamp(30px, 8vw, 60px);
  padding: 0 20px; /* ضمان عدم التصاق النص بالحواف */
}

.glitch-text {
  font-size: clamp(1.8rem, 8vw, 3.5rem); /* خط يتجاوب مع الشاشة */
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 30%, #a435f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(164, 53, 240, 0.3));
  line-height: 1.2;
}

.grid-layout {
  display: grid;
  /* توزيع ذكي للكروت بناءً على العرض المتاح */
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(15px, 3vw, 35px);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(15px, 5vw, 40px) 80px;
}

/* الأنماط الأصلية للكروت */
.cyber-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 1px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  animation: slideIn 0.8s ease forwards;
  animation-delay: calc(var(--i) * 0.1s);
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@media (hover: hover) {
  .cyber-card:hover {
    transform: translateY(-12px);
    border-color: #a435f0;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(164, 53, 240, 0.2);
  }
}

.card-inner {
  background: #12121f;
  border-radius: 23px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.img-box {
  position: relative;
  aspect-ratio: 16 / 9; /* الحفاظ على أبعاد الصورة في كل الشاشات */
  overflow: hidden;
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.content {
  padding: clamp(15px, 3vw, 24px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  direction: rtl;
}

.course-title {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  line-height: 1.5;
  margin-bottom: 20px;
  height: 3.4rem;
  overflow: hidden;
  color: #fff;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* أنيميشن الدوامة المائية */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}
.water-vortex {
  position: relative;
  width: clamp(80px, 20vw, 150px);
  height: clamp(80px, 20vw, 150px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.core-point {
  width: 12px;
  height: 12px;
  background: #a435f0;
  border-radius: 50%;
  box-shadow: 0 0 25px #a435f0;
  z-index: 2;
}
.water-vortex span {
  position: absolute;
  border: 2px solid #a435f0;
  border-radius: 50%;
  animation: water-ripple-expand 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}
.water-vortex span:nth-child(2) {
  animation-delay: 0s;
}
.water-vortex span:nth-child(3) {
  animation-delay: 0.6s;
}
.water-vortex span:nth-child(4) {
  animation-delay: 1.2s;
}

@keyframes water-ripple-expand {
  0% {
    width: 12px;
    height: 12px;
    opacity: 1;
  }
  100% {
    width: clamp(100px, 30vw, 180px);
    height: clamp(100px, 30vw, 180px);
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ميديا كويري للموبايل الصغير لضمان استقرار الكروت */
@media (max-width: 600px) {
  .home-page {
    padding-top: 80px;
  }
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .cyber-card {
    transform: none !important;
    opacity: 1;
  }
  .cyber-card:active {
    transform: scale(0.98) !important;
  }
}

/* باقي الأنماط الأصلية كما هي */
.badge-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(164, 53, 240, 0.9);
  backdrop-filter: blur(5px);
  font-size: 0.75rem;
  padding: 6px 16px;
  border-radius: 12px;
  z-index: 5;
  color: white;
  font-weight: 700;
}
.limited-badge {
  background: linear-gradient(45deg, #ff416c, #ff4b2b) !important;
}
.img-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, #12121f, transparent);
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff88;
}
.price-tag {
  font-size: 1.1rem;
  font-weight: 800;
}
.free-text {
  color: #00ff88;
}
.discount-text {
  color: #ff3e3e;
}
.time {
  font-size: 0.8rem;
  color: #a0a0b0;
}
.cyber-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(90deg, #a435f0, #6e21a8);
  color: #fff;
  text-decoration: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(164, 53, 240, 0.3);
}
</style>
