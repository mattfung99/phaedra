import { useEffect } from 'react';
import Sidebar from '../../components/Admin/Sidebar';

const Account = () => {
  useEffect(() => {
    document.title = 'Account';
  }, []);

  return (
    <div>
      <Sidebar />
      <h1>Account Here</h1>
    </div>
  );
};

export default Account;
