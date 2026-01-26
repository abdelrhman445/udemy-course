import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue"; // تأكد من إنشاء الملف
import AboutView from "../views/AboutView.vue"; 

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("../views/CategoriesView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/SettingsView.vue"),
  },
  {
  path: '/search',
  name: 'SearchResults',
  component: () => import('../views/SearchResultsView.vue')
},
{
  path: '/course/:id', 
  name: 'CourseDetails',
  component: () => import('../views/CourseDetails.vue')
}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
