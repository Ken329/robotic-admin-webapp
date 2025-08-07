import { useMemo, useState } from 'react';

const useBlogFilter = blogs => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const sortedBlogs = useMemo(() => {
    const sorted = [...filteredBlogs];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'mostViewed':
        return sorted.sort((a, b) => b.views - a.views);
      default:
        return sorted;
    }
  }, [filteredBlogs, sortBy]);

  return {
    selectedCategory,
    searchQuery,
    sortBy,
    sortedBlogs,
    setSelectedCategory,
    setSearchQuery,
    setSortBy
  };
};

export default useBlogFilter;
