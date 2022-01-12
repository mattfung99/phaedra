import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import httpService from '../../services/httpService';
import { toast } from 'react-toastify';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { Table } from 'react-bootstrap';
import AdminPost from '../../components/Admin/AdminPost';
import Pagination from '../../components/Shared/Pagination';
import ModalDeleteBlogPost from '../../components/Admin/ModalDeleteBlogPost';
import { BlogPostAdminList, deleteBlogPost } from '../../models/blogpost';
import { capitalize } from '../../utils/capitalizeString';

const ManagePosts = () => {
  let history = useHistory();
  const DEFAULT_INDEX: number = 0;
  const [posts, setPosts] = useState<BlogPostAdminList[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const [currentIndex, setCurrentIndex] = useState<number>(DEFAULT_INDEX);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Manage Posts';
  }, []);

  const getPosts = async () => {
    const url = '/api/v1/admin-blog-post';
    try {
      const response: any = await httpService.get(url);
      setPosts(response.data);
    } catch (error: any) {
      toast.error('Error: Unable to retrieve posts');
    }
  };

  const deletePost = async (blogPostId: number) => {
    const url = `/api/v1/admin-blog-post/${blogPostId}`;
    try {
      await httpService.del(url, { data: deleteBlogPost() });
    } catch (error: any) {
      toast.error('Error: '.concat(capitalize(error.response.data.error)));
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const onEditBlogPost = (event: any, blogPostId: number) => {
    event.stopPropagation();
    event.preventDefault();
    history.push(`/admin/edit/${blogPostId}`);
  };

  const onDeleteBlogPost = (event: any, blogPostId: number) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(blogPostId);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = async (blogPostId: number) => {
    try {
      const updatedBlogPosts: BlogPostAdminList[] = [...posts];
      const deletePostWithId = posts.findIndex((post: BlogPostAdminList) => post.id === blogPostId);
      await deletePost(blogPostId);
      updatedBlogPosts.splice(deletePostWithId, 1);
      setPosts(updatedBlogPosts);
      setDeleteModal(false);
    } catch (error: any) {
      toast.error('Error: Post cannot be deleted');
    }
  };

  return (
    <React.Fragment>
      <Sidebar />
      <CenteredContainer>
        <ModalDeleteBlogPost currBlogPost={currentIndex} show={deleteModal} onModalClose={onModalClose} onModalDelete={onModalDelete}></ModalDeleteBlogPost>
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
            <AdminPost key={index} data={post} onEditBlogPost={onEditBlogPost} onDeleteBlogPost={onDeleteBlogPost} />
          ))}
        </Table>
        <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
      </CenteredContainer>
    </React.Fragment>
  );
};

export default ManagePosts;
