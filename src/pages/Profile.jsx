import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/hooks/useAuth";

const ROLE_INFO = {
    admin: {
        label: "Administrador",
        color: "secondary",
        icon: <AdminPanelSettingsIcon fontSize="small" />,
    },
    responsavel: {
        label: "Responsável",
        color: "primary",
        icon: <AssignmentIndIcon fontSize="small" />,
    },
};

export default function Profile() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const goBack = () => navigate(-1)

    const handleLogout = () => {
        setConfirmOpen(false)
        logout()
        navigate("/")
    }

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Typography color="text.secondary">
                    Carregando dados do usuário...
                </Typography>
            </Container>
        );
    }

    const role = ROLE_INFO[user.funcao] ?? {
        label: user.funcao,
        color: "default",
        icon: undefined,
    }

    const initial = user.usuario?.charAt(0)?.toUpperCase() ?? "?"

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Paper elevation={2} sx={{ p: 4, borderRadius: '12px' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "primary.main",
                            fontSize: 28
                        }}
                    >
                        {initial}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {user.usuario}
                        </Typography>
                        <Chip
                            size="small"
                            icon={role.icon}
                            label={role.label}
                            color={role.color}
                            sx={{ mt: 0.5 }}
                        />
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Stack>
            </Paper>

            <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => setConfirmOpen(true)}
                sx={{ mt: 3 }}
            >
                Sair
            </Button>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Sair da conta?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você precisará entrar novamente para acessar sua conta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button color="error" onClick={handleLogout}>
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}