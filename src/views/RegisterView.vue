<template>
  <div class="auth-page">
    <div class="bg-glow" />
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

    <div class="glass-card">
      <transition
        name="fade-slide"
        mode="out-in"
      >
        <div
          v-if="!showOTP"
          key="register"
          class="form-step"
        >
          <h2 class="glitch-text">
            Create new account
          </h2>
          <p class="subtitle">
            Join UDEMY<span>FREE</span> today
          </p>

          <form @submit.prevent="handleRegister">
            <div class="input-wrapper">
              <input
                v-model="username"
                type="text"
                placeholder="👤 اسم المستخدم"
                required
              >
            </div>
            <div class="input-wrapper">
              <input
                v-model="email"
                type="email"
                placeholder="📧 البريد الإلكتروني"
                required
              >
            </div>
            <div class="input-wrapper">
              <input
                v-model="password"
                type="password"
                placeholder="🔑 كلمة المرور"
                required
              >
            </div>

            <button
              type="submit"
              class="btn-primary cyber-hover"
              :disabled="loading"
            >
              <span v-if="!loading">Sign up</span>
              <div
                v-else
                class="loader"
              />
            </button>
          </form>

          <div class="link-wrapper">
            <router-link
              to="/login"
              class="link"
            >
              لديك حساب بالفعل؟ <span>سجل دخولك</span>
            </router-link>
          </div>
        </div>

        <div
          v-else
          key="otp"
          class="form-step"
        >
          <div class="icon-box">
            🛡️
          </div>
          <h2 class="glitch-text">
            تأكيد الحساب
          </h2>
          <p class="subtitle otp-subtitle">
            الرمز المرسل لبريدك:<br> <span class="email-highlight">{{ email }}</span>
          </p>

          <form @submit.prevent="handleVerifyOTP">
            <input
              v-model="otpCode"
              type="text"
              placeholder="000000"
              class="otp-input"
              maxlength="6"
              required
            >
            <button
              type="submit"
              class="btn-verify cyber-hover"
              :disabled="loading"
            >
              <span v-if="!loading">تفعيل الحساب الآن</span>
              <div
                v-else
                class="loader"
              />
            </button>
          </form>
          <button
            class="back-btn"
            @click="showOTP = false"
          >
            <i
              class="fas fa-arrow-right"
              style="margin-left: 5px; font-size: 0.8rem;"
            /> تعديل البيانات
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      otpCode: "",
      showOTP: false,
      loading: false,
      // 🌟 بيانات الإشعارات 🌟
      toast: { show: false, message: "", type: "success" },
      toastTimer: null
    };
  },
  computed: {
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
      
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    },

    async handleRegister() {
      this.loading = true;
      try {
        await api.post("/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.showToast("تم إرسال رمز التفعيل لبريدك! 📩", "success");
        this.showOTP = true;
      } catch (e) {
        this.showToast(e.response?.data?.msg || "حدث خطأ في التسجيل", "error");
      } finally {
        this.loading = false;
      }
    },

    async handleVerifyOTP() {
      this.loading = true;
      try {
        await api.post("/auth/verify-otp", {
          email: this.email,
          otp: this.otpCode,
        });
        this.showToast("تم التفعيل بنجاح! جاري تحويلك... 🚀", "success");
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
      } catch (e) {
        this.showToast("الرمز غير صحيح أو منتهي الصلاحية", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية - مع حل مشكلة السكرول بار 🌟 */
.auth-page {
  min-height: 100vh;
  box-sizing: border-box; /* يمنع الـ padding من زيادة الطول */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a12;
  position: relative;
  overflow: hidden; /* إخفاء أي سكرول بار خارجي نهائياً */
  padding: 20px;
}

/* التوهج الخلفي (Cyber Glows) */
.bg-glow {
  position: absolute;
  top: -10%;
  right: -10%;
  width: clamp(300px, 50vw, 600px);
  height: clamp(300px, 50vw, 600px);
  background: radial-gradient(circle, rgba(164, 53, 240, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: pulseGlow 5s infinite alternate;
}

.hero-glow {
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%);
  pointer-events: none;
  animation: pulseGlow 4s infinite alternate-reverse;
}

/* الكارت الزجاجي الاحترافي */
.glass-card {
  background: rgba(20, 20, 30, 0.6);
  padding: clamp(30px, 8vw, 50px);
  border-radius: 35px;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(164, 53, 240, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(164, 53, 240, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideUpFade 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
  z-index: 10;
}

.glass-card:hover {
  border-color: rgba(164, 53, 240, 0.5);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(164, 53, 240, 0.1);
}

.icon-box {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  margin-bottom: 15px;
  filter: drop-shadow(0 0 15px rgba(164, 53, 240, 0.5));
  animation: floatIcon 3s ease-in-out infinite;
}

.glitch-text {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 900;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #fff 30%, #a435f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(164, 53, 240, 0.3));
}

.subtitle {
  color: #a0a0b0;
  margin-bottom: clamp(25px, 5vw, 35px);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.subtitle span { color: #00ff88; font-weight: 800; text-shadow: 0 0 10px rgba(0, 255, 136, 0.3); }

.otp-subtitle { line-height: 1.6; }
.email-highlight { color: #a435f0 !important; font-weight: 800; letter-spacing: 0; font-size: 1.05rem;}

/* المدخلات (Inputs) */
.input-wrapper {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 16px 20px;
  box-sizing: border-box; /* لضمان عدم تجاوز المساحة المحددة */
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: white;
  text-align: right;
  direction: rtl;
  font-size: 1rem;
  font-family: "Cairo", sans-serif;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

input::placeholder { color: #666; }

input:focus {
  outline: none;
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.05);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15), inset 0 2px 5px rgba(0, 0, 0, 0.5);
}

/* الأزرار والتأثيرات */
.btn-primary, .btn-verify {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #a435f0 0%, #6e1fb1 100%);
  border: 1px solid transparent;
  border-radius: 15px;
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(164, 53, 240, 0.3);
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.cyber-hover::before {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.6s ease;
}
.cyber-hover:hover::before { left: 100%; }

.btn-primary:hover:not(:disabled), .btn-verify:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(164, 53, 240, 0.5);
  background: linear-gradient(135deg, #b84df5 0%, #852bc9 100%);
}

.btn-primary:disabled, .btn-verify:disabled {
  opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none;
}

/* اللينك بتاع تسجيل الدخول */
.link-wrapper { margin-top: 30px; }
.link { color: #888; text-decoration: none; font-size: 0.95rem; font-weight: 600; transition: all 0.4s ease; position: relative; display: inline-block; padding-bottom: 5px; font-family: "Cairo", sans-serif;}
.link span { color: #a435f0; transition: 0.3s; }
.link::after { content: ""; position: absolute; width: 0; height: 2px; bottom: 0; left: 50%; background: #a435f0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); transform: translateX(-50%); box-shadow: 0 0 10px #a435f0; }
.link:hover { color: #fff; text-shadow: 0 0 10px rgba(164, 53, 240, 0.4); }
.link:hover span { color: #00ff88; text-shadow: 0 0 15px #00ff88; }
.link:hover::after { width: 100%; background: #00ff88; box-shadow: 0 0 10px #00ff88;}

/* زرار الرجوع */
.back-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 12px 25px; border-radius: 12px; margin-top: 25px; cursor: pointer; transition: 0.3s; font-family: "Cairo", sans-serif; font-weight: 700;}
.back-btn:hover { border-color: #a435f0; color: #fff; box-shadow: 0 0 15px rgba(164, 53, 240, 0.3); background: rgba(164,53,240,0.1);}

/* حقل الـ OTP (تصميم سايبربنك) */
.otp-input {
  text-align: center; font-size: clamp(1.8rem, 6vw, 2.5rem); letter-spacing: clamp(10px, 3vw, 20px);
  font-weight: 900; color: #fff; background: rgba(164, 53, 240, 0.05); border: 2px dashed rgba(164, 53, 240, 0.4);
  direction: ltr; margin-bottom: 30px; padding: 20px 10px; border-radius: 20px; transition: all 0.3s ease;
}
.otp-input:focus { border: 2px solid #00ff88; background: rgba(0, 255, 136, 0.08); box-shadow: 0 0 20px rgba(0, 255, 136, 0.2), inset 0 0 10px rgba(0, 255, 136, 0.1); color: #00ff88; text-shadow: 0 0 10px rgba(0,255,136,0.5);}
.otp-input::placeholder { color: rgba(255,255,255,0.1); font-weight: 400;}

/* 🌟 ستايل الإشعار الذكي (Cyber Toast) 🌟 */
.cyber-toast {
  position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 9999;
  display: flex; align-items: center; gap: 12px; padding: 15px 25px; border-radius: 15px;
  font-family: "Cairo", sans-serif; font-weight: 700; color: #fff; backdrop-filter: blur(15px);
  border: 1px solid transparent; direction: rtl; min-width: 280px; justify-content: center;
}
.cyber-toast i { font-size: 1.3rem; }
.cyber-toast.success { background: rgba(0, 255, 136, 0.15); border-color: rgba(0, 255, 136, 0.5); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2); }
.cyber-toast.success i { color: #00ff88; }
.cyber-toast.error { background: rgba(255, 77, 77, 0.15); border-color: rgba(255, 77, 77, 0.5); box-shadow: 0 10px 30px rgba(255, 77, 77, 0.2); }
.cyber-toast.error i { color: #ff4d4d; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-slide-enter-from { opacity: 0; transform: translate(-50%, -40px); }
.toast-slide-leave-to { opacity: 0; transform: translate(-50%, -40px); }

/* أنيميشن التنقل بين الفورم والـ OTP */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.fade-slide-enter-from { opacity: 0; transform: scale(0.95) translateX(30px); }
.fade-slide-leave-to { opacity: 0; transform: scale(0.95) translateX(-30px); }

/* اللودر الدائري البسيط */
.loader { width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-bottom-color: #fff; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; }

/* Keyframes */
@keyframes rotation { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulseGlow { from { transform: scale(0.9); opacity: 0.7; } to { transform: scale(1.1); opacity: 1; } }
@keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
@keyframes floatIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* التوافقية مع الموبايلات (لإخفاء السكرول بار تماماً لكن السماح بالتمرير لو الشاشة قصيرة) */
@media (max-height: 700px) {
  .auth-page {
    overflow-y: auto; /* السماح بالتمرير الداخلي في الشاشات القصيرة */
  }
  .auth-page::-webkit-scrollbar {
    display: none; /* إخفاء شكل السكرول بار */
  }
}

@media (max-width: 480px) {
  .glass-card { padding: 40px 20px; border-radius: 25px;}
  input { padding: 15px; }
  .btn-primary, .btn-verify { padding: 16px; font-size: 1.1rem;}
  .cyber-toast { width: 90%; top: 20px; }
}
@media (max-height: 600px) and (orientation: landscape) {
  .auth-page { height: auto; padding: 40px 20px; }
}
</style>