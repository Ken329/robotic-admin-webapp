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
        <Route index element={<IndexPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/logout" element={<LogoutPage />} />
      </Route>

      {/* protected routes */}
      <Route element={<PrivateRoute />}>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/students" element={<Students />} />
        <Route exact path="/centres" element={<Centres />} />
        <Route exact path="/achievements" element={<Achievements />} />
        <Route exact path="/createPost" element={<CreatePost />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
