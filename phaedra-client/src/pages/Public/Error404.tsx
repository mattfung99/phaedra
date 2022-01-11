import '../../App.css';
import { Container } from 'react-bootstrap';

const Error404 = () => {
  return (
    <Container className="error-404 text-center">
      <h1>404: Page not found</h1>
      <a href="/">Click here to return</a>
    </Container>
  );
};

export default Error404;
