import { useState } from 'react'

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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

import { Outlet, Link, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

import { useColorMode } from './theme/AppThemeProvider';

const drawerWidth = 240;

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

function MenuSection({ items, open, currentPath }) {
    return (
        <List>
            {items.map((item) => {
                const selected =
                    currentPath === item.path ||
                    currentPath.startsWith(item.path + '/');

                return (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={selected}
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
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    );
}

export default function BaseLayout({ menuItems, sectionLabel, enableSearch = false }) {
    const theme = useTheme();
    const { mode, toggleColorMode } = useColorMode();
    const [open, setOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1));;

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const canSearch = enableSearch && (
        location.pathname === '/salas' ||
        location.pathname === '/responsaveis'
    );

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
                        sx={[{ marginRight: 5 }, open && { display: 'none' }]}
                    >
                        <MenuIcon />
                    </IconButton>

                    {!open && (
                        <Typography variant="h6" sx={{ marginRight: 5 }}>
                            KeyControl
                        </Typography>
                    )}

                    <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'inherit' }}>
                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            const isLast = index === pathnames.length - 1;

                            return isLast ? (
                                <Typography key={to} color="inherit">
                                    {value}
                                </Typography>
                            ) : (
                                <Link key={to} to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {value}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                    {canSearch && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                ml: 'auto'
                            }}
                        >
                            {searchOpen && (
                                <TextField
                                    size="small"
                                    placeholder="Pesquisar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{ width: 250 }}
                                />
                            )}

                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    setSearchOpen((prev) => !prev);
                                    if (searchOpen) {
                                        setSearch('');
                                    }
                                }}
                                sx={{ marginLeft: 'auto' }}
                            >
                                {searchOpen ? <CloseIcon /> : <SearchIcon />}
                            </IconButton>
                        </Box>
                    )}
                    <IconButton
                        onClick={toggleColorMode}
                        size="large"
                        color="inherit"
                        aria-label="alternar tema claro/escuro"
                        sx={{ marginLeft: canSearch ? 0 : 'auto' }}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    <IconButton
                        component={Link}
                        to="/profile"
                        size="large"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{ justifyContent: open ? 'space-between' : 'center', px: 2 }}>
                    {open && (
                        <Typography variant="h6" noWrap>
                            KeyControl
                        </Typography>
                    )}
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <MenuSection items={menuItems} open={open} currentPath={location.pathname} />

                {sectionLabel && open && (
                    <Typography variant="overline" color='text.secondary' sx={{ px: 2 }}>
                        {sectionLabel}
                    </Typography>
                )}

                <Box sx={{ flexGrow: 1 }} />
                <Divider />
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet context={{ search }} />
            </Box>
        </Box>
    );
}