const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/LibraryPage.vue'),
      },
    ],
  },
]

export default routes
