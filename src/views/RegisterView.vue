<template>
  <div class="auth-page">
    <div class="bg-glow" />

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
          <h2>Greate new account</h2>

          <form @submit.prevent="handleRegister">
            <div class="input-wrapper">
              <input
                v-model="username"
                type="text"
                placeholder="اسم المستخدم"
                required
              >
            </div>
            <div class="input-wrapper">
              <input
                v-model="email"
                type="email"
                placeholder="البريد الإلكتروني"
                required
              >
            </div>
            <div class="input-wrapper">
              <input
                v-model="password"
                type="password"
                placeholder="كلمة المرور"
                required
              >
            </div>

            <button
              type="submit"
              class="btn-primary"
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
          <h2>تأكيد الحساب</h2>
          <p class="subtitle">
            الرمز المرسل لبريدك: {{ email }}
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
              class="btn-verify"
              :disabled="loading"
            >
              {{ loading ? "جاري التأكيد..." : "تفعيل الحساب الآن" }}
            </button>
          </form>
          <button
            class="back-btn"
            @click="showOTP = false"
          >
            تعديل البيانات
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
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      try {
        await api.post("/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.showOTP = true;
      } catch (e) {
        alert(e.response?.data?.msg || "حدث خطأ في التسجيل");
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
        alert("تم التفعيل بنجاح!");
        this.$router.push("/login");
      } catch (e) {
        alert("الرمز غير صحيح");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1a2e 0%, #080810 100%);
  position: relative;
  overflow-x: hidden;
  padding: 20px;
}

.bg-glow {
  position: absolute;
  width: clamp(300px, 50vw, 500px);
  height: clamp(300px, 50vw, 500px);
  background: radial-gradient(
    circle,
    rgba(164, 53, 240, 0.15) 0%,
    transparent 70%
  );
  top: -100px;
  right: -100px;
  pointer-events: none;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  padding: clamp(25px, 5vw, 50px);
  border-radius: clamp(20px, 4vw, 35px);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.02);
  transition: 0.4s;
}

.icon-box {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(164, 53, 240, 0.5));
}

h2 {
  color: #fff;
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 900;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(164, 53, 240, 0.3));
}

.subtitle {
  color: #888;
  margin-bottom: clamp(20px, 5vw, 35px);
  font-size: clamp(0.85rem, 2vw, 1rem);
}

input {
  width: 100%;
  padding: clamp(12px, 3vw, 18px);
  margin-bottom: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: right;
  font-size: 1rem;
  transition: 0.3s;
}

.btn-primary,
.btn-verify {
  width: 100%;
  padding: clamp(14px, 3vw, 18px);
  background: linear-gradient(45deg, #a435f0, #7b2cbf);
  color: white;
  border: none;
  border-radius: 15px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.4s;
}

/* --- تحسين اللينك الاحترافي --- */
.link-wrapper {
  margin-top: 30px;
}

.link {
  color: #888;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s ease;
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
}

.link span {
  color: #a435f0; /* اللون البنفسجي الثيم */
  transition: 0.3s;
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

.link:hover span {
  color: #fff;
  text-shadow: 0 0 15px #a435f0;
}

.link:hover::after {
  width: 100%;
}

.back-btn {
  background: transparent;
  border: 1px solid #444;
  color: #888;
  padding: 8px 20px;
  border-radius: 10px;
  margin-top: 25px;
  cursor: pointer;
  transition: 0.3s;
}

.back-btn:hover {
  border-color: #a435f0;
  color: #fff;
  box-shadow: 0 0 15px rgba(164, 53, 240, 0.3);
}

/* التوافقية */
.otp-input {
  text-align: center;
  font-size: clamp(1.5rem, 6vw, 2.2rem);
  letter-spacing: clamp(4px, 2vw, 12px);
  font-weight: 900;
  color: #a435f0;
  border: 2px dashed rgba(164, 53, 240, 0.3);
  direction: ltr;
}

@media (max-width: 480px) {
  .glass-card {
    padding: 30px 20px;
  }
  .link {
    font-size: 0.85rem;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .auth-page {
    height: auto;
    padding: 50px 20px;
  }
}

@media (min-width: 2000px) {
  .glass-card {
    max-width: 550px;
    transform: scale(1.1);
  }
}

.loader {
  width: 25px;
  height: 25px;
  border: 3px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>
