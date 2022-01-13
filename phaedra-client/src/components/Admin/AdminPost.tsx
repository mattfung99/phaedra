import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { BlogPostAdminList } from '../../models/blogpost';
import '../../stylesheets/manageposts.css';
import { makeDateShort } from '../../utils/timezone';

interface Props {
  data: BlogPostAdminList;
  onEditBlogPost: any;
  onDeleteBlogPost: any;
}

const AdminPost = ({ data, onEditBlogPost, onDeleteBlogPost }: Props) => {
  return (
    <React.Fragment>
      <tbody>
        <tr>
          <td>{data.is_draft ? <Badge bg="warning">{'Draft'}</Badge> : <Badge bg="success">{'Published'}</Badge>}</td>
          <td>
            <strong>{data.title}</strong>
          </td>
          <td>{data.preview}</td>
          <td>{data.author}</td>
          <td>{makeDateShort(data.updated_at)}</td>
          <td>
            <Button
              variant="outline-primary"
              type="button"
              onClick={(event: any) => {
                onEditBlogPost(event, data.id);
              }}
            >
              Edit
            </Button>
            <Button
              className="post-button-margin"
              variant="outline-danger"
              type="button"
              onClick={(event: any) => {
                onDeleteBlogPost(event, data.id);
              }}
            >
              Delete
            </Button>
          </td>
        </tr>
      </tbody>
    </React.Fragment>
  );
};

export default AdminPost;
