import React from 'react';

import useDashboard from '@pages/Dashboard/hook/useDashboard';
import AdminPanel from '@components/AdminPanel';
import BlogList from '@components/BlogPosts';
import PageLayout from '@components/Layout/PageLayout';
import NotificationBanner from '@components/NotificationBanner';

const Dashboard = () => {
  const { isLoading, blogsData, isAdmin, handleDelete } = useDashboard();

  return (
    <PageLayout isLoading={isLoading}>
      <NotificationBanner />
      <AdminPanel isAdmin={isAdmin} />
      <BlogList blogs={blogsData} handleDelete={handleDelete} />
    </PageLayout>
  );
};

export default Dashboard;
