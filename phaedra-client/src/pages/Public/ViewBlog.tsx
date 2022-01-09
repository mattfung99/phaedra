import '../../App.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import httpService from '../../services/httpService';
import { toast } from 'react-toastify';
import { Container, Card } from 'react-bootstrap';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { BlogPostId, BlogPost } from '../../models/blogpost';
import initialViewPost from '../../utils/json/initialViewPost.json';

const ViewBlog = () => {
  const { blogID } = useParams<BlogPostId>();
  const [blogPost, setBlogPost] = useState<BlogPost>(initialViewPost);

  useEffect(() => {
    document.title = 'Blog #'.concat(blogID);
  }, []);

  const getBlogPost = async () => {
    const url = `/api/v1/blog-post/${blogID}`;
    try {
      const response: any = await httpService.get(url);
      setBlogPost(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error('Error: Unable to retrieve posts');
    }
  };

  useEffect(() => {
    getBlogPost();
  }, []);

  return (
    <CenteredContainer>
      <Header />
      <Container>
        <h1 className="text-center">View Blog {blogID}</h1>
        <React.Fragment>
          <Card border="secondary"></Card>
        </React.Fragment>
      </Container>
      <Footer />
    </CenteredContainer>
  );
};

export default ViewBlog;
