<template>
  <div class="settings-page">
    <div class="hero-glow" />

    <transition name="toast-slide">
      <div
        v-if="toast.show"
        class="cyber-toast"
        :class="toast.type"
      >
        <i
          class="fas"
          :class="toastIcon"
        />
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <div
      v-if="loading"
      class="vortex-container"
    >
      <div class="water-vortex">
        <div class="core-point" />
        <span class="ring-outer" />
        <span class="ring-inner" />
      </div>
    </div>

    <div
      v-else
      class="settings-container"
    >
      <header class="settings-header">
        <i class="fas fa-user-cog settings-icon" />
        <h1 class="glitch-text">
          إعدادات الحساب
        </h1>
        <p class="subtitle">
          إدارة بياناتك الشخصية وأمان حسابك
        </p>
      </header>

      <div class="glass-grid">
        <section
          class="settings-card profile-card"
          style="--delay: 0.1s"
        >
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
              class="save-btn cyber-hover"
            >
              حفظ التغييرات
            </button>
          </form>
        </section>

        <section
          class="settings-card danger-card"
          style="--delay: 0.3s"
        >
          <h3><i class="fas fa-exclamation-triangle" /> منطقة الخطر</h3>
          <p class="danger-desc">
            بمجرد حذف حسابك، لن تتمكن من استعادة بياناتك مرة أخرى.
          </p>
          
          <transition name="fade">
            <div
              v-if="showDeletePrompt"
              class="delete-verify-zone"
            >
              <div class="input-group">
                <label class="danger-label">أدخل كلمة المرور لتأكيد الحذف النهائي</label>
                <input
                  v-model="passwordForDelete"
                  type="password"
                  placeholder="كلمة المرور الخاصة بك"
                  class="danger-input"
                >
              </div>
              <div class="delete-actions">
                <button
                  class="confirm-delete-btn danger-hover"
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
      // 🌟 بيانات الإشعارات 🌟
      toast: { show: false, message: "", type: "success" },
      toastTimer: null
    };
  },
  computed: {
    // تحديد الأيقونة المناسبة لكل نوع إشعار
    toastIcon() {
      if (this.toast.type === 'success') return 'fa-check-circle';
      if (this.toast.type === 'error') return 'fa-times-circle';
      return 'fa-exclamation-circle';
    }
  },
  methods: {
    // 🌟 دالة إظهار الإشعارات 🌟
    showToast(message, type = 'success') {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;
      
      // إخفاء الإشعار بعد 4 ثواني
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    },

    async updateProfile() {
      if (!this.form.username && !this.form.newPassword) {
        return this.showToast("يرجى ملء حقل واحد على الأقل للتحديث", "warning");
      }

      if (!this.form.currentPassword) {
        return this.showToast("يرجى إدخال كلمة المرور الحالية لتأكيد التغييرات", "warning");
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
        
        this.showToast("تم تحديث البيانات بنجاح! 🚀", "success");
        this.form.currentPassword = "";
        this.form.newPassword = "";
        this.$emit("auth-change");
      } catch (e) {
        if (e.response?.status === 401) {
          this.showToast(e.response.data.message || "كلمة المرور الحالية غير صحيحة", "error");
        } else {
          this.showToast("حدث خطأ أثناء التحديث", "error");
        }
      } finally {
        this.loading = false;
      }
    },

    async confirmDelete() {
      if (!this.passwordForDelete) {
        return this.showToast("يرجى إدخال كلمة المرور لتأكيد الحذف", "warning");
      }

      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        
        await api.delete("/auth/delete", {
          headers: { Authorization: `Bearer ${token}` },
          data: { password: this.passwordForDelete } 
        });

        this.showToast("تم حذف الحساب بنجاح. نتمنى رؤيتك قريباً.", "success");
        localStorage.clear();
        setTimeout(() => {
          this.$router.push("/register");
        }, 1500); // تأخير بسيط ليتمكن من قراءة الرسالة قبل التوجيه
      } catch (e) {
        const msg = e.response?.data?.msg || "فشل حذف الحساب. تأكد من كلمة المرور.";
        this.showToast(msg, "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية */
.settings-page { padding-top: 120px; min-height: 100vh; background: #080810; position: relative; overflow-x: hidden; }
.hero-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 800px; height: 500px; background: radial-gradient(circle, rgba(164, 53, 240, 0.15) 0%, transparent 70%); pointer-events: none; animation: pulseGlow 4s infinite alternate; }

.settings-container { max-width: 800px; margin: 0 auto; padding: 0 20px 80px; direction: rtl; position: relative; z-index: 5; }

/* الهيدر */
.settings-header { text-align: center; margin-bottom: 50px; }
.settings-icon { font-size: 3.5rem; color: #a435f0; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(164, 53, 240, 0.5)); animation: floatIcon 3s ease-in-out infinite;}
.glitch-text { font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 900; margin-bottom: 10px; background: linear-gradient(135deg, #fff 30%, #a435f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 10px rgba(164, 53, 240, 0.3)); }
.subtitle { color: #a0a0b0; font-weight: 600; font-size: 1.05rem; }

/* الكروت الزجاجية */
.glass-grid { display: grid; grid-template-columns: 1fr; gap: 35px; }
.settings-card { background: rgba(20, 20, 30, 0.6); border-radius: 25px; padding: clamp(25px, 5vw, 45px); border: 1px solid rgba(164, 53, 240, 0.2); backdrop-filter: blur(20px); box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(164,53,240,0.05); animation: slideUpFade 0.6s ease forwards; animation-delay: var(--delay); opacity: 0; transform: translateY(30px); }
.settings-card h3 { margin-bottom: 30px; color: #fff; font-size: 1.4rem; display: flex; align-items: center; gap: 15px; font-weight: 800; }
.settings-card h3 i { color: #a435f0; font-size: 1.6rem;}

/* المدخلات (Inputs) */
.input-group { margin-bottom: 25px; }
.input-group label { display: block; margin-bottom: 10px; color: #ccc; font-weight: 700; font-size: 0.95rem; }
.input-group input { width: 100%; padding: 16px 20px; background: rgba(10, 10, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px; color: #fff; transition: all 0.3s ease; font-family: "Cairo", sans-serif; font-size: 1rem; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);}
.input-group input:focus { border-color: #00ff88; outline: none; background: rgba(0, 255, 136, 0.05); box-shadow: 0 0 15px rgba(0, 255, 136, 0.15), inset 0 2px 5px rgba(0,0,0,0.5); }

/* زرار الحفظ */
.save-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #a435f0 0%, #6e1fb1 100%); color: #fff; border: 1px solid transparent; border-radius: 15px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 25px rgba(164, 53, 240, 0.3); margin-top: 10px; position: relative; overflow: hidden;}
.cyber-hover::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.6s ease; }
.cyber-hover:hover::before { left: 100%; }
.save-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(164, 53, 240, 0.5); background: linear-gradient(135deg, #b84df5 0%, #852bc9 100%); }

/* منطقة الخطر (Danger Zone) */
.danger-card { border-color: rgba(255, 77, 77, 0.3); box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,77,77,0.05); }
.danger-card h3 { color: #ff4d4d; }
.danger-card h3 i { color: #ff4d4d; }
.danger-desc { color: #a0a0b0; margin-bottom: 25px; line-height: 1.6;}

.danger-label { color: #ff4d4d !important; }
.danger-input { border-color: rgba(255, 77, 77, 0.3) !important; }
.danger-input:focus { border-color: #ff4d4d !important; box-shadow: 0 0 15px rgba(255, 77, 77, 0.2) !important; background: rgba(255, 77, 77, 0.05) !important;}

.delete-actions { display: flex; gap: 15px; margin-top: 25px; }
.confirm-delete-btn { flex: 2; background: linear-gradient(135deg, #ff4d4d 0%, #c92a2a 100%); color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;}
.danger-hover::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.6s ease; }
.danger-hover:hover::before { left: 100%; }
.confirm-delete-btn:hover { box-shadow: 0 10px 25px rgba(255, 77, 77, 0.4); transform: translateY(-3px); }

.cancel-btn { flex: 1; background: transparent; color: #ccc; border: 1px solid #444; padding: 15px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: 700; font-family: "Cairo", sans-serif;}
.cancel-btn:hover { background: rgba(255, 255, 255, 0.05); color: #fff; border-color: #666;}

.delete-btn { background: rgba(255,77,77,0.1); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.4); padding: 16px 25px; border-radius: 15px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; width: 100%; }
.delete-btn:hover { background: #ff4d4d; color: #fff; box-shadow: 0 10px 25px rgba(255, 77, 77, 0.4); transform: translateY(-3px);}

/* 🌟 ستايل الإشعار الذكي (Cyber Toast) 🌟 */
.cyber-toast {
  position: fixed;
  top: 100px; /* نزلتها شوية عشان الهيدر */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  border-radius: 15px;
  font-family: "Cairo", sans-serif;
  font-weight: 700;
  color: #fff;
  backdrop-filter: blur(15px);
  border: 1px solid transparent;
  direction: rtl;
}
.cyber-toast i { font-size: 1.3rem; }
.cyber-toast.success { background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.4); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2); }
.cyber-toast.success i { color: #00ff88; }
.cyber-toast.error { background: rgba(255, 77, 77, 0.1); border-color: rgba(255, 77, 77, 0.4); box-shadow: 0 10px 30px rgba(255, 77, 77, 0.2); }
.cyber-toast.error i { color: #ff4d4d; }
.cyber-toast.warning { background: rgba(255, 170, 0, 0.1); border-color: rgba(255, 170, 0, 0.4); box-shadow: 0 10px 30px rgba(255, 170, 0, 0.2); }
.cyber-toast.warning i { color: #ffaa00; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-slide-enter-from { opacity: 0; transform: translate(-50%, -40px); }
.toast-slide-leave-to { opacity: 0; transform: translate(-50%, -40px); }

/* أنيميشن الظهور للبطاقات (Vue Transition) */
.fade-enter-active, .fade-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-20px); }

/* اللودر السايبربنك الموحد */
.vortex-container { display: flex; justify-content: center; align-items: center; min-height: 50vh; }
.water-vortex { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
.core-point { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 4px solid transparent; border-top-color: #00ff88; border-bottom-color: #a435f0; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; box-shadow: 0 0 20px rgba(164, 53, 240, 0.4); z-index: 3; }
.ring-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed rgba(0, 255, 136, 0.5); animation: spinReverse 4s linear infinite; z-index: 1; }
.ring-inner { position: absolute; width: 30px; height: 30px; background: #a435f0; border-radius: 50%; box-shadow: 0 0 30px #a435f0; animation: pulseDot 0.8s infinite alternate; z-index: 2; }

/* Keyframes */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spinReverse { 100% { transform: rotate(-360deg); } }
@keyframes pulseDot { from{opacity:0.5; transform:scale(0.8)} to{opacity:1; transform:scale(1.2)} }
@keyframes pulseGlow { from{opacity:0.5; transform:translateX(-50%) scale(0.9)} to{opacity:1; transform:translateX(-50%) scale(1.1)} }
@keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
@keyframes floatIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

@media (max-width: 600px) { 
  .glitch-text { font-size: 1.8rem; } 
  .delete-actions { flex-direction: column; } 
  .settings-card { padding: 30px 20px; }
  .cyber-toast { width: 90%; text-align: center; justify-content: center;}
}
</style>