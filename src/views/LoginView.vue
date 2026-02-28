<template>
  <div class="login-page">
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

    <div class="login-box">
      <div class="icon-header">
        🔐
      </div>
      <h2 class="glitch-text">
        Login to your account
      </h2>
      <p class="subtitle">
        Welcome To UDEMY<span>FREE</span>
      </p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="📧 البريد الإلكتروني"
            required
          >
        </div>
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="🔑 كلمة المرور"
            required
          >
        </div>

        <button
          type="submit"
          class="login-btn cyber-hover"
          :disabled="loading"
        >
          <span v-if="!loading">Login</span>
          <div
            v-else
            class="loader"
          />
        </button>
      </form>

      <div class="footer-links">
        <router-link
          to="/register"
          class="link"
        >
          ليس لديك حساب؟ انضم إلينا
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      email: "",
      password: "",
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

    async handleLogin() {
      this.loading = true;
      try {
        const response = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username || "المبرمج");

        this.$emit("auth-success"); 
        this.showToast("تم تسجيل الدخول بنجاح! 🚀", "success");
        
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);

      } catch (error) {
        // اصطياد رسالة الخطأ الحقيقية من الباك إند
        let errorMsg = "خطأ في البيانات، حاول مرة أخرى";
        if (error.response && error.response.data) {
           errorMsg = error.response.data.detail || error.response.data.message || error.response.data.msg || errorMsg;
        }
        this.showToast(errorMsg, "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* الإعدادات الأساسية - مع حل مشكلة السكرول بار 🌟 */
.login-page {
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a12;
  position: relative;
  overflow: hidden; /* إخفاء السكرول بار الخارجي */
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

/* كارت الدخول الزجاجي الاحترافي */
.login-box {
  background: rgba(20, 20, 30, 0.6);
  padding: clamp(30px, 8vw, 50px);
  border-radius: 35px;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(164, 53, 240, 0.2);
  width: clamp(280px, 95%, 450px);
  text-align: center;
  color: white;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(164, 53, 240, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideUpFade 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
  z-index: 10;
}

.login-box:hover {
  border-color: rgba(164, 53, 240, 0.5);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(164, 53, 240, 0.1);
}

.icon-header {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 15px rgba(164, 53, 240, 0.5));
  animation: float 3s ease-in-out infinite;
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
  margin-bottom: 35px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.subtitle span {
  color: #00ff88;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

/* المدخلات (Inputs) */
.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 20px;
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

input::placeholder {
  color: #666;
}

input:focus {
  outline: none;
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.05);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15), inset 0 2px 5px rgba(0, 0, 0, 0.5);
}

/* الزرار النيوني */
.login-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #a435f0 0%, #6e1fb1 100%);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 900;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(164, 53, 240, 0.3);
  margin-top: 10px;
  border: 1px solid transparent;
}

/* تأثير اللمعة للزرار (Sweep Effect) */
.cyber-hover {
  position: relative;
  overflow: hidden;
}
.cyber-hover::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.6s ease;
}
.cyber-hover:hover::before {
  left: 100%;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(164, 53, 240, 0.5);
  background: linear-gradient(135deg, #b84df5 0%, #852bc9 100%);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* اللودر جوه الزرار */
.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

.footer-links {
  margin-top: 30px;
}

.link {
  color: #888;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: "Cairo", sans-serif;
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
}

.link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background: #a435f0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translateX(-50%);
  box-shadow: 0 0 10px #a435f0;
}

.link:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(164, 53, 240, 0.4);
}

.link:hover::after {
  width: 100%;
  background: #00ff88;
  box-shadow: 0 0 10px #00ff88;
}

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

/* Keyframes */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulseGlow {
  from { transform: scale(0.9); opacity: 0.7; }
  to { transform: scale(1.1); opacity: 1; }
}
@keyframes slideUpFade {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* التوافق مع الشاشات (Responsive) */
@media (max-height: 700px) {
  .login-page {
    overflow-y: auto;
  }
  .login-page::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-box { padding: 40px 20px; border-radius: 25px;}
  input { padding: 15px; }
  .login-btn { padding: 16px; font-size: 1.1rem;}
  .icon-header { font-size: 3rem; }
  .cyber-toast { width: 90%; top: 20px; }
}

@media (max-height: 600px) and (orientation: landscape) {
  .login-page { height: auto; padding: 40px 0; }
}
</style>