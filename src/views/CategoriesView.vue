<template>
  <div class="categories-page">
    <div class="hero-glow" />
    <div class="hero-glow secondary" />

    <header class="page-header">
      <div class="title-wrapper">
        <i class="fas fa-folder-open folder-icon" />
        <h1 class="glitch-text">
          تصفح بالأقسام
        </h1>
      </div>
      <p class="subtitle">
        اكتشف آلاف الكورسات المجانية في مجالاتك المفضلة
      </p>
    </header>

    <nav class="filter-section">
      <div class="chips-container">
        <button
          v-for="cat in categoryList"
          :key="cat"
          :class="['category-chip', { active: selectedCategory === cat }]"
          @click="fetchCategoryCourses(cat)"
        >
          <span class="dot" />
          {{ cat }}
        </button>
      </div>
    </nav>

    <main class="content-area">
      <transition-group
        name="stagger-fade"
        tag="div"
        class="grid-layout"
        appear
      >
        <div
          v-for="(course, index) in filteredCourses"
          :key="course._id"
          class="premium-card"
          :class="{ 'limited-edition': isLimited(course.category) }"
          :style="{ '--i': index }"
        >
          <div class="card-inner">
            <div
              class="card-badge"
              :class="{ 'fire-badge': isLimited(course.category) }"
            >
              {{
                isLimited(course.category) ? "🔥 عرض محدود" : course.category
              }}
            </div>

            <div class="image-wrapper">
              <img
                :src="course.image || 'https://via.placeholder.com/400x200'"
                alt="Course Thumbnail"
              >
              <div class="glass-overlay" />
            </div>

            <div class="card-body">
              <h3 class="course-title">
                {{ course.title }}
              </h3>

              <div class="card-footer">
                <div class="price-info">
                  <span
                    :class="
                      isLimited(course.category) ? 'hot-price' : 'free-price'
                    "
                  >
                    {{ isLimited(course.category) ? "100% OFF" : "FREE" }}
                  </span>
                  <div class="status">
                    <span class="pulse-dot" />
                    متاح الآن
                  </div>
                </div>

                <a
                  :href="course.udemyLink"
                  target="_blank"
                  class="action-btn"
                >
                  <span> Get the course</span>
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
    </main>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      categoryList: [],
      filteredCourses: [],
      selectedCategory: "",
      loading: false,
    };
  },
  async mounted() {
    try {
      const res = await api.get("/courses/categories/list");
      this.categoryList = res.data;
      if (this.categoryList.length > 0) {
        this.fetchCategoryCourses(this.categoryList[0]);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  },
  methods: {
    async fetchCategoryCourses(name) {
      this.selectedCategory = name;
      this.loading = true;
      this.filteredCourses = [];
      try {
        const res = await api.get(`/courses/category/${name}`);
        this.filteredCourses = res.data;
      } catch (e) {
        console.error("Error fetching courses:", e);
      }
      this.loading = false;
    },
    isLimited(cat) {
      return cat && (cat.includes("100% Off") || cat.includes("Scorpion"));
    },
  },
};
</script>

<style scoped>
.categories-page {
  padding-top: 100px;
  min-height: 100vh;
  background: #080810;
  position: relative;
  overflow-x: hidden;
}

.hero-glow {
  position: absolute;
  top: -100px;
  left: 20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(164, 53, 240, 0.1) 0%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}
.hero-glow.secondary {
  top: 20%;
  left: 60%;
  background: radial-gradient(
    circle,
    rgba(0, 210, 255, 0.05) 0%,
    transparent 70%
  );
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  z-index: 2;
  position: relative;
}
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.folder-icon {
  font-size: 2.5rem;
  color: #a435f0;
  filter: drop-shadow(0 0 10px #a435f0);
}
.glitch-text {
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 900;
  color: #fff;
}

.filter-section {
  position: sticky;
  top: 80px;
  z-index: 10;
  padding: 20px 0;
  backdrop-filter: blur(10px);
}
.chips-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 20px;
}
.category-chip {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a0a0b0;
  padding: 12px 28px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}
.category-chip .dot {
  width: 6px;
  height: 6px;
  background: #444;
  border-radius: 50%;
  transition: 0.3s;
}
.category-chip.active {
  background: #a435f0;
  color: #fff;
  border-color: #a435f0;
  box-shadow: 0 0 25px rgba(164, 53, 240, 0.4);
}
.category-chip.active .dot {
  background: #fff;
  box-shadow: 0 0 10px #fff;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 35px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 100px;
}

.premium-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.5s;
  position: relative;
  overflow: hidden;
}
.premium-card:hover {
  transform: translateY(-15px);
  border-color: #a435f0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.image-wrapper {
  height: 180px;
  overflow: hidden;
  position: relative;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.6s;
}
.premium-card:hover img {
  transform: scale(1.1);
}
.glass-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, #080810, transparent);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 5;
  background: rgba(164, 53, 240, 0.8);
  backdrop-filter: blur(5px);
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
}
.fire-badge {
  background: linear-gradient(45deg, #ff416c, #ff4b2b) !important;
}

.card-body {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  direction: rtl;
}
.course-title {
  font-size: 1.15rem;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 20px;
  height: 3.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.free-price {
  color: #00ff88;
  font-weight: 900;
  font-size: 1.2rem;
}
.hot-price {
  color: #ff3e3e;
  font-weight: 900;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(255, 62, 62, 0.3);
}

.status {
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
  animation: pulse 1.5s infinite;
}

.action-btn {
  background: linear-gradient(90deg, #a435f0, #7b2cbf);
  color: #fff;
  text-decoration: none;
  padding: 15px;
  border-radius: 16px;
  text-align: center;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
}
.action-btn:hover {
  box-shadow: 0 0 20px rgba(164, 53, 240, 0.6);
  transform: scale(1.02);
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

/* ستايلات لودر الدوامة المائية (Water Ripple Vortex) */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 0;
}

.water-vortex {
  position: relative;
  width: 150px;
  height: 150px;
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

/* توزيع الحلقات لخلق تأثير الدوامة المستمرة */
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
    width: 180px;
    height: 180px;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .chips-container {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    -webkit-overflow-scrolling: touch;
  }
  .category-chip {
    white-space: nowrap;
  }
  .grid-layout {
    grid-template-columns: 1fr;
    padding: 0 20px 80px;
  }
}
</style>
