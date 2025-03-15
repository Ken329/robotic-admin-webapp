import React from "react";
import Layout from "../../components/Layout/MainLayout";
import BlogList from "../../components/BlogPosts";
import NotificationBanner from "../../components/NotificationBanner";
import AdminPanel from "../../components/AdminPanel";
import useDashboard from "./hook/useDashboard";

const Dashboard = () => {
  const { isLoading, blogsData, isAdmin, handleDelete } = useDashboard();

  return (
    <Layout isLoading={isLoading}>
      <NotificationBanner />
      <AdminPanel isAdmin={isAdmin} />
      <BlogList blogs={blogsData} handleDelete={handleDelete} />
    </Layout>
  );
};

export default Dashboard;
