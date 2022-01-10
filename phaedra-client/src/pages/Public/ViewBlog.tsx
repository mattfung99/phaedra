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
import Error404 from './Error404';

const ViewBlog = () => {
  const { blogID } = useParams<BlogPostId>();
  const [isFetched, setIsFetched] = useState<boolean>(true);
  const [blogPost, setBlogPost] = useState<BlogPost>(initialViewPost);
  const [blogPostImage, setBlogPostImageState] = useState<string>('');

  useEffect(() => {
    document.title = isFetched ? 'Blog #'.concat(blogID) : '404: Page not found';
  }, [isFetched]);

  const getBlogPost = async () => {
    const url = `/api/v1/blog-post/${blogID}`;
    try {
      const response: any = await httpService.get(url);
      setBlogPost(response.data);
      console.log(response.data);
    } catch (error) {
      // toast.error('Error: Unable to retrieve posts');
      setIsFetched(false);
    }
  };

  const getBlogPostImage = async (imageId: number) => {
    const url = `/api/v1/image/${imageId}`;
    try {
      await httpService
        .get(url, {
          responseType: 'blob'
        })
        .then((response: any) => {
          setBlogPostImageState(URL.createObjectURL(response.data));
        });
    } catch (error: any) {
      toast.error('Error: Unable to fetch from ' + url);
    }
  };

  useEffect(() => {
    getBlogPost();
  }, []);

  return (
    <React.Fragment>
      {isFetched ? (
        <CenteredContainer>
          <Header />
          <Card border="secondary">
            <Card.Body>
              <Container className="justify-content-md-center row">{/* <Card.Img className="public-post-image img-thumbnail" variant="top" src={blogPostImage} /> */}</Container>
              <Container>
                <Card.Title>{blogPost.title}</Card.Title>
                <Card.Subtitle>{'Written by '.concat(blogPost.author)}</Card.Subtitle>
                <Card.Text>{blogPost.preview}</Card.Text>
              </Container>
            </Card.Body>
          </Card>
          <Footer />
        </CenteredContainer>
      ) : (
        <Error404 />
      )}
    </React.Fragment>
  );
};

export default ViewBlog;
