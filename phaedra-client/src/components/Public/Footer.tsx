import { Container, Row, Col } from 'react-bootstrap';
import { currYear } from '../../Utils/timezone';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; Phaedra {currYear}</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
