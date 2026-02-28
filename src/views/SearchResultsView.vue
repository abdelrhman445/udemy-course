<template>
  <div class="search-page-wrapper">
    <div class="hero-glow" />
    <div class="container">
      <header class="page-header">
        <div class="search-meta">
          <h1 class="glitch-title">
            نتائج البحث عن: <span class="query-text">"{{ searchQuery }}"</span>
          </h1>
          <div
            v-if="totalCourses > 0"
            class="results-badge"
          >
            <span class="pulse-icon" />
            تم العثور على {{ totalCourses }} دورة
          </div>
        </div>
      </header>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="water-vortex">
          <div class="core-point" />
          <span class="ring-outer" />
          <span class="ring-inner" />
        </div>
        <p class="loading-text">
          جاري استخراج البيانات من المنجم...
        </p>
      </div>

      <main
        v-else-if="results.length > 0"
        class="content-area"
      >
        <transition-group
          name="stagger-fade"
          tag="div"
          class="results-grid"
          appear
        >
          <div
            v-for="(course, index) in results"
            :key="course.id || course._id || index"
            class="cyber-card"
            :style="{ '--delay': index * 0.08 + 's' }"
          >
            <div class="card-inner">
              <div
                class="badge-wrapper"
                :class="{ 'limited-badge': !course.category || course.category.includes('100%') }"
              >
                {{ course.category || '🔥 عرض محدود' }}
              </div>
              <div class="source-badge">
                {{ formatSource(course.source) }}
              </div>
              <div class="image-box">
                <img
                  :src="course.image || fallbackImage"
                  :alt="course.title"
                  @error="handleImageError"
                >
                <div class="img-overlay" />
              </div>
              <div class="card-body">
                <h3 class="course-title">
                  {{ course.title }}
                </h3>
                <div class="card-footer">
                  <div class="price-info">
                    <span class="price-neon">Free</span>
                    <div class="status">
                      <span class="status-dot" />متاح الآن
                    </div>
                  </div>
                  <div class="action-buttons">
                    <router-link
                      :to="'/course/' + (course.id || course._id)"
                      class="info-btn"
                    >
                      التفاصيل
                    </router-link>
                    <a
                      :href="course.udemyLink"
                      target="_blank"
                      class="cyber-btn"
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

      <section
        v-if="!loading && results.length === 0"
        class="empty-state-cyber"
      >
        <div class="error-box">
          <div class="error-icon">
            📡
          </div>
          <h2 class="error-msg">
            ملقتش دورة بالاسم دا يا صحبي!
          </h2>
          <p class="error-hint">
            جرب كلمات تانية زي "Python" أو "NodeJS"
          </p>
          <router-link
            to="/"
            class="btn-back"
          >
            <span>العودة للصفحة الرئيسية</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "SearchResultsView",
  data() {
    return { 
      results: [], 
      loading: true, 
      searchQuery: "", 
      currentPage: 1, 
      totalPages: 1, 
      totalCourses: 0,
      // صورة احتياطية سايبربنك مرسومة بالكود عشان الإيرور
      fallbackImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%2312121f' stroke='%23a435f0' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' fill='%2300ff88' font-family='Arial, sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E404 - NO IMAGE%3C/text%3E%3C/svg%3E"
    };
  },
  computed: {
    visiblePages() {
      const pages = [], start = Math.max(1, this.currentPage - 2), end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  watch: {
    "$route.query.q": { immediate: true, handler(v) { this.searchQuery = v; this.currentPage = 1; this.fetchResults(); } },
  },
  methods: {
    async fetchResults() {
      if (!this.searchQuery) return;
      this.loading = true;
      try {
        const res = await api.get(`/courses/search?q=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}&limit=20`);
        this.results = res.data.data || res.data;
        if (res.data.pagination) { this.totalPages = res.data.pagination.pages; this.totalCourses = res.data.pagination.total; }
        else { this.totalCourses = this.results.length; }
      } catch(err) { console.error(err); } finally { this.loading = false; }
    },
    goToPage(p) {
      if (p < 1 || p > this.totalPages) return;
      this.currentPage = p;
      this.fetchResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    formatSource(src) { return {couponscorpion:"🦂 Scorpion",real_discount:"💰 Real.Discount",onlinecourses:"🌐 OnlineCourses",coursevania:"🎓 Coursevania"}[src] || src || ""; },
    // دالة الصور الاحتياطية
    handleImageError(event) {
      event.target.src = this.fallbackImage;
    }
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية */
.search-page-wrapper { padding-top:clamp(100px,15vh,140px); min-height:100vh; background:#080810; position:relative; overflow-x:hidden; direction:rtl; }
.hero-glow { position:absolute; top:-100px; left:50%; transform:translateX(-50%); width:100%; max-width:800px; height:500px; background:radial-gradient(circle,rgba(164,53,240,.15) 0%,transparent 70%); pointer-events:none; animation: pulseGlow 4s infinite alternate;}
.container { max-width:1400px; margin:0 auto; padding:0 30px; position:relative; z-index:5; }

/* الهيدر والعنوان */
.page-header { text-align:center; margin-bottom:40px; }
.glitch-title { font-size:clamp(1.8rem,5vw,2.8rem); font-weight:900; color:#fff; margin-bottom:15px; }
.query-text { color:#a435f0; text-shadow:0 0 20px rgba(164,53,240,.5); }
.results-badge { display:inline-flex; align-items:center; gap:10px; background:rgba(0,255,136,.1); padding:8px 22px; border-radius:50px; border:1px solid rgba(0,255,136,.3); color:#fff; font-weight:bold; font-size: .95rem; box-shadow: 0 0 15px rgba(0,255,136,.1);}
.pulse-icon { width:8px; height:8px; background:#00ff88; border-radius:50%; box-shadow:0 0 10px #00ff88; animation:pulseDot 1.5s infinite alternate; }

/* الجريد والكروت */
.results-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:clamp(20px,3vw,35px); padding-bottom:40px; position: relative;}

/* أنيميشن التنقل (Vue Transition) */
.stagger-fade-enter-active, .stagger-fade-leave-active { transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); }
.stagger-fade-leave-active { position: absolute; width: 100%; }
.stagger-fade-enter-from { opacity: 0; transform: translateY(30px) scale(0.95); }
.stagger-fade-leave-to { opacity: 0; transform: translateY(-30px) scale(0.95); }
.stagger-fade-move { transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); }

/* الكارت السايبربنك المطور */
.cyber-card { background:rgba(20,20,30,.6); border-radius:24px; padding:1px; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border:1px solid rgba(164,53,240,.15); position:relative; overflow: visible; width: 100%; z-index: 10; animation: fadeIn 0.6s ease forwards; animation-delay: var(--delay); opacity: 0; transform: translateY(20px);}
@media (hover:hover) { 
  .cyber-card:hover { transform:translateY(-12px) scale(1.02); border-color:#00ff88; box-shadow:0 15px 35px rgba(0,0,0,.5), 0 0 20px rgba(0,255,136,.15); z-index: 15; }
}
.card-inner { background:linear-gradient(180deg, #12121f 0%, #0a0a12 100%); border-radius:23px; height:100%; overflow:hidden; display:flex; flex-direction:column; }
.image-box { position:relative; aspect-ratio:16/9; overflow:hidden; }
.image-box img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s ease; filter: brightness(0.9); }
.cyber-card:hover .image-box img { transform:scale(1.08); filter: brightness(1.1); }
.img-overlay { position:absolute; bottom:0; left:0; width:100%; height:50%; background:linear-gradient(to top,#12121f,transparent); }

.source-badge { position:absolute; top:12px; left:12px; background:rgba(10,10,18,.9); color:#00ff88; border: 1px solid rgba(0,255,136,0.3); font-size:.7rem; padding:5px 12px; border-radius:8px; z-index:5; font-weight:700; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.badge-wrapper { position:absolute; top:12px; right:12px; background:rgba(164,53,240,.95); font-size:.75rem; padding:6px 16px; border-radius:12px; z-index:5; color:#fff; font-weight:800; box-shadow: 0 4px 15px rgba(164,53,240,0.4); }
.limited-badge { background:linear-gradient(45deg,#ff416c,#ff4b2b)!important; animation: pulseRed 2s infinite; }

.card-body { padding:clamp(15px,3vw,24px); flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; text-align:right; direction:rtl; }
.course-title { font-size:clamp(1rem,2.5vw,1.15rem); line-height:1.5; margin-bottom:20px; height:3.4rem; overflow:hidden; color:#fff; font-weight:700; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; transition: color 0.3s; }
.cyber-card:hover .course-title { color: #00ff88; }

.card-footer { display:flex; flex-direction:column; gap:15px; }
.price-info { display:flex; align-items:center; justify-content:space-between; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px;}
.price-neon { color:#00ff88; font-weight:900; font-size: 1.2rem; text-shadow: 0 0 8px rgba(0,255,136,0.4); }
.status { color:#ccc; font-weight:600; font-size:.85rem; display:flex; align-items:center; gap:8px; }
.status-dot { width:6px; height:6px; background:#00ff88; border-radius:50%; box-shadow:0 0 10px #00ff88; animation: pulseDot 1s infinite alternate;}

/* الأزرار */
.action-buttons { display:flex; gap:10px; width:100%; }
.info-btn { flex:1; background:transparent; color:#a435f0; text-decoration:none; padding:12px; border-radius:12px; font-weight:800; font-size:.9rem; text-align:center; border:2px solid rgba(164,53,240,.4); transition:0.3s; }
.info-btn:hover { background:rgba(164,53,240,.15); border-color:#a435f0; box-shadow: inset 0 0 10px rgba(164,53,240,0.3); }

.cyber-btn { flex:1.5; display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(90deg,#a435f0,#6e21a8); color:#fff; text-decoration:none; padding:12px; border-radius:12px; font-weight:800; font-size:.9rem; transition:all 0.3s ease; border: 1px solid transparent; position: relative; overflow: hidden; }
.cyber-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.5s; }
.cyber-btn:hover::before { left: 100%; }
.cyber-btn:hover { background:linear-gradient(90deg,#b84df5,#852bc9); box-shadow:0 5px 20px rgba(164,53,240,.5); transform: translateY(-2px); }

/* اللودر السايبربنك الموحد */
.loading-state { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 40vh; grid-column: 1 / -1; width: 100%; }
.water-vortex { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; margin-bottom: 25px;}
.core-point { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 4px solid transparent; border-top-color: #00ff88; border-bottom-color: #a435f0; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; box-shadow: 0 0 20px rgba(164,53,240,0.4); z-index: 3; }
.ring-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed rgba(0,255,136,0.5); animation: spinReverse 4s linear infinite; z-index: 1; }
.ring-inner { position: absolute; width: 30px; height: 30px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 30px #a435f0; animation: pulseDot 0.8s infinite alternate; z-index: 2; }
.loading-text { color:#a435f0; font-weight: 700; letter-spacing: 1px;}

/* صفحات التنقل (Pagination) */
.pagination { display:flex; justify-content:center; align-items:center; gap:12px; padding:40px 0 80px; width: 100%; grid-column: 1 / -1; }
.page-btn { background:rgba(20,20,30,.8); border:1px solid rgba(164,53,240,.3); color:#fff; width:45px; height:45px; border-radius:14px; cursor:pointer; font-family:"Cairo",sans-serif; font-weight:800; font-size:1.1rem; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; align-items:center; justify-content:center; }
.arrow-btn { background: rgba(164,53,240, 0.1); color: #a435f0; font-size: 1.2rem; }
.page-btn:hover:not(:disabled) { background:rgba(164,53,240,.2); border-color:#00ff88; color:#00ff88; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,255,136,0.25); }
.arrow-btn:hover:not(:disabled) { color: #00ff88; background: rgba(0,255,136,0.1); }
.page-btn.active { background:linear-gradient(135deg, #a435f0, #6e21a8); border-color:transparent; color:#fff; box-shadow:0 0 25px rgba(164,53,240,.6); transform: scale(1.15); }
.page-btn:disabled { opacity:.2; cursor:not-allowed; border-color: rgba(255,255,255,0.05); transform: none; }

/* شاشة فارغة (Empty State) */
.empty-state-cyber { padding:80px 0; text-align:center; width: 100%; grid-column: 1/-1;}
.error-box { background:rgba(20,20,30,.6); border:1px solid rgba(164,53,240,.3); padding:50px; border-radius:30px; display:inline-block; backdrop-filter:blur(10px); box-shadow: inset 0 0 20px rgba(164,53,240,0.1); }
.error-icon { font-size:4.5rem; margin-bottom:20px; filter: drop-shadow(0 0 15px rgba(164,53,240,0.5)); animation: pulseDot 2s infinite alternate;}
.error-msg { color:#fff; font-size:1.8rem; margin-bottom:10px; font-weight: 800;}
.error-hint { color:#a0a0b0; margin-bottom:30px; font-weight: 600;}
.btn-back { display:inline-block; color:#a435f0; text-decoration:none; border:2px solid #a435f0; padding:12px 30px; border-radius:15px; transition:.3s; font-weight:800; background: rgba(164,53,240,0.1);}
.btn-back:hover { background:linear-gradient(90deg, #a435f0, #6e21a8); color:#fff; box-shadow:0 0 20px rgba(164,53,240,0.5); transform: translateY(-3px);}

/* Keyframes */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spinReverse { 100% { transform: rotate(-360deg); } }
@keyframes pulseDot { from{opacity:0.5; transform:scale(0.8)} to{opacity:1; transform:scale(1.2)} }
@keyframes pulseGlow { from{opacity:0.5; transform:translateX(-50%) scale(0.9)} to{opacity:1; transform:translateX(-50%) scale(1.1)} }
@keyframes pulseRed { 0%{box-shadow: 0 0 0 0 rgba(255,65,108,0.7);} 70%{box-shadow: 0 0 0 12px rgba(255,65,108,0);} 100%{box-shadow: 0 0 0 0 rgba(255,65,108,0);} }
@keyframes fadeIn { to{opacity:1;transform:translateY(0)} }

@media (max-width:600px) { .results-grid{grid-template-columns:1fr; gap: 25px;} .error-box{padding:30px;width:100%} }
</style>