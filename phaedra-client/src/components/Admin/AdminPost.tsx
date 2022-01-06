import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { BlogPostAdminList } from '../../models/blogpost';
import '../../stylesheets/manageposts.css';
import { makeDateShort } from '../../utils/timezone';

interface Props {
  data: BlogPostAdminList;
}

const AdminPost = ({ data }: Props) => {
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
            <Button variant="outline-primary" type="button">
              Edit
            </Button>
            <Button className="post-button-margin" variant="outline-danger" type="button">
              Delete
            </Button>
          </td>
        </tr>
      </tbody>
    </React.Fragment>
  );
};

export default AdminPost;
