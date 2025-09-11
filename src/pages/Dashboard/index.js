import React from 'react';

import AdminPanel from '@components/AdminPanel';
import BlogList from '@components/BlogPosts';
import Layout from '@components/Layout/MainLayout';
import NotificationBanner from '@components/NotificationBanner';
import useDashboard from '@pages/Dashboard/hook/useDashboard';

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
