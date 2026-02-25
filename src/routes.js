import React from 'react';
import { Icon, layout } from '@chakra-ui/react';
import { MdCoPresent, MdSchool, MdCalendarMonth, MdOutlineHome, MdMeetingRoom, MdKey } from 'react-icons/md';
// Admin Imports

import Home from 'views/admin/home';
import ReservaPage from 'views/admin/reservar';
import ResponsaveisPage from 'views/admin/responsavel';
import RetiradasPage from 'views/admin/retiradas';
import SalasPage from 'views/admin/salas';
import HistoricoPage from 'views/admin/historico';


const routes = [
    {
        name: 'Home',
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
        name: 'Retiradas',
        layout: '/admin',
        path: '/retiradas',
        icon: <Icon as={MdKey} width="20px" height="20px" color="inherit" />,
        component: <RetiradasPage />,
    },
    {
        name: 'Salas',
        layout: '/admin',
        path: '/salas',
        icon: <Icon as={MdMeetingRoom} width="20px" height="20px" color="inherit" />,
        component: <SalasPage />,
    },
    {
        name: 'Responsáveis',
        layout: '/admin',
        path: '/responsaveis',
        icon: <Icon as={MdCoPresent} width="20px" height="20px" color="inherit" />,
        component: <ResponsaveisPage />,
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
