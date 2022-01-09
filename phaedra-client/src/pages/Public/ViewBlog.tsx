import '../../App.css';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import { Container } from 'react-bootstrap';
import { BlogPostId } from '../../models/blogpost';

const ViewBlog = () => {
  const { blogID } = useParams<BlogPostId>();

  useEffect(() => {
    document.title = 'Blog #'.concat(blogID);
  }, []);

  return (
    <div>
      <Header />
      <Container className="public">
        <h1>View Blog {blogID}</h1>
      </Container>
      <Footer />
    </div>
  );
};

export default ViewBlog;
