import { createRouter, createWebHistory } from 'vue-router';
import { userStore } from '../stores/UserStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      meta: { requiresAuth: true },
      name: 'home',
      component: () => import('../views/RootPage.vue'),
      children: [{ path: '/', name: '', component: () => import('../views/HomeView.vue') }],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = userStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.User.GoogleName || !store.User.FBName) {
      next({ path: '/login', replace: true });
      return;
    }
  }
  // 若 無適配路徑 則 導到首頁
  if (!to.matched.length) {
    next({ path: '/', replace: true });
    return;
  }

  next();
});

export default router;
