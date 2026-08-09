// routes.js
const routes = [
  {
    path: '/',
    redirect: '/library',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: 'library',
        component: () => import('src/pages/LibraryPage.vue'),
      },
      {
        path: 'shelves',
        component: () => import('src/pages/ShelvesPage.vue'),
      },
      {
        path: 'statistics',
        component: () => import('src/pages/StatisticsPage.vue'),
      },
    ],
  },
]

export default routes
