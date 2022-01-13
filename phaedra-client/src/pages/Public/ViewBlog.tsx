import '../../App.css';
import '../../stylesheets/viewpost.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import httpService from '../../services/httpService';
import { toast } from 'react-toastify';
import { Container, Card } from 'react-bootstrap';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { BlogPostId, BlogPost } from '../../models/blogpost';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import initialViewPost from '../../utils/json/initialViewPost.json';
import { makeDateShort, makeTimeShort } from '../../utils/timezone';
import Error404 from './Error404';

const ViewBlog = () => {
  const { blogID } = useParams<BlogPostId>();
  const [isFetched, setIsFetched] = useState<boolean>(true);
  const [blogPost, setBlogPost] = useState<BlogPost>(initialViewPost);
  const [blogPostImage, setBlogPostImageState] = useState<string>('');
  const [editorState, setEditorState] = useState<any>(() => EditorState.createEmpty());

  useEffect(() => {
    document.title = isFetched ? blogPost.title : '404: Page not found';
  }, [isFetched, blogPost]);

  const getBlogPost = async () => {
    const url = `/api/v1/blog-post/${blogID}`;
    try {
      const response: any = await httpService.get(url);
      setBlogPost(response.data);
      getBlogPostImage(response.data.image_id);
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.content))));
    } catch (error) {
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

  const onChangeHandler = () => {};

  return (
    <React.Fragment>
      {isFetched ? (
        <CenteredContainer>
          <Header />
          <Card border="secondary" className="view-post-body">
            <Card.Body>
              <Card.Title className="text-center view-post-title">{blogPost.title}</Card.Title>
              <Card.Text className="text-center view-post-preview">{blogPost.preview}</Card.Text>
              <Card.Subtitle className="text-muted view-post-author">
                {blogPost.author.concat(' | ').concat('Updated ').concat(makeTimeShort(blogPost.updated_at)).concat(', ').concat(makeDateShort(blogPost.updated_at))}
              </Card.Subtitle>
              <Container className="justify-content-md-center row view-post-container">
                <Card.Img className="view-post-image" variant="top" src={blogPostImage} />
                <Card.Text className="text-center text-muted view-post-image-caption">{blogPost.image_caption}</Card.Text>
              </Container>
              <Card.Text>
                <Editor toolbarHidden editorState={editorState} readOnly={true} onChange={onChangeHandler}></Editor>
              </Card.Text>
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
