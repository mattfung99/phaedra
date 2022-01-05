import '../../App.css';
import React from 'react';
import Header from '../../components/Public/Header';
import Footer from '../../components/Public/Footer';
import { Container } from 'react-bootstrap';

const Contact = () => {
  return (
    <div>
      <Header />
      <Container className="public">
        <h1 style={{ marginTop: '2em' }}>Contact</h1>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
