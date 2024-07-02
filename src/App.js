import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Centres from "./pages/Centres";
import Students from "./pages/Students";
import Achievements from "./pages/Achievements";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import Dashboard from "./pages/Dashboard";
import LogoutPage from "./pages/LogoutPage";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import AuthLayout from "./components/Layout/AuthLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/admin" element={<AuthLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="logout" element={<LogoutPage />} />
      </Route>

      {/* protected routes */}
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
  return <RouterProvider router={router} />;
};

export default App;
