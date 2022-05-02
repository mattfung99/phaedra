import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../stylesheets/newpost.css';
import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../services/httpService';
import Sidebar from '../../components/Admin/Sidebar';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { UserContext } from '../../hooks/UserContext';
import initialNewPost from '../../utils/json/initialNewPost.json';
import initialEditPost from '../../utils/json/initialEditPost.json';
import { capitalize } from '../../utils/capitalizeString';
import { BlogNewPost, BlogPostInput, modifyBlogPost, BlogPostId, AdminBlogPost } from '../../models/blogpost';
import { createConfigurationContentType, createFormData, deleteBlogPostImage } from '../../models/image';
import Error404 from '../Public/Error404';

const EditPost = () => {
  const ERROR_CODE: number = -1;
  let history = useHistory();
  const userContext = useContext(UserContext);
  const { blogID } = useParams<BlogPostId>();
  const [isFetched, setIsFetched] = useState<boolean>(true);
  const [uploadedImage, setUploadedImageState] = useState<string>('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [post, setPost] = useState<AdminBlogPost>(initialEditPost);
  const [values, setValue] = useState<BlogNewPost>(initialNewPost);
  const state = {
    configButton: 1
  };

  useEffect(() => {
    document.title = 'Edit Post';
  }, []);

  const validatePublishment = () => {
    if (uploadedImage.length < 1 && post.image_id === 1) {
      toast.error('Error: No image selected!');
      return true;
    }
    if (
      values.title === '' ||
      values.imageCaption === '' ||
      values.preview === '' ||
      !editorState.getCurrentContent().hasText() ||
      editorState.getCurrentContent().getPlainText().trim().length === 0
    ) {
      toast.error('Error: All fields must be filled in!');
      return true;
    }
    return false;
  };

  const getBlogPost = async () => {
    const url = `/api/v1/admin-blog-post/${blogID}`;
    try {
      const response: any = await httpService.get(url);
      setPost(response.data);
      setValue({
        title: response.data.title,
        imageCaption: response.data.image_caption,
        preview: response.data.preview
      });
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.content))));
    } catch (error) {
      setIsFetched(false);
    }
  };

  const editBlogPost = async (newBlogPost: BlogPostInput) => {
    const url = `/api/v1/admin-blog-post/${newBlogPost.is_draft ? 'draft' : 'publish'}/${post.id}`;
    try {
      await httpService.put(url, newBlogPost);
      toast.success(`Successfully edited a ${newBlogPost.is_draft ? 'draft' : 'published'} blog post!`);
    } catch (error: any) {
      const errorBody = error.response.data.errors[0];
      toast.error(capitalize(errorBody.param).concat(': ').concat(errorBody.msg));
    }
  };

  const createImage = async (formData: FormData, configureContentType: object): Promise<number> => {
    const url = '/api/v1/image';
    try {
      const response: any = await httpService.post(url, formData, configureContentType);
      return response.data.id;
    } catch (error: any) {
      toast.error('Error: '.concat(capitalize(error.response.data.error)));
      return ERROR_CODE;
    }
  };

  const deleteImage = async (imageId: number) => {
    const url = `/api/v1/image/${imageId}`;
    try {
      await httpService.del(url, { data: deleteBlogPostImage() });
    } catch (error: any) {
      toast.error('Error: '.concat(capitalize(error.response.data.error)));
    }
  };

  const handlePublish = async () => {
    if (validatePublishment()) return;
    if (uploadedImage.length < 1 && post.image_id !== 1) {
      await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 0, post.image_id, userContext.user?.id as number));
    } else {
      const imageToDeleteId: number = post.image_id;
      const imageId = await createImage(createFormData(uploadedImage), createConfigurationContentType());
      if (imageId !== ERROR_CODE) await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 0, imageId, userContext.user?.id as number));
      if (imageToDeleteId !== 1) await deleteImage(imageToDeleteId);
    }
    history.push('/admin/posts');
  };

  const handleSaveAsDraft = async () => {
    if (uploadedImage.length < 1) {
      if (post.image_id === 1) {
        await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 1, 1, userContext.user?.id as number));
      } else {
        await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 1, post.image_id, userContext.user?.id as number));
      }
    } else {
      if (post.image_id === 1) {
        const imageId = await createImage(createFormData(uploadedImage), createConfigurationContentType());
        await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 1, imageId, userContext.user?.id as number));
      } else {
        const imageToDeleteId: number = post.image_id;
        const imageId = await createImage(createFormData(uploadedImage), createConfigurationContentType());
        if (imageId !== ERROR_CODE) await editBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), 1, imageId, userContext.user?.id as number));
        await deleteImage(imageToDeleteId);
      }
    }
    history.push('/admin/posts');
  };

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleChange = (event: any) => {
    setValue({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    switch (state.configButton) {
      case 1:
        handlePublish();
        break;
      case 2:
        handleSaveAsDraft();
        break;
      default:
        toast.error('Error: State not set');
    }
  };

  const validateImageExtension = (event: any) => {
    setUploadedImageState(event.target.files[0]);
  };

  useEffect(() => {
    getBlogPost();
  }, []);

  return (
    <React.Fragment>
      {isFetched ? (
        <React.Fragment>
          <Sidebar />
          <CenteredContainer>
            <h1>Edit Post</h1>
            <Container>
              <Col xs>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="title" placeholder="Enter Title" maxLength={60} name="title" value={values.title} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Title Image</Form.Label>
                    <Form.Control accept="image/jpg, image/jpeg, image/png" type="file" name="image" id="image" onChange={validateImageExtension} size="sm" />
                    <Form.Text className="form-image-notifier">
                      {post.image_id === 1 ? 'No photo was previously uploaded in this draft' : `Previously uploaded ${post.filename.substring(post.filename.indexOf('_') + 1)}`}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Title Image Caption</Form.Label>
                    <Form.Control type="imageCaption" placeholder="Image Caption" maxLength={100} name="imageCaption" value={values.imageCaption} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Preview</Form.Label>
                    <Form.Control type="preview" placeholder="Preview" maxLength={100} name="preview" value={values.preview} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Content</Form.Label>
                    <Editor editorState={editorState} onEditorStateChange={handleEditorChange} wrapperClassName="wrapper-class" editorClassName="editor-class" toolbarClassName="toolbar-class" />
                  </Form.Group>
                  <Button className="float-end publish-button" variant="warning" type="submit" onClick={() => (state.configButton = 1)}>
                    Publish
                  </Button>
                  <Button className="float-end" variant="success" type="submit" onClick={() => (state.configButton = 2)}>
                    Save as Draft
                  </Button>
                </Form>
              </Col>
            </Container>
          </CenteredContainer>
        </React.Fragment>
      ) : (
        <Error404 />
      )}
    </React.Fragment>
  );
};

export default EditPost;
