import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';

import BaseLayout from './BaseLayout';

const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Reservas', path: '/reservas', icon: <EventIcon /> },
    { text: 'Retiradas', path: '/retiradas', icon: <AssignmentReturnIcon /> },
    { text: 'Histórico', path: '/historico', icon: <HistoryIcon /> },
];

export default function ResponsibleLayout() {
    return <BaseLayout menuItems={menuItems} enableSearch />;
}