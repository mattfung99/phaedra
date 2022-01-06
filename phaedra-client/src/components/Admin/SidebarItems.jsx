import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as IoIcons5 from 'react-icons/io5';

export const SidebarItems = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: <AiIcons.AiFillHome />,
    cName: 'side-text'
  },
  {
    title: 'My Account',
    path: '/admin/account',
    icon: <MdIcons.MdOutlineAccountCircle />,
    cName: 'side-text'
  },
  {
    title: 'New Post',
    path: '/admin/new',
    icon: <IoIcons5.IoCreateOutline />,
    cName: 'side-text'
  },
  {
    title: 'Manage Posts',
    path: '/admin/posts',
    icon: <IoIcons.IoIosPaper />,
    cName: 'side-text'
  }
];
