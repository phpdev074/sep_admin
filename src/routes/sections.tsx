import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { BlockView } from 'src/sections/blockUser/view/blockedUser';
import { ReportPostView } from 'src/sections/reportPost/view/post-view';
import PrivateRoute from 'src/PrivateRoute';
import { OtpView } from 'src/sections/otp/otp-view';
import { ContactUsViewPage } from 'src/sections/page/view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const PostPage = lazy(() => import('src/pages/post'));
export const DeleteView = lazy(() => import('src/pages/deletedUser'))
// export const BlockedUserView = lazy(() => import('src/pages/blockedUser')); 
// export const Post = lazy(() => import('src/pages/post'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {

  const token = localStorage.getItem('token');

  return useRoutes([
    {
      path: '/',
      element: token ? <Navigate to="/dashboard" replace /> : (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
      
    },
    {
      element: (
        <PrivateRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { path:"dashboard", element: <HomePage />,  },
        { path: 'user', element: <UserPage /> },
        { path: 'blockedUser', element: <BlockView /> },
        { path: 'deletedUser', element:<DeleteView/> },
        {path:'post',element:<PostPage />},
        {path:'reportpost',element:<ReportPostView />},
        { path: 'products', element: <ProductsPage /> },
        { path: 'setting', element: <BlogPage /> },
        { path: 'page', element:<ContactUsViewPage /> }
      ],
    },
    {
      path: 'otp',
      element: <OtpView />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
