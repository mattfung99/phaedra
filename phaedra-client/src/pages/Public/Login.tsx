import '../../App.css';
import { useState, useContext } from 'react';
import { Container, Form, Button, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';
import { toast } from 'react-toastify';
import authenticationService from '../../services/authenticationService';
import { UserCredentials } from '../../models/user';
import CenteredContainer from '../../components/Shared/CenteredContainer';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';

const Login = () => {
  let history = useHistory();
  let userContext = useContext(UserContext);
  const [values, setValue] = useState({
    username: '',
    password: ''
  });

  const attemptLogin = async (loginUser: UserCredentials) => {
    const data = await authenticationService.login(loginUser);
    const { isAuthenticated } = data;
    if (isAuthenticated) {
      userContext.setUser(data.user);
      userContext.setIsAuthenticated(data.isAuthenticated);
      history.push('/admin');
      toast.success(`Successfully logged in as ${data.user.username}!`);
    } else {
      toast.error('Invalid login credentials!');
    }
  };

  const handleChange = (evt: any) => {
    setValue({
      ...values,
      [evt.target.name]: evt.target.value
    });
  };

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    const user: UserCredentials = {
      username: values.username,
      password: values.password
    };
    attemptLogin(user);
  };

  return (
    <CenteredContainer>
      <Header />
      <Container className="public">
        <Col xs>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="Username" placeholder="Enter Username" name="username" value={values.username} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" value={values.password} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Log in
            </Button>
          </Form>
        </Col>
      </Container>
      <Footer />
    </CenteredContainer>
  );
};

export default Login;
