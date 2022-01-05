import React, { useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

const Account = () => {
  console.log('hit');
  let history = useHistory();
  const userContext = useContext(UserContext);
  const onClickLogoutHandler = async () => {
    await userContext.logout();
    toast.success('Successfully logged out!');
    history.push('/');
  };

  return (
    <div>
      <h1 style={{ marginTop: '2em' }}>Account Here</h1>
      <Button variant="outline-danger" onClick={onClickLogoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default Account;
