import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" className="justify-content-center">
        <Container>
          {/* <Navbar.Brand>Phaedra</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="m-auto text-center">
              <Nav.Link as={Link} to={'/'}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to={'/about'}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to={'/blog'}>
                Blog
              </Nav.Link>
              <Nav.Link as={Link} to={'/contact'}>
                Contact
              </Nav.Link>
              <Nav.Link as={Link} to={'/login'}>
                Login
              </Nav.Link>
            </Nav>
            {/* <Nav className="float-right">
              <NavDropdown title={userContext.user?.username} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to={'/user-info'}>
                  User Information
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} onClick={onClickLogOutHandler}>
                Sign Out
              </Nav.Link>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
