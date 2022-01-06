import '../../stylesheets/sidebar.css';
import { useState, useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarItems } from './SidebarItems';
import { IconContext } from 'react-icons';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { SideBar } from '../../models/sidebar';
import { currYear } from '../../utils/timezone';

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  let history = useHistory();
  const userContext = useContext(UserContext);
  const onClickLogoutHandler = async () => {
    await userContext.logout();
    toast.success('Successfully logged out!');
    history.push('/');
  };

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="sidebar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <h1 className="sidebar-title">{'Phaedra'}</h1>
        </div>
        <nav className={sidebar ? 'side-menu active' : 'side-menu'}>
          <ul className="side-menu-items" onClick={showSidebar}>
            <li className="sidebar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarItems.map((item: SideBar, index: number) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className="sidebar-span">{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <Container className="logout-button">
              <Button variant="outline-danger" onClick={onClickLogoutHandler}>
                Logout
              </Button>
            </Container>
            <Container className="copyright-label">
              <Row>
                <Col className="text-center py-3">Copyright &copy; Phaedra {currYear}</Col>
              </Row>
            </Container>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
