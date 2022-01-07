import { useEffect, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import httpService from '../../services/httpService';
import { toast } from 'react-toastify';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { Table } from 'react-bootstrap';
import AdminPost from '../../components/Admin/AdminPost';
import Pagination from '../../components/Shared/Pagination';
import { BlogPostAdminList } from '../../models/blogpost';

const ManagePosts = () => {
  const [posts, setPosts] = useState<BlogPostAdminList[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.title = 'Manage Posts';
  }, []);

  const getPosts = async () => {
    const url = '/api/v1/admin-blog-post';
    try {
      const response: any = await httpService.get(url);
      setPosts(response.data);
    } catch (error) {
      toast.error('Error: Unable to retrieve posts');
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Sidebar />
      <CenteredContainer>
        <h1>Manage Posts</h1>
        <Table responsive variant="light">
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Preview</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {currentPosts.map((post: BlogPostAdminList, index: number) => (
            <AdminPost key={index} data={post} />
          ))}
        </Table>
        <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
      </CenteredContainer>
    </div>
  );
};

export default ManagePosts;
