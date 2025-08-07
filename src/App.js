import React, { lazy, Suspense } from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import AuthLayout from './components/Layout/AuthLayout';
import PrivateRoute from './components/PrivateRoute';
import Spin from './components/Spin';

const Achievements = lazy(() => import('./pages/Achievements'));
const Centres = lazy(() => import('./pages/Centres'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const IndexPage = lazy(() => import('./pages/IndexPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Post = lazy(() => import('./pages/Post'));
const Students = lazy(() => import('./pages/Students'));
const Verify = lazy(() => import('./pages/Verify'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/admin" element={<AuthLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verify" element={<Verify />} />
        <Route path="logout" element={<LogoutPage />} />
        <Route path="maintenance" element={<Maintenance />} />
      </Route>

      {/* Protected routes */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="centres" element={<Centres />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="createPost" element={<CreatePost />} />
        <Route path="createPost/:id" element={<CreatePost />} />
        <Route path="post/:id" element={<Post />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <Suspense fallback={<Spin />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
