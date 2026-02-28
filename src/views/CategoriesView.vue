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
          <span class="dot" />{{ cat }}
          <span
            v-if="categoryCounts[cat]"
            class="count-badge"
          >{{ categoryCounts[cat] }}</span>
        </button>
      </div>
    </nav>

    <main class="content-area">
      <div
        v-if="totalCourses > 0 && !loading"
        class="page-info"
      >
        <span class="pulse-dot" />
        {{ totalCourses }} كورس في "{{ selectedCategory }}"
        <span v-if="totalPages > 1"> · صفحة {{ currentPage }} من {{ totalPages }}</span>
      </div>

      <transition-group
        name="stagger-fade"
        tag="div"
        class="grid-layout"
        appear
      >
        <div
          v-for="(course, index) in filteredCourses"
          :key="course.id || course._id || index"
          class="premium-card"
          :class="{ 'limited-edition': isLimited(course.category) }"
          :style="{ '--i': index % 20 }"
        >
          <div class="card-inner">
            <div
              class="card-badge"
              :class="{ 'fire-badge': isLimited(course.category) }"
            >
              {{ isLimited(course.category) ? "🔥 عرض محدود" : course.category }}
            </div>
            <div class="source-tag">
              {{ formatSource(course.source) }}
            </div>
            <div class="image-wrapper">
              <img
                :src="course.image || fallbackImage"
                alt="Course Thumbnail"
                @error="handleImageError"
              >
              <div class="glass-overlay" />
            </div>
            <div class="card-body">
              <h3 class="course-title">
                {{ course.title }}
              </h3>
              <div class="card-footer">
                <div class="price-info">
                  <span :class="isLimited(course.category) ? 'hot-price' : 'free-price'">
                    {{ isLimited(course.category) ? "100% OFF" : "FREE" }}
                  </span>
                  <div class="status">
                    <span class="pulse-dot" />متاح الآن
                  </div>
                </div>
                <div class="action-buttons">
                  <router-link
                    :to="'/course/' + course._id"
                    class="info-btn"
                  >
                    التفاصيل
                  </router-link>
                  <a
                    :href="course.udemyLink"
                    target="_blank"
                    class="action-btn"
                  >
                    <span>Get Coupon</span><i class="fas fa-bolt" />
                  </a>
                </div>
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
          <span class="ring-outer" />
          <span class="ring-inner" />
        </div>
      </div>

      <div
        v-if="totalPages > 1 && !loading"
        class="pagination"
      >
        <button
          :disabled="currentPage === 1"
          class="page-btn arrow-btn"
          @click="goToPage(currentPage - 1)"
        >
          <i class="fas fa-chevron-right" />
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          :class="['page-btn', { active: p === currentPage }]"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="page-btn arrow-btn"
          @click="goToPage(currentPage + 1)"
        >
          <i class="fas fa-chevron-left" />
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      categoryList: [], filteredCourses: [], selectedCategory: "",
      loading: false, categoryCounts: {},
      currentPage: 1, totalPages: 1, totalCourses: 0,
      // صورة احتياطية سايبربنك مرسومة بالكود عشان الإيرور
      fallbackImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2312121f' stroke='%23a435f0' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' fill='%2300ff88' font-family='Arial, sans-serif' font-size='22' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E404 - NO IMAGE%3C/text%3E%3C/svg%3E"
    };
  },
  computed: {
    visiblePages() {
      const pages = [], start = Math.max(1, this.currentPage - 2), end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  async mounted() {
    try {
      const res = await api.get("/courses/categories/list");
      this.categoryList = res.data;
      if (this.categoryList.length > 0) this.fetchCategoryCourses(this.categoryList[0]);
    } catch(e) { console.error(e); }
  },
  methods: {
    async fetchCategoryCourses(name, page = 1) {
      this.selectedCategory = name;
      this.currentPage = page;
      this.loading = true;
      this.filteredCourses = [];
      try {
        const res = await api.get(`/courses/all?category=${encodeURIComponent(name)}&page=${page}&limit=20`);
        this.filteredCourses = res.data.data || res.data;
        if (res.data.pagination) { this.totalPages = res.data.pagination.pages; this.totalCourses = res.data.pagination.total; }
      } catch(e) { console.error(e); }
      this.loading = false;
    },
    goToPage(p) {
      if (p < 1 || p > this.totalPages) return;
      this.fetchCategoryCourses(this.selectedCategory, p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    isLimited(cat) { return cat && (cat.includes("100% Off") || cat.includes("Scorpion")); },
    formatSource(src) { return {couponscorpion:"🦂",real_discount:"💰",onlinecourses:"🌐",coursevania:"🎓"}[src] || ""; },
    // دالة الصور الاحتياطية
    handleImageError(event) {
      event.target.src = this.fallbackImage;
    }
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية */
.categories-page { padding-top:100px; min-height:100vh; background:#080810; position:relative; overflow-x:hidden; }
.hero-glow { position:absolute; top:-100px; left:20%; width:600px; height:600px; background:radial-gradient(circle,rgba(164,53,240,.15) 0%,transparent 70%); filter:blur(50px); pointer-events:none; animation: pulseGlow 4s infinite alternate;}
.hero-glow.secondary { top:20%; left:60%; background:radial-gradient(circle,rgba(0,255,136,.08) 0%,transparent 70%); }

.page-header { text-align:center; margin-bottom:50px; z-index:2; position:relative; }
.title-wrapper { display:flex; align-items:center; justify-content:center; gap:20px; }
.folder-icon { font-size:2.5rem; color:#a435f0; filter:drop-shadow(0 0 15px rgba(164,53,240,0.5)); animation: pulseIcon 2s infinite alternate;}
.glitch-text { font-size:clamp(2rem,8vw,3.5rem); font-weight:900; background:linear-gradient(135deg,#fff 30%,#a435f0 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 0 20px rgba(164,53,240,.4)); }
.subtitle { color:#a0a0b0; margin-top:10px; font-weight: 600; font-size: 1.1rem;}

/* شريط الأقسام (Category Chips) */
.filter-section { position:sticky; top:80px; z-index:20; padding:20px 0; backdrop-filter:blur(15px); background: rgba(8,8,16,0.7); border-bottom: 1px solid rgba(164,53,240,0.1); }
.chips-container { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; padding:0 20px; }
.category-chip { background:rgba(20,20,30,.8); border:1px solid rgba(164,53,240,.3); color:#ccc; padding:10px 22px; border-radius:50px; cursor:pointer; transition:all .4s cubic-bezier(.4,0,.2,1); font-weight:700; display:flex; align-items:center; gap:8px; font-family:"Cairo",sans-serif; font-size:.9rem; }
.category-chip .dot { width:8px; height:8px; background:#444; border-radius:50%; transition:.3s; }
.category-chip:hover { border-color:#00ff88; transform:translateY(-3px); box-shadow:0 8px 15px rgba(0,255,136,.15); color:#fff; }
.category-chip:hover .dot { background:#00ff88; box-shadow:0 0 10px #00ff88; }
.category-chip.active { background:linear-gradient(135deg, #a435f0, #6e21a8); color:#fff; border-color:transparent; box-shadow:0 0 25px rgba(164,53,240,.5); transform: scale(1.05); }
.category-chip.active .dot { background:#fff; box-shadow:0 0 10px #fff; }
.count-badge { background:rgba(255,255,255,.2); padding:2px 8px; border-radius:20px; font-size:.75rem; }

.page-info { display:flex; align-items:center; gap:8px; color:#fff; font-size:.9rem; font-weight:700; max-width:1400px; margin:0 auto 25px; padding:0 40px; }
.pulse-dot { width:8px; height:8px; background:#00ff88; border-radius:50%; box-shadow:0 0 10px #00ff88; animation:pulse 1.5s infinite alternate; }

/* الجريد والكروت */
.grid-layout { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:35px; max-width:1400px; margin:0 auto; padding:0 40px 40px; position: relative; }

/* أنيميشن التنقل بين الأقسام (ناعم وانسيابي) */
.stagger-fade-enter-active, .stagger-fade-leave-active { transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); }
.stagger-fade-leave-active { position: absolute; width: calc(100% - 80px); /* يراعي الـ padding */ }
.stagger-fade-enter-from { opacity: 0; transform: translateY(30px) scale(0.95); }
.stagger-fade-leave-to { opacity: 0; transform: translateY(-30px) scale(0.95); }
.stagger-fade-move { transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); }

/* الكارت السايبربنك */
.premium-card { background:rgba(20,20,30,.6); border-radius:28px; border:1px solid rgba(164,53,240,.15); transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative; overflow:hidden; width: 100%; z-index: 10;}
@media (hover:hover) { 
  .premium-card:hover { transform:translateY(-12px) scale(1.02); border-color:#00ff88; box-shadow:0 15px 35px rgba(0,0,0,.5), 0 0 20px rgba(0,255,136,.15); z-index: 15; }
}
.card-inner { height:100%; display:flex; flex-direction:column; background:linear-gradient(180deg, #12121f 0%, #0a0a12 100%); }
.image-wrapper { height:180px; overflow:hidden; position:relative; }
.image-wrapper img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s ease; filter: brightness(0.9); }
.premium-card:hover img { transform:scale(1.1); filter: brightness(1.1); }
.glass-overlay { position:absolute; bottom:0; left:0; width:100%; height:50%; background:linear-gradient(to top,#0a0a12,transparent); }

.card-badge { position:absolute; top:15px; right:15px; z-index:5; background:rgba(164,53,240,.9); backdrop-filter:blur(5px); padding:6px 16px; border-radius:12px; font-size:.75rem; font-weight:800; color:#fff; box-shadow: 0 4px 15px rgba(164,53,240,0.4);}
.fire-badge { background:linear-gradient(45deg,#ff416c,#ff4b2b)!important; animation: pulseRed 2s infinite;}
.source-tag { position:absolute; top:15px; left:15px; z-index:5; background:rgba(10,10,18,.8); backdrop-filter:blur(5px); border: 1px solid rgba(0,255,136,0.3); padding:4px 10px; border-radius:8px; font-size:.7rem; color:#00ff88; font-weight:700; box-shadow: 0 4px 10px rgba(0,0,0,0.3);}

.card-body { padding:25px; flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; text-align:right; direction:rtl; }
.course-title { font-size:1.15rem; color:#fff; font-weight: 700; line-height:1.6; margin-bottom:20px; height:3.5rem; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; transition: color 0.3s;}
.premium-card:hover .course-title { color: #00ff88; }

.card-footer { display:flex; flex-direction:column; gap:15px; }
.price-info { display:flex; align-items:center; justify-content:space-between; background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 12px;}
.free-price { color:#00ff88; font-weight:900; font-size:1.2rem; text-shadow: 0 0 8px rgba(0,255,136,0.4); }
.hot-price { color:#ff3e3e; font-weight:900; font-size:1.2rem; text-shadow:0 0 10px rgba(255,62,62,.5); }
.status { color:#ccc; font-weight:600; font-size:.85rem; display:flex; align-items:center; gap:8px; }

/* الأزرار والتفاعلات */
.action-buttons { display:flex; gap:10px; width:100%; }
.info-btn { flex:1; background:transparent; color:#a435f0; text-decoration:none; padding:12px; border-radius:12px; font-weight:800; font-size:.9rem; text-align:center; border:2px solid rgba(164,53,240,.4); transition:0.3s; }
.info-btn:hover { background:rgba(164,53,240,.15); border-color:#a435f0; box-shadow: inset 0 0 10px rgba(164,53,240,0.3); }

.action-btn { flex:1.5; background:linear-gradient(90deg,#a435f0,#6e21a8); color:#fff; text-decoration:none; padding:12px; border-radius:12px; text-align:center; font-weight:800; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.3s ease; font-size:.9rem; position: relative; overflow: hidden; border: 1px solid transparent;}
.action-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.5s; }
.action-btn:hover::before { left: 100%; }
.action-btn:hover { box-shadow:0 5px 20px rgba(164,53,240,.5); transform:translateY(-2px); background:linear-gradient(90deg,#b84df5,#852bc9); }

/* اللودر السايبربنك الموحد */
.loading-state { display: flex; justify-content: center; align-items: center; min-height: 40vh; grid-column: 1 / -1; width: 100%; }
.water-vortex { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
.core-point { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 4px solid transparent; border-top-color: #00ff88; border-bottom-color: #a435f0; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; box-shadow: 0 0 20px rgba(164,53,240,0.4); z-index: 3; }
.ring-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed rgba(0,255,136,0.5); animation: spinReverse 4s linear infinite; z-index: 1; }
.ring-inner { position: absolute; width: 30px; height: 30px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 30px #a435f0; animation: pulse 0.8s infinite alternate; z-index: 2; }

/* صفحات التنقل (Pagination) */
.pagination { display:flex; justify-content:center; align-items:center; gap:12px; padding:40px 0 80px; width: 100%; grid-column: 1 / -1; }
.page-btn { background:rgba(20,20,30,.8); border:1px solid rgba(164,53,240,.3); color:#fff; width:45px; height:45px; border-radius:14px; cursor:pointer; font-family:"Cairo",sans-serif; font-weight:800; font-size:1.1rem; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; align-items:center; justify-content:center; }
.arrow-btn { background: rgba(164,53,240, 0.1); color: #a435f0; font-size: 1.2rem; }
.page-btn:hover:not(:disabled) { background:rgba(164,53,240,.2); border-color:#00ff88; color:#00ff88; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,255,136,0.25); }
.arrow-btn:hover:not(:disabled) { color: #00ff88; background: rgba(0,255,136,0.1); }
.page-btn.active { background:linear-gradient(135deg, #a435f0, #6e21a8); border-color:transparent; color:#fff; box-shadow:0 0 25px rgba(164,53,240,.6); transform: scale(1.15); }
.page-btn:disabled { opacity:.2; cursor:not-allowed; border-color: rgba(255,255,255,0.05); transform: none; }

/* Keyframes */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spinReverse { 100% { transform: rotate(-360deg); } }
@keyframes pulse { from{opacity:0.5; transform:scale(0.8)} to{opacity:1; transform:scale(1.2)} }
@keyframes pulseGlow { from{opacity:0.5; transform:scale(0.9)} to{opacity:1; transform:scale(1.1)} }
@keyframes pulseRed { 0%{box-shadow: 0 0 0 0 rgba(255,65,108,0.7);} 70%{box-shadow: 0 0 0 12px rgba(255,65,108,0);} 100%{box-shadow: 0 0 0 0 rgba(255,65,108,0);} }
@keyframes pulseIcon { from{transform: translateY(-3px);} to{transform: translateY(3px);} }

@media (max-width:768px) { 
  .chips-container{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;padding-bottom:15px;-webkit-overflow-scrolling:touch} 
  .chips-container::-webkit-scrollbar { height: 4px; }
  .chips-container::-webkit-scrollbar-thumb { background: rgba(164,53,240,.5); border-radius: 10px; }
  .category-chip{white-space:nowrap} 
  .grid-layout{grid-template-columns:1fr;padding:0 20px 80px} 
}
</style>