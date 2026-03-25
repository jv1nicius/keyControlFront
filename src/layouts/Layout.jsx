import * as React from 'react';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import { Outlet, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const menuItems = [
    { text: "Home", path: "/" },
    { text: "Retiradas", path: "/keycheckout" }
];
const bottomMenuItems = [
    { text: "Configurações", path: "/settings", icon: <SettingsIcon /> }
];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            display: 'flex',
            flexDirection: 'column',
        },
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function SideBar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const [hora, setHora] = React.useState(new Date())

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        const intervalo = setInterval(() => {
            setHora(new Date());
        }, 60000); // atualiza a cada 1s

        return () => clearInterval(intervalo); // limpa o intervalo
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    {!open && (
                        <Typography
                            variant='h6'
                            sx={{ marginRight: 5 }}
                        >
                            KeyControl
                        </Typography>
                    )}

                    <Breadcrumbs

                        aria-label="breadcrumb"
                        sx={{ color: 'white' }}
                    >
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>

                        </Link>

                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            const isLast = index === pathnames.length - 1;

                            return isLast ? (
                                <Typography key={to} color="inherit">
                                    {value}
                                </Typography>
                            ) : (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    {value}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>

                    <Typography>
                        {hora.toLocaleDateString("pt-BR", { weekday: "long" })} - {hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                    <IconButton
                        component={Link}
                        to="/profile"
                        size="large"
                        color="inherit"
                        sx={{ 
                            marginLeft: 'auto',
                            transition: "0.2s",
                            "&:hover": {
                                boxShadow: 5
                            }
                         }}
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader
                    sx={{
                        justifyContent: open ? 'space-between' : 'center',
                        px: 2
                    }}
                >
                    {open && (
                        <Typography variant='h6' noWrap>
                            KeyControl
                        </Typography>
                    )}
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {
                        menuItems.map((item, index) => (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        minHeight: 48,
                                        px: 2.5,
                                        justifyContent: open ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: 'center',
                                            mr: open ? 3 : 'auto',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>

                <Box sx={{ flexGrow: 1 }} />
                <Divider />
                <List>
                    {bottomMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                sx={{
                                    minHeight: 48,
                                    px: 2.5,
                                    justifyContent: open ? 'initial' : 'center',
                                }}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: 'center',
                                        mr: open ? 3 : 'auto',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}