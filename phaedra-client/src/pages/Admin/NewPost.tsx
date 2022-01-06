import { useEffect } from 'react';
import Sidebar from '../../components/Admin/Sidebar';

const NewPost = () => {
  useEffect(() => {
    document.title = 'New Post';
  }, []);

  return (
    <div>
      <Sidebar />
      <h1>New Post</h1>
    </div>
  );
};

export default NewPost;
