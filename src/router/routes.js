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
        path: 'tracker',
        component: () => import('src/pages/TrackerPage.vue'),
      },
    ],
  },
]

export default routes
