import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../stylesheets/newpost.css';
import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import httpService from '../../services/httpService';
import Sidebar from '../../components/Admin/Sidebar';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { BlogNewPost, BlogPostInput, modifyBlogPost } from '../../models/blogpost';
import { UserContext } from '../../hooks/UserContext';
import initialNewPost from '../../utils/json/initialNewPost.json';
import { capitalize } from '../../utils/capitalizeString';
import { createConfigurationContentType, createFormData } from '../../models/image';

const NewPost = () => {
  const userContext = useContext(UserContext);
  const [uploadedImage, setUploadedImageState] = useState<string>('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [values, setValue] = useState<BlogNewPost>(initialNewPost);
  const state = {
    configButton: 1
  };

  useEffect(() => {
    document.title = 'New Post';
  }, []);

  const validatePublishment = () => {
    if (uploadedImage.length < 1) {
      toast.error('Error: No image selected!');
      return true;
    }
    if (values.title === '' || values.imageCaption === '' || values.preview === '') {
      toast.error('Error: All fields must be filled in!');
      return true;
    }
    return false;
  };

  const createBlogPost = (newBlogPost: BlogPostInput) => {
    console.log(newBlogPost);
  };

  const createImage = async (formData: FormData, configureContentType: object): Promise<number> => {
    const url = '/api/v1/image';
    try {
      const response: any = await httpService.post(url, formData, configureContentType);
      return response.data.id;
    } catch (error: any) {
      toast.error('Error: '.concat(capitalize(error.response.data.error)));
      return -1;
    }
  };

  const handlePublish = async () => {
    if (validatePublishment()) return;
    const imageId = await createImage(createFormData(uploadedImage), createConfigurationContentType());
    createBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), false, imageId, userContext.user?.id as number));
  };

  const handleSaveAsDraft = async () => {
    if (uploadedImage.length < 1) {
      createBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), true, -1, userContext.user?.id as number));
    } else {
      const imageId = await createImage(createFormData(uploadedImage), createConfigurationContentType());
      createBlogPost(modifyBlogPost(values, JSON.stringify(convertToRaw(editorState.getCurrentContent())), true, imageId, userContext.user?.id as number));
    }
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

  return (
    <div>
      <Sidebar />
      <CenteredContainer>
        <h1>New Post</h1>
        <Container>
          <Col xs>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Post Title</Form.Label>
                <Form.Control type="title" placeholder="Enter Title" name="title" value={values.title} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Post Title Image</Form.Label>
                <Form.Control accept="image/jpg, image/jpeg, image/png" type="file" name="image" id="image" onChange={validateImageExtension} size="sm" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Post Title Image Caption</Form.Label>
                <Form.Control type="imageCaption" placeholder="Image Caption" name="imageCaption" value={values.imageCaption} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Post Preview</Form.Label>
                <Form.Control type="preview" placeholder="Preview" name="preview" value={values.preview} onChange={handleChange} />
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
    </div>
  );
};

export default NewPost;
