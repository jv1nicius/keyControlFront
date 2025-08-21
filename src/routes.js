import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdCoPresent, MdSchool, MdCalendarMonth } from 'react-icons/md';
// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import DataTables from 'views/admin/dataTables';


const routes = [
  {
    name: 'Home',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdSchool} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Professores',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdCoPresent}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Reservas',
    layout: '/admin',
    icon: <Icon as={MdCalendarMonth} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
  }
];

export default routes;
