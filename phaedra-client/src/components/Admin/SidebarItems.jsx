import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

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
    title: 'Posts',
    path: '/admin/posts',
    icon: <IoIcons.IoIosPaper />,
    cName: 'side-text'
  }
];
