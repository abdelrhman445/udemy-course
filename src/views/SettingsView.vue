<template>
  <div class="settings-page">
    <div class="hero-glow" />

    <div
      v-if="loading"
      class="vortex-container"
    >
      <div class="water-vortex">
        <div class="core-point" />
        <span /><span /><span />
      </div>
    </div>

    <div
      v-else
      class="settings-container"
    >
      <header class="settings-header">
        <i class="fas fa-user-cog settings-icon" />
        <h1>إعدادات الحساب</h1>
        <p>إدارة بياناتك الشخصية وأمان حسابك</p>
      </header>

      <div class="glass-grid">
        <section class="settings-card profile-card">
          <h3><i class="fas fa-edit" /> تحديث الملف الشخصي</h3>
          <form @submit.prevent="updateProfile">
            <div class="input-group">
              <label>اسم الايميل الجديد</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="أدخل الاسم الجديد"
              >
            </div>

            <div class="input-group">
              <label>كلمة المرور الحالية (للتحقق)</label>
              <input
                v-model="form.currentPassword"
                type="password"
                placeholder="أدخل كلمة المرور الحالية لتغيير البيانات"
              >
            </div>

            <transition name="fade">
              <div
                v-if="form.currentPassword"
                class="input-group"
              >
                <label>كلمة المرور الجديدة</label>
                <input
                  v-model="form.newPassword"
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                >
              </div>
            </transition>

            <button
              type="submit"
              class="save-btn"
            >
              حفظ التغييرات
            </button>
          </form>
        </section>

        <section class="settings-card danger-card">
          <h3><i class="fas fa-exclamation-triangle" /> منطقة الخطر</h3>
          <p>بمجرد حذف حسابك، لن تتمكن من استعادة بياناتك مرة أخرى.</p>
          
          <transition name="fade">
            <div
              v-if="showDeletePrompt"
              class="delete-verify-zone"
            >
              <div class="input-group">
                <label>أدخل كلمة المرور لتأكيد الحذف النهائي</label>
                <input
                  v-model="passwordForDelete"
                  type="password"
                  placeholder="كلمة المرور الخاصة بك"
                  class="danger-input"
                >
              </div>
              <div class="delete-actions">
                <button
                  class="confirm-delete-btn"
                  @click="confirmDelete"
                >
                  تأكيد الحذف
                </button>
                <button
                  class="cancel-btn"
                  @click="showDeletePrompt = false; passwordForDelete = ''"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </transition>

          <button
            v-if="!showDeletePrompt"
            class="delete-btn"
            @click="showDeletePrompt = true"
          >
            حذف الحساب نهائياً
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "SettingsView",
  emits: ['auth-change'], 
  data() {
    return {
      loading: false,
      showDeletePrompt: false, 
      passwordForDelete: "",
      form: { 
        username: "", 
        currentPassword: "", 
        newPassword: "" 
      },
    };
  },
  methods: {
    async updateProfile() {
      if (!this.form.username && !this.form.newPassword) {
        return alert("يرجى ملء حقل واحد على الأقل للتحديث");
      }

      if (!this.form.currentPassword) {
        return alert("يرجى إدخال كلمة المرور الحالية لتأكيد التغييرات");
      }

      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const res = await api.put(
          "/auth/update",
          this.form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.username) {
          localStorage.setItem("username", res.data.username);
        }
        
        alert("تم تحديث البيانات بنجاح! 🚀");
        this.form.currentPassword = "";
        this.form.newPassword = "";
        this.$emit("auth-change");
      } catch (e) {
        if (e.response?.status === 401) {
          alert(e.response.data.message || "كلمة المرور الحالية غير صحيحة");
        } else {
          alert("حدث خطأ أثناء التحديث");
        }
      } finally {
        this.loading = false;
      }
    },

    async confirmDelete() {
      if (!this.passwordForDelete) {
        return alert("يرجى إدخال كلمة المرور لتأكيد الحذف");
      }

      if (confirm("هل أنت متأكد فعلاً؟ سيتم مسح كل بياناتك نهائياً!")) {
        this.loading = true;
        try {
          const token = localStorage.getItem("token");
          
          await api.delete("/auth/delete", {
            headers: { Authorization: `Bearer ${token}` },
            data: { password: this.passwordForDelete } 
          });

          alert("تم حذف الحساب بنجاح. نتمنى رؤيتك قريباً.");
          localStorage.clear();
          this.$router.push("/register");
        } catch (e) {
          const msg = e.response?.data?.msg || "فشل حذف الحساب. تأكد من كلمة المرور.";
          alert(msg);
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
/* جميع التنسيقات الأصلية والنيونية كما هي */
.settings-page { padding-top: 120px; min-height: 100vh; background: #080810; position: relative; }
.hero-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100%; height: 400px; background: radial-gradient(circle, rgba(164, 53, 240, 0.1) 0%, transparent 70%); pointer-events: none; }
.settings-container { max-width: 900px; margin: 0 auto; padding: 0 20px 80px; direction: rtl; position: relative; z-index: 5; }
.settings-header { text-align: center; margin-bottom: 50px; }
.settings-icon { font-size: 3rem; color: #a435f0; margin-bottom: 15px; filter: drop-shadow(0 0 10px #a435f0); }
.settings-header h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 10px; }
.settings-header p { color: #888; }
.glass-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
.settings-card { background: rgba(255, 255, 255, 0.03); border-radius: 25px; padding: clamp(20px, 5vw, 40px); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); }
.settings-card h3 { margin-bottom: 25px; color: #a435f0; display: flex; align-items: center; gap: 15px; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 10px; color: #ccc; font-weight: 700; }
.input-group input { width: 100%; padding: 15px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; transition: 0.3s; }
.input-group input:focus { border-color: #a435f0; outline: none; box-shadow: 0 0 15px rgba(164, 53, 240, 0.2); }
.save-btn { width: 100%; padding: 15px; background: linear-gradient(90deg, #a435f0, #7b2cbf); color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
.save-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(164, 53, 240, 0.3); }

/* تنسيقات منطقة الحذف الجديدة */
.danger-input { border-color: rgba(255, 77, 77, 0.3) !important; }
.delete-actions { display: flex; gap: 15px; margin-top: 15px; }
.confirm-delete-btn { background: #ff4d4d; color: #fff; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
.confirm-delete-btn:hover { box-shadow: 0 0 15px rgba(255, 77, 77, 0.4); transform: translateY(-2px); }
.cancel-btn { background: transparent; color: #ccc; border: 1px solid #444; padding: 12px 25px; border-radius: 12px; cursor: pointer; transition: 0.3s; }
.cancel-btn:hover { background: rgba(255, 255, 255, 0.05); }

.danger-card { border-color: rgba(255, 77, 77, 0.2); }
.danger-card h3 { color: #ff4d4d; }
.delete-btn { background: transparent; color: #ff4d4d; border: 2px solid #ff4d4d; padding: 12px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 20px; }
.delete-btn:hover { background: #ff4d4d; color: #fff; box-shadow: 0 0 20px rgba(255, 77, 77, 0.4); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

.vortex-container { display: flex; justify-content: center; align-items: center; height: 50vh; }
.water-vortex { position: relative; width: 100px; height: 100px; }
.core-point { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 20px #a435f0; }
.water-vortex span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 2px solid #a435f0; border-radius: 50%; animation: ripple 2s infinite; opacity: 0; }
@keyframes ripple { 0% { width: 10px; height: 10px; opacity: 1; } 100% { width: 150px; height: 150px; opacity: 0; } }

@media (max-width: 600px) { .settings-header h1 { font-size: 1.8rem; } .delete-actions { flex-direction: column; } }
</style>