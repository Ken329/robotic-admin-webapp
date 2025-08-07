import React from 'react';

import useDashboard from './hook/useDashboard';
import AdminPanel from '../../components/AdminPanel';
import BlogList from '../../components/BlogPosts';
import Layout from '../../components/Layout/MainLayout';
import NotificationBanner from '../../components/NotificationBanner';

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
