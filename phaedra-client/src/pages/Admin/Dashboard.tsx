import { useEffect } from 'react';
import Sidebar from '../../components/Admin/Sidebar';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <div>
      <Sidebar />
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
