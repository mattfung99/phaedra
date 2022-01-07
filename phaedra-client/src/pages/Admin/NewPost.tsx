import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../stylesheets/newpost.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Admin/Sidebar';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const NewPost = () => {
  const [uploadedFile, setUploadedFileState] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const state = {
    configButton: 1
  };

  useEffect(() => {
    document.title = 'New Post';
  }, []);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const [values, setValue] = useState({
    title: '',
    imageCaption: '',
    preview: ''
  });

  const handleChange = (evt: any) => {
    setValue({
      ...values,
      [evt.target.name]: evt.target.value
    });
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    switch (state.configButton) {
      case 1:
        console.log('publish');
        break;
      case 2:
        console.log('save as draft');
        break;
      default:
        toast.error('Error: State not set');
    }
    const post = {
      title: values.title,
      imageCaption: values.imageCaption,
      preview: values.preview,
      content: JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    };
    console.log(post);
  };

  const validateFileExtension = (evt: any) => {
    setUploadedFileState(evt.target.files[0]);
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
                <Form.Control type="file" name="image" id="image" onChange={validateFileExtension} size="sm" />
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
