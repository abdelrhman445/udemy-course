<template>
  <div id="app">
    <nav
      class="navbar"
      :class="{ 'nav-scrolled': isScrolled }"
    >
      <div class="nav-container">
        <div class="logo">
          UDEMY<span>FREE</span>
        </div>

        <div
          class="nav-links"
          :class="{ 'mobile-active': isMenuOpen }"
        >
          <router-link
            to="/"
            @click="isMenuOpen = false"
          >
            الرئيسية
          </router-link>
          <router-link
            to="/categories"
            @click="isMenuOpen = false"
          >
            الأقسام
          </router-link>
          <router-link
            to="/about"
            @click="isMenuOpen = false"
          >
            من نحن
          </router-link>

          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="login-nav-btn"
              @click="isMenuOpen = false"
            >
              تسجيل الدخول
            </router-link>
            <router-link
              to="/register"
              class="login-nav-btn"
              @click="isMenuOpen = false"
            >
              انضم الآن مجاناً
            </router-link>
          </template>

          <template v-else>
            <div class="user-meta">
              <router-link
                to="/settings"
                class="user-badge"
                @click="isMenuOpen = false"
              >
                ⚙️ إعدادات الحساب
              </router-link>
              <button
                class="logout-link"
                @click="handleLogout"
              >
                خروج
              </button>
            </div>
          </template>
        </div>

        <div
          class="burger"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span :class="{ 'line1-open': isMenuOpen }" />
          <span :class="{ 'line2-open': isMenuOpen }" />
          <span :class="{ 'line3-open': isMenuOpen }" />
        </div>
      </div>
    </nav>
    <router-view @auth-change="checkAuth" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false,
      isMenuOpen: false,
      isLoggedIn: false,
    };
  },
  watch: {
    $route() {
      this.checkAuth();
    },
  },
  mounted() {
    this.checkAuth();
    window.addEventListener("scroll", () => {
      this.isScrolled = window.scrollY > 20;
    });
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.isLoggedIn = false;
      this.isMenuOpen = false;
      if (this.$route.path !== "/") this.$router.push("/");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Cairo", sans-serif;
}
body {
  background: #080810;
  color: #fff;
  overflow-x: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
  padding: 25px 0;
  transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-scrolled {
  padding: 15px 0;
  background: rgba(11, 11, 21, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(164, 53, 240, 0.3);
}

.nav-container {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  direction: rtl;
}

.logo {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
}
.logo span {
  color: #a435f0;
  text-shadow: 0 0 15px rgba(164, 53, 240, 0.8);
}

.nav-links {
  display: flex;
  align-items: center;
}
.nav-links a {
  color: #ccc;
  text-decoration: none;
  margin-right: 35px;
  font-weight: 700;
  transition: 0.3s;
  position: relative;
}
.nav-links a:hover,
.router-link-active {
  color: #a435f0;
}

.login-nav-btn {
  border: 1px solid #a435f0 !important;
  padding: 10px 25px !important;
  border-radius: 50px;
  margin-right: 20px;
}

/* قسم إعدادات الحساب المطور */
.user-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 35px;
}

.user-badge {
  color: #fff !important;
  font-weight: 700;
  background: rgba(164, 53, 240, 0.1);
  padding: 8px 18px;
  border-radius: 12px;
  border: 1px solid rgba(164, 53, 240, 0.4);
  font-size: 0.95rem;
  text-decoration: none !important; /* إزالة الخط تحت الرابط */
  transition: 0.3s;
}
.user-badge:hover {
  background: rgba(164, 53, 240, 0.2);
  box-shadow: 0 0 15px rgba(164, 53, 240, 0.3);
  transform: translateY(-2px);
}

.logout-link {
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  padding: 6px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;
}
.logout-link:hover {
  background: #ff4d4d;
  color: #fff;
  box-shadow: 0 0 15px rgba(255, 77, 77, 0.4);
}

.burger {
  display: none;
  cursor: pointer;
  flex-direction: column;
  gap: 6px;
}
.burger span {
  width: 30px;
  height: 3px;
  background: #fff;
  transition: 0.4s;
}

@media (max-width: 850px) {
  .burger {
    display: flex;
    z-index: 2001;
  }
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: #0d0d1a;
    flex-direction: column;
    padding-top: 100px;
    transition: 0.5s;
  }
  .nav-links.mobile-active {
    right: 0;
  }
  .nav-links a,
  .user-meta {
    margin: 20px 0;
    margin-right: 0;
  }
}
</style>
