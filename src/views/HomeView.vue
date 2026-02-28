<template>
  <div class="home-page">
    <div class="hero-glow" />
    <header class="main-header">
      <h1 class="glitch-text">
        أحدث الكوبونات المحدثة
      </h1>
      <p>تعلم مجاناً من أفضل المحاضرين حول العالم</p>
    </header>

    <div class="filters-bar">
      <div class="filter-group">
        <div
          class="filter-select-wrapper custom-dropdown"
          tabindex="0"
          @blur="closeDropdowns"
        >
          <i class="fas fa-globe" />
          <div
            class="dropdown-header"
            @click="toggleDropdown('source')"
          >
            <span>{{ selectedSource ? formatSource(selectedSource) : 'كل المصادر' }}</span>
            <i
              class="fas fa-chevron-down toggle-icon"
              :class="{ 'rotated': activeDropdown === 'source' }"
            />
          </div>
          <transition name="fade-drop">
            <ul
              v-show="activeDropdown === 'source'"
              class="dropdown-options"
            >
              <li
                :class="{ active: selectedSource === '' }"
                @mousedown.prevent="selectOption('source', '')"
              >
                كل المصادر
              </li>
              <li
                v-for="src in sources"
                :key="src"
                :class="{ active: selectedSource === src }"
                @mousedown.prevent="selectOption('source', src)"
              >
                {{ formatSource(src) }}
              </li>
            </ul>
          </transition>
        </div>

        <div
          class="filter-select-wrapper custom-dropdown"
          tabindex="0"
          @blur="closeDropdowns"
        >
          <i class="fas fa-folder" />
          <div
            class="dropdown-header"
            @click="toggleDropdown('category')"
          >
            <span>{{ selectedCategory ? selectedCategory : 'كل الأقسام' }}</span>
            <i
              class="fas fa-chevron-down toggle-icon"
              :class="{ 'rotated': activeDropdown === 'category' }"
            />
          </div>
          <transition name="fade-drop">
            <ul
              v-show="activeDropdown === 'category'"
              class="dropdown-options"
            >
              <li
                :class="{ active: selectedCategory === '' }"
                @mousedown.prevent="selectOption('category', '')"
              >
                كل الأقسام
              </li>
              <li
                v-for="cat in categories"
                :key="cat"
                :class="{ active: selectedCategory === cat }"
                @mousedown.prevent="selectOption('category', cat)"
              >
                {{ cat }}
              </li>
            </ul>
          </transition>
        </div>

        <div
          class="filter-select-wrapper custom-dropdown"
          tabindex="0"
          @blur="closeDropdowns"
        >
          <i class="fas fa-sort" />
          <div
            class="dropdown-header"
            @click="toggleDropdown('sort')"
          >
            <span>{{ sortBy === 'addedAt' ? 'الأحدث أولاً' : 'أبجدي' }}</span>
            <i
              class="fas fa-chevron-down toggle-icon"
              :class="{ 'rotated': activeDropdown === 'sort' }"
            />
          </div>
          <transition name="fade-drop">
            <ul
              v-show="activeDropdown === 'sort'"
              class="dropdown-options"
            >
              <li
                :class="{ active: sortBy === 'addedAt' }"
                @mousedown.prevent="selectOption('sort', 'addedAt')"
              >
                الأحدث أولاً
              </li>
              <li
                :class="{ active: sortBy === 'title' }"
                @mousedown.prevent="selectOption('sort', 'title')"
              >
                أبجدي
              </li>
            </ul>
          </transition>
        </div>

        <button
          v-if="hasFilters"
          class="clear-btn"
          @click="clearFilters"
        >
          <i class="fas fa-times" /> إزالة الفلاتر
        </button>
      </div>
      
      <div
        v-if="totalCourses > 0"
        class="results-info"
      >
        <span class="pulse-dot" />
        {{ totalCourses }} كورس متاح
      </div>
    </div>

    <div class="courses-wrapper">
      <transition-group
        name="stagger"
        tag="div"
        class="grid-layout"
        appear
      >
        <div
          v-for="(course, index) in courses"
          :key="course.id || course._id"
          class="cyber-card"
          :class="{ 'limited-pulse': isLimitedDeal(course.category) }"
          :style="{ '--i': index % 20 }"
        >
          <div class="card-inner">
            <div
              class="badge-wrapper"
              :class="{ 'limited-badge': isLimitedDeal(course.category) }"
            >
              <span v-if="isLimitedDeal(course.category)">🔥 عرض محدود</span>
              <span v-else>{{ course.category }}</span>
            </div>
            <div class="source-badge">
              {{ formatSource(course.source) }}
            </div>
            <div class="img-box">
              <img
                :src="course.image || fallbackImage"
                alt="Course"
                @error="handleImageError"
              >
              <div class="img-overlay" />
            </div>
            <div class="content">
              <h3 class="course-title">
                {{ course.title }}
              </h3>
              <div class="card-footer">
                <div class="card-meta">
                  <span class="price-tag free-text">Free</span>
                  <span class="status-dot" />
                  <span class="time">متاح الآن</span>
                </div>
                <div class="action-buttons">
                  <router-link
                    :to="`/course/${course.id || course._id}`"
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
        v-if="!loading && courses.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          📭
        </div>
        <h3>لا توجد نتائج</h3>
        <p>جرّب تغيير الفلاتر</p>
        <button
          class="cyber-btn"
          style="margin-top:15px;border:none;cursor:pointer; padding: 10px 25px;"
          @click="clearFilters"
        >
          إزالة الفلاتر
        </button>
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
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      courses: [], loading: false,
      selectedSource: "", selectedCategory: "", sortBy: "addedAt",
      sources: [], categories: [],
      currentPage: 1, totalPages: 1, totalCourses: 0, limit: 20,
      activeDropdown: null,
      // المتغير ده هو اللي بيولد الصورة الـ SVG بدون انترنت عشان نمنع الإيرور
      fallbackImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%2312121f' stroke='%23a435f0' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' fill='%2300ff88' font-family='Arial, sans-serif' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E404 - NO IMAGE%3C/text%3E%3C/svg%3E"
    };
  },
  computed: {
    hasFilters() { return this.selectedSource || this.selectedCategory || this.sortBy !== "addedAt"; },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  async mounted() {
    await Promise.all([this.fetchSources(), this.fetchCategories()]);
    await this.fetchCourses();
  },
  methods: {
    async fetchSources() {
      try { const r = await api.get("/courses/sources/list"); this.sources = r.data; } catch(e) { console.error(e); }
    },
    async fetchCategories() {
      try { const r = await api.get("/courses/categories/list"); this.categories = r.data; } catch(e) { console.error(e); }
    },
    async fetchCourses() {
      this.loading = true;
      try {
        const params = new URLSearchParams({ page: this.currentPage, limit: this.limit, sort_by: this.sortBy });
        if (this.selectedSource) params.set("source", this.selectedSource);
        if (this.selectedCategory) params.set("category", this.selectedCategory);
        const res = await api.get(`/courses/all?${params}`);
        this.courses = res.data.data || res.data;
        if (res.data.pagination) { this.totalPages = res.data.pagination.pages; this.totalCourses = res.data.pagination.total; }
      } catch(e) { console.error(e); } finally { this.loading = false; }
    },
    resetAndFetch() { this.currentPage = 1; this.fetchCourses(); },
    clearFilters() { this.selectedSource = ""; this.selectedCategory = ""; this.sortBy = "addedAt"; this.currentPage = 1; this.fetchCourses(); },
    goToPage(p) { if (p < 1 || p > this.totalPages) return; this.currentPage = p; this.fetchCourses(); window.scrollTo({ top: 0, behavior: "smooth" }); },
    isLimitedDeal(cat) { if (!cat) return false; return ["100% Off","Scorpion","Coupon"].some(k => cat.includes(k)); },
    formatSource(src) { return {couponscorpion:"🦂 Scorpion",real_discount:"💰 Real.Discount",onlinecourses:"🌐 OnlineCourses",coursevania:"🎓 Coursevania"}[src] || src; },
    
    toggleDropdown(menu) {
      this.activeDropdown = this.activeDropdown === menu ? null : menu;
    },
    selectOption(type, value) {
      if (type === 'source') this.selectedSource = value;
      else if (type === 'category') this.selectedCategory = value;
      else if (type === 'sort') this.sortBy = value;
      this.activeDropdown = null;
      this.resetAndFetch();
    },
    closeDropdowns() {
      this.activeDropdown = null;
    },
    // تم تعديل الدالة لاستخدام المتغير الجديد
    handleImageError(event) {
      event.target.src = this.fallbackImage;
    }
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية */
.home-page { padding-top: clamp(80px,15vh,120px); min-height:100vh; position:relative; background:#0a0a12; overflow-x:hidden; }
.hero-glow { position:absolute; top:-100px; left:50%; transform:translateX(-50%); width:clamp(300px,100vw,800px); height:500px; background:radial-gradient(circle,rgba(164,53,240,.15) 0%,transparent 70%); pointer-events:none; animation: pulseGlow 4s infinite alternate; }

/* أنيميشن العنوان - Glitch Effect */
.main-header { text-align:center; margin-bottom:clamp(20px,5vw,35px); padding:0 20px; position: relative; }
.glitch-text { 
  font-size:clamp(1.8rem,8vw,3.5rem); font-weight:900; 
  background:linear-gradient(135deg,#fff 30%,#a435f0 100%); 
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; 
  filter:drop-shadow(0 0 20px rgba(164,53,240,.4)); line-height:1.2;
  position: relative;
  animation: textShimmer 3s infinite linear;
}
.main-header p { color:#a0a0b0; margin-top:10px; font-weight: 600; letter-spacing: 1px; }

/* 🌟 القوائم المنسدلة الجديدة (Custom Dropdowns) 🌟 */
.filters-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:15px; max-width:1400px; margin:0 auto 25px; padding:0 clamp(15px,5vw,40px); }
.filter-group { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }

.custom-dropdown {
  position: relative; cursor: pointer; outline: none; z-index: 20;
}
.filter-select-wrapper { 
  display:flex; align-items:center; gap:10px; 
  background: rgba(20, 20, 30, 0.8); border: 1px solid rgba(164,53,240,.4); 
  border-radius: 14px; padding: 10px 18px; 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  box-shadow: inset 0 0 15px rgba(164,53,240,.05);
}
.filter-select-wrapper:hover { 
  background: rgba(164,53,240,.1); border-color: #00ff88; 
  box-shadow: 0 5px 20px rgba(0,255,136,.15), inset 0 0 10px rgba(0,255,136,.1); transform: translateY(-3px);
}
.filter-select-wrapper:focus-within { border-color:#00ff88; background: rgba(0,255,136,.05); }
.filter-select-wrapper i.fa-globe, .filter-select-wrapper i.fa-folder, .filter-select-wrapper i.fa-sort { color:#a435f0; font-size:.9rem; transition: 0.3s; }
.filter-select-wrapper:focus-within i { color: #00ff88; }

.dropdown-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 140px; color: #fff; font-family: "Cairo", sans-serif; font-size: 0.9rem; font-weight: 700;
}
.toggle-icon { font-size: 0.8rem; color: #a435f0; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.toggle-icon.rotated { transform: rotate(180deg); color: #00ff88; }

.dropdown-options {
  position: absolute; top: 115%; right: 0; width: 100%; min-width: 180px;
  background: rgba(10, 10, 18, 0.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(164,53,240,.4); border-radius: 14px;
  list-style: none; padding: 8px; margin: 0;
  box-shadow: 0 15px 35px rgba(0,0,0,0.8); max-height: 250px; overflow-y: auto; text-align: right;
}
.dropdown-options li {
  padding: 12px 15px; color: #ccc; font-size: 0.85rem; font-weight: 600; font-family: "Cairo", sans-serif;
  border-radius: 10px; transition: all 0.3s ease;
}
.dropdown-options li:hover { background: rgba(164,53,240,.2); color: #00ff88; padding-right: 22px; }
.dropdown-options li.active { background: linear-gradient(90deg, #a435f0, #6e21a8); color: #fff; }

/* Scrollbar للقوائم المنسدلة */
.dropdown-options::-webkit-scrollbar { width: 6px; }
.dropdown-options::-webkit-scrollbar-track { background: transparent; }
.dropdown-options::-webkit-scrollbar-thumb { background: rgba(164,53,240,.5); border-radius: 10px; }

/* أنيميشن فتح وقفل القائمة */
.fade-drop-enter-active, .fade-drop-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fade-drop-enter-from, .fade-drop-leave-to { opacity: 0; transform: translateY(-15px) scale(0.95); }

/* باقي العناصر */
.clear-btn { background:rgba(255,62,62,.1); border:1px solid rgba(255,62,62,.3); color:#ff4d4d; padding:10px 18px; border-radius:14px; cursor:pointer; font-family:"Cairo",sans-serif; font-weight:800; font-size:.85rem; transition:0.3s; display:flex; align-items:center; gap:8px; }
.clear-btn:hover { background:rgba(255,62,62,.2); box-shadow: 0 0 20px rgba(255,62,62,0.3); transform: scale(1.05); }

.results-info { display:flex; align-items:center; gap:8px; color:#fff; font-size:.88rem; font-weight:700; background: rgba(0,255,136,0.1); padding: 6px 18px; border-radius: 20px; border: 1px solid rgba(0,255,136,0.2); box-shadow: 0 0 15px rgba(0,255,136,0.1); }
.pulse-dot { width:8px; height:8px; background:#00ff88; border-radius:50%; box-shadow:0 0 10px #00ff88; animation:pulseDot 1.2s infinite alternate; }

/* الجريد والكروت */
.grid-layout { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:clamp(20px,3vw,35px); width:100%; max-width:1400px; margin:0 auto; padding:0 clamp(15px,5vw,40px) 40px; position: relative; }

/* 🌟 أنيميشن التنقل بين الصفحات (أبطأ وأكثر نعومة) 🌟 */
.stagger-enter-active, .stagger-leave-active { 
  transition: all 0.9s cubic-bezier(0.25, 0.8, 0.25, 1); /* وقت أطول للنعومة (0.9s) */
}
.stagger-leave-active { position: absolute; width: 100%; }
.stagger-enter-from { opacity: 0; transform: translateY(35px) scale(0.95); }
.stagger-leave-to { opacity: 0; transform: translateY(-35px) scale(0.95); }
.stagger-move { transition: transform 0.9s cubic-bezier(0.25, 0.8, 0.25, 1); }

/* الكارت السايبربنك المطور */
.cyber-card { background:rgba(20,20,30,.6); border-radius:24px; padding:1px; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border:1px solid rgba(164,53,240,.15); position:relative; overflow: visible; width: 100%; z-index: 10;}
@media (hover:hover) { 
  .cyber-card:hover { 
    transform:translateY(-12px) scale(1.02); 
    border-color:#00ff88; 
    box-shadow: 0 15px 35px rgba(0,0,0,.5), 0 0 20px rgba(0,255,136,.15); 
    z-index: 15;
  } 
}
.card-inner { background:linear-gradient(180deg, #12121f 0%, #0a0a12 100%); border-radius:23px; height:100%; overflow:hidden; display:flex; flex-direction:column; }
.img-box { position:relative; aspect-ratio:16/9; overflow:hidden; }
.img-box img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s ease; filter: brightness(0.9); }
.cyber-card:hover .img-box img { transform:scale(1.08); filter: brightness(1.1); }
.content { padding:clamp(15px,3vw,24px); flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; text-align:right; direction:rtl; }
.course-title { font-size:clamp(1rem,2.5vw,1.15rem); line-height:1.5; margin-bottom:20px; height:3.4rem; overflow:hidden; color:#fff; font-weight:700; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; transition: color 0.3s; }
.cyber-card:hover .course-title { color: #00ff88; }

/* البادجات والأزرار */
.card-footer { display:flex; flex-direction:column; gap:15px; }
.card-meta { display:flex; align-items:center; gap:10px; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px; }
.action-buttons { display:flex; gap:10px; width:100%; }
.info-btn { flex:1; background:transparent; color:#a435f0; text-decoration:none; padding:12px; border-radius:12px; font-weight:800; font-size:.9rem; text-align:center; border:2px solid rgba(164,53,240,.4); transition:0.3s; }
.info-btn:hover { background:rgba(164,53,240,.15); border-color:#a435f0; box-shadow: inset 0 0 10px rgba(164,53,240,0.3); }

.cyber-btn { flex:1.5; display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(90deg,#a435f0,#6e21a8); color:#fff; text-decoration:none; padding:12px; border-radius:12px; font-weight:800; font-size:.9rem; transition:all 0.3s ease; border: 1px solid transparent; position: relative; overflow: hidden; }
.cyber-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.5s; }
.cyber-btn:hover::before { left: 100%; }
.cyber-btn:hover { background:linear-gradient(90deg,#b84df5,#852bc9); box-shadow:0 5px 20px rgba(164,53,240,.5); transform: translateY(-2px); }

.source-badge { position:absolute; top:12px; left:12px; background:rgba(10,10,18,.9); color:#00ff88; border: 1px solid rgba(0,255,136,0.3); font-size:.7rem; padding:5px 12px; border-radius:8px; z-index:5; font-weight:700; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.badge-wrapper { position:absolute; top:12px; right:12px; background:rgba(164,53,240,.95); font-size:.75rem; padding:6px 16px; border-radius:12px; z-index:5; color:#fff; font-weight:800; box-shadow: 0 4px 15px rgba(164,53,240,0.4); }
.limited-badge { background:linear-gradient(45deg,#ff416c,#ff4b2b)!important; animation: pulseRed 2s infinite; }

.img-overlay { position:absolute; bottom:0; left:0; width:100%; height:50%; background:linear-gradient(to top,#12121f,transparent); }
.status-dot { width:6px; height:6px; background:#00ff88; border-radius:50%; box-shadow:0 0 10px #00ff88; animation: pulseDot 1s infinite alternate;}
.price-tag { font-size:1.2rem; font-weight:900; }
.free-text { color:#00ff88; text-shadow: 0 0 8px rgba(0,255,136,0.4); }
.time { font-size:.85rem; color:#ccc; font-weight: 600;}

/* التحميل - مفاعل النيون الاحترافي */
.loading-state { display: flex; justify-content: center; align-items: center; min-height: 50vh; grid-column: 1 / -1; width: 100%; }
.water-vortex { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
.core-point { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 4px solid transparent; border-top-color: #00ff88; border-bottom-color: #a435f0; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; box-shadow: 0 0 20px rgba(164,53,240,0.4); z-index: 3; }
.ring-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed rgba(0,255,136,0.5); animation: spinReverse 4s linear infinite; z-index: 1; }
.ring-inner { position: absolute; width: 30px; height: 30px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 30px #a435f0; animation: pulseDot 0.8s infinite alternate; z-index: 2; }

/* Pagination (تم تحسين الأسهم والتأثيرات) */
.pagination { display:flex; justify-content:center; align-items:center; gap:12px; padding:40px 0 80px; width: 100%; grid-column: 1 / -1; }
.page-btn { background:rgba(20,20,30,.8); border:1px solid rgba(164,53,240,.3); color:#fff; width:45px; height:45px; border-radius:14px; cursor:pointer; font-family:"Cairo",sans-serif; font-weight:800; font-size:1.1rem; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; align-items:center; justify-content:center; }
.arrow-btn { background: rgba(164,53,240, 0.1); color: #a435f0; font-size: 1.2rem; }
.page-btn:hover:not(:disabled) { background:rgba(164,53,240,.2); border-color:#00ff88; color:#00ff88; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,255,136,0.25); }
.arrow-btn:hover:not(:disabled) { color: #00ff88; background: rgba(0,255,136,0.1); }
.page-btn.active { background:linear-gradient(135deg, #a435f0, #6e21a8); border-color:transparent; color:#fff; box-shadow:0 0 25px rgba(164,53,240,.6); transform: scale(1.15); }
.page-btn:disabled { opacity:.2; cursor:not-allowed; border-color: rgba(255,255,255,0.05); transform: none; }

/* Empty state */
.empty-state { grid-column:1/-1; text-align:center; padding:80px 20px; color:#888; }
.empty-icon { font-size:3.5rem; margin-bottom:15px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
.empty-state h3 { color:#fff; font-size:1.6rem; margin-bottom:8px; }

/* Keyframes الأنيميشن */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spinReverse { 100% { transform: rotate(-360deg); } }
@keyframes pulseDot { from{opacity:0.5; transform:scale(0.8)} to{opacity:1; transform:scale(1.2)} }
@keyframes pulseGlow { from{opacity:0.5; transform:translateX(-50%) scale(0.9)} to{opacity:1; transform:translateX(-50%) scale(1.1)} }
@keyframes pulseRed { 0%{box-shadow: 0 0 0 0 rgba(255,65,108,0.7);} 70%{box-shadow: 0 0 0 12px rgba(255,65,108,0);} 100%{box-shadow: 0 0 0 0 rgba(255,65,108,0);} }
@keyframes textShimmer { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }

@media (max-width:600px) { .grid-layout{grid-template-columns:1fr;gap:25px} .filters-bar{flex-direction:column;align-items:stretch} .filter-select-wrapper{flex:1; justify-content: space-between;} }
</style>