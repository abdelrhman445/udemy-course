<template>
  <div class="login-page">
    <div class="bg-glow" />
    <div class="hero-glow" />

    <div class="login-box">
      <div class="icon-header">
        🔐
      </div>
      <h2>Login to your account</h2>
      <p class="subtitle">
        Welcome To UDEMY<span>FREE</span>
      </p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="البريد الإلكتروني"
            required
          >
        </div>
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="كلمة المرور"
            required
          >
        </div>

        <button
          type="submit"
          class="login-btn"
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
    };
  },
  methods: {
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
        this.$router.push("/");
      } catch (error) {
        alert(error.response?.data?.msg || "خطأ في البيانات، حاول مرة أخرى");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a12; /* لون أعمق يتماشى مع الهوم بيج */
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* التوهج الخلفي (Cyber Glows) */
.bg-glow {
  position: absolute;
  top: -10%;
  right: -10%;
  width: clamp(300px, 50vw, 600px);
  height: clamp(300px, 50vw, 600px);
  background: radial-gradient(
    circle,
    rgba(164, 53, 240, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(0, 210, 255, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* كارت الدخول الزجاجي الاحترافي */
.login-box {
  background: rgba(255, 255, 255, 0.03);
  padding: clamp(30px, 8vw, 50px);
  border-radius: 30px;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: clamp(280px, 95%, 450px);
  text-align: center;
  color: white;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.login-box:hover {
  border-color: rgba(164, 53, 240, 0.4);
  transform: translateY(-5px);
}

.icon-header {
  font-size: 3rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(164, 53, 240, 0.5));
}

h2 {
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 900;
  margin-bottom: 10px;
  background: linear-gradient(to right, #fff, #a435f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #888;
  margin-bottom: 35px;
  font-size: 0.95rem;
}

.subtitle span {
  color: #a435f0;
  font-weight: bold;
}

/* المدخلات (Inputs) */
input {
  width: 100%;
  padding: 16px;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: white;
  text-align: right;
  direction: rtl;
  font-size: 1rem;
  transition: 0.3s;
}

input:focus {
  outline: none;
  border-color: #a435f0;
  background: rgba(164, 53, 240, 0.05);
  box-shadow: 0 0 20px rgba(164, 53, 240, 0.2);
}

/* الزرار النيوني */
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #a435f0, #6e1fb1);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(164, 53, 240, 0.3);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.2);
  box-shadow: 0 15px 30px rgba(164, 53, 240, 0.5);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer-links {
  margin-top: 25px;
}

.link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.3s;
}

.link:hover {
  color: #a435f0;
  text-shadow: 0 0 10px rgba(164, 53, 240, 0.3);
}

/* التوافق مع الشاشات (Responsive) */
@media (max-width: 480px) {
  .login-box {
    padding: 35px 20px;
  }
  input {
    padding: 14px;
  }
  .login-btn {
    padding: 14px;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .login-page {
    height: auto;
    padding: 40px 0;
  }
}
</style>
