import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Index.vue')
      },
      {
        path: '/trabajadores',
        component: () => import('layouts/admin/Trabajadores.vue'),

      },
      {
        path: '/usuarios',
        component: () => import('layouts/admin/Usuarios.vue'),

      },
      {
        path: '/puestos_laborales',
        component: () => import('layouts/admin/PuestosLaborales.vue'),

      },
      {
        path: '/categorias',
        component: () => import('layouts/admin/Categorias.vue'),

      },
      {
        path: '/entidades',
        component: () => import('layouts/admin/Entidades.vue'),

      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
