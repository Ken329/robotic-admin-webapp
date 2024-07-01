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
      <Route element={<AuthLayout />}>
        <Route exact path="/admin" element={<IndexPage />} />
        <Route exact path="/admin/login" element={<LoginPage />} />
        <Route
          exact
          path="/admin/forgot-password"
          element={<ForgotPassword />}
        />
        <Route exact path="/admin/logout" element={<LogoutPage />} />
      </Route>

      {/* protected routes */}
      <Route element={<PrivateRoute />}>
        <Route exact path="/admin/dashboard" element={<Dashboard />} />
        <Route exact path="/admin/students" element={<Students />} />
        <Route exact path="/admin/centres" element={<Centres />} />
        <Route exact path="/admin/achievements" element={<Achievements />} />
        <Route path="/admin/createPost" element={<CreatePost />} />
        <Route path="/admin/createPost/:id" element={<CreatePost />} />
        <Route exact path="/admin/post/:id" element={<Post />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
