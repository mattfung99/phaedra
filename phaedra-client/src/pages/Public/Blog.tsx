import '../../App.css';
import { useEffect, useState } from 'react';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import httpService from '../../services/httpService';
import { toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import { BlogPostList } from '../../models/blogpost';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import Pagination from '../../components/Shared/Pagination';
import PublicPost from '../../components/Public/PublicPost';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostList[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);
  const lastPostIndex: number = currentPage * postsPerPage;
  const firstPostIndex: number = lastPostIndex - postsPerPage;
  const currentPosts: BlogPostList[] = blogPosts.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.title = 'Blog';
  }, []);

  const getBlogPosts = async () => {
    const url = '/api/v1/blog-post';
    try {
      const response: any = await httpService.get(url);
      setBlogPosts(response.data);
    } catch (error) {
      toast.error('Error: Unable to retrieve posts');
    }
  };

  useEffect(() => {
    getBlogPosts();
  }, []);

  return (
    <CenteredContainer>
      <Header />
      <Container>
        <h1 className="text-center public-page-header">Blog</h1>
        {currentPosts.map((post: BlogPostList, index: number) => (
          <PublicPost key={index} data={post} />
        ))}
      </Container>
      <Pagination postsPerPage={postsPerPage} totalPosts={blogPosts.length} paginate={paginate} />
      <Footer />
    </CenteredContainer>
  );
};

export default Blog;
