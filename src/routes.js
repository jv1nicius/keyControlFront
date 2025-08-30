import React from 'react';
import { Icon, layout } from '@chakra-ui/react';
import { MdCoPresent, MdSchool, MdCalendarMonth, MdOutlineHome } from 'react-icons/md';
// Admin Imports

import Home from 'views/admin/home';
import ReservaPage from 'views/admin/reservar';
import ProfessoresPage from 'views/admin/professores';
import HistoricoPage from 'views/admin/historico';


const routes = [
  {
    name:'Home',
    layout: '/admin',
    path: '/home',
    icon: <Icon as={MdOutlineHome} width="20px" height="20px" color="inherit" />,
    component: <Home />,
  },
  {
    name: 'Reservar',
    layout: '/admin',
    path: '/reservar',
    icon: <Icon as={MdSchool} width="20px" height="20px" color="inherit" />,
    component: <ReservaPage />,
  },
  {
    name: 'Professores',
    layout: '/admin',
    path: '/professores',
    icon: <Icon as={MdCoPresent} width="20px" height="20px" color="inherit" />,
    component: <ProfessoresPage />,
    secondary: true,
  },
  {
    name: 'Histórico',
    layout: '/admin',
    path: '/historico',
    icon: <Icon as={MdCalendarMonth} width="20px" height="20px" color="inherit" />,
    component: <HistoricoPage />,
  }
];

export default routes;
