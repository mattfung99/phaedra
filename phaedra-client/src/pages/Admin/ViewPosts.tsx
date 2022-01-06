import { useEffect } from 'react';
import Sidebar from '../../components/Admin/Sidebar';

const ViewPosts = () => {
  useEffect(() => {
    document.title = 'Posts';
  }, []);

  return (
    <div>
      <Sidebar />
      <h1>View Posts</h1>
    </div>
  );
};

export default ViewPosts;
