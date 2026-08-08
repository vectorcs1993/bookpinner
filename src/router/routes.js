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
    ],
  },
]

export default routes
