import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import BaseLayout from './BaseLayout';

const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Reservas', path: '/reservas', icon: <EventIcon /> },
    { text: 'Retiradas', path: '/retiradas', icon: <AssignmentReturnIcon /> },
    { text: 'Salas', path: '/salas', icon: <MeetingRoomIcon /> },
    { text: 'Chaves', path: '/chaves', icon: <VpnKeyIcon /> },
    { text: 'Responsáveis', path: '/responsaveis', icon: <PeopleIcon /> },
    { text: 'Histórico', path: '/historico', icon: <HistoryIcon /> },
];

export default function AdminLayout() {
    return <BaseLayout menuItems={menuItems} enableSearch />;
}