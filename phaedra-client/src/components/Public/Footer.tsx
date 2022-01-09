import { Container, Row, Col } from 'react-bootstrap';
import { currYear } from '../../utils/timezone';

const Footer = () => {
  return (
    // <footer className="fixed-bottom">
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
