import { useEffect, useState } from 'react';

import { useGetPostByIdQuery } from '../../../redux/slices/posts/api';

const useGetPost = id => {
  const { data, isLoading, isError } = useGetPostByIdQuery(id);
  const [blog, setBlog] = useState(null);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setBlog(data.data);

      let content = data.data.content || '';
      const remarkMatch = content.match(/\{remark:\s*([^}]+)\}/);

      if (remarkMatch) {
        setRemark(remarkMatch[1]);
        content = content.replace(remarkMatch[0], '');
        setBlog(prevBlog => ({
          ...prevBlog,
          content: content
        }));
      }
    }
  }, [data, isLoading, isError]);

  return { blog, isLoading, isError, remark };
};

export default useGetPost;
