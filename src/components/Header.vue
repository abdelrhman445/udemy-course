<template>
  <header class="neon-header">
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="ابحث في المنجم عن دورات..." 
        @keyup.enter="handleSearch"
      >
      <button
        :disabled="loading"
        @click="handleSearch"
      >
        <span v-if="!loading">🔍</span>
        <div
          v-else
          class="loader-mini"
        />
      </button>
    </div>
  </header>
</template>

<script>
// ✅ استدعاء السنترال اللي عملناه للأمان
import api from "@/api"; 

export default {
  name: "MainHeader",
  data() {
    return {
      searchQuery: "",
      courses: [], // النتائج اللي هترجع من الباك إند
      loading: false
    };
  },
  methods: {
    async handleSearch() {
      if (!this.searchQuery.trim()) return;
      
      this.loading = true;
      try {
        // ✅ الطلب بيروح لـ Vercel مباشرة باستخدام المتغير في .env
        const res = await api.get(`/courses/search?q=${this.searchQuery}`);
        
        this.courses = res.data; 
        
        // تنبيه في حالة عدم وجود نتائج في "المنجم"
        if (res.data.length === 0) {
           alert("ملقتش حاجة في المنجم بالاسم ده يا ريلزو");
        }

        // 💡 خطوة احترافية: نرسل النتائج للصفحة الرئيسية لعرضها
        this.$emit("search-results", this.courses);
        
      } catch (err) {
        console.error("خطأ في البحث:", err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* التنسيقات النيون الخاصة بك هنا */
</style>