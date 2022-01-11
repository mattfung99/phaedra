import '../../stylesheets/publicpost.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { BlogPostList } from '../../models/blogpost';
import httpService from '../../services/httpService';
import { makeDateShort, makeTimeShort } from '../../utils/timezone';
import { toast } from 'react-toastify';

interface Props {
  data: BlogPostList;
}

const PublicPost = ({ data }: Props) => {
  let history = useHistory();
  const [blogPostImage, setBlogPostImageState] = useState<string>('');

  const handleOnClick = () => {
    history.push(`/blog/${data.id}`);
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
    getBlogPostImage(data.image_id);
  }, [data]);

  return (
    <React.Fragment>
      <Card border="secondary" className="public-post-spacing" onClick={handleOnClick}>
        <Card.Body className="public-post-body">
          <Container className="justify-content-md-center row">
            <Card.Img className="public-post-image img-thumbnail" variant="top" src={blogPostImage} />
          </Container>
          <Container>
            <Card.Title className="public-post-title">{data.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{'Written by '.concat(data.author)}</Card.Subtitle>
            <Card.Text>{data.preview}</Card.Text>
          </Container>
        </Card.Body>
        <Card.Footer className="text-muted public-post-footer">{'Updated '.concat(makeTimeShort(data.updated_at)).concat(', ').concat(makeDateShort(data.updated_at))}</Card.Footer>
      </Card>
    </React.Fragment>
  );
};

export default PublicPost;
