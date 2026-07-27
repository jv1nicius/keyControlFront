import { useEffect, useState } from "react";

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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditIcon from "@mui/icons-material/Edit"
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";

import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
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
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [formData, setFormData] = useState({
        responsavel_nome: "",
        email: "",
        responsavel_data_nascimento: "",
        senha: "",
        confirmarSenha: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                responsavel_nome: user.usuario,
                email: user.email,
                responsavel_data_nascimento: user.data_nascimento
                    ? new Date(user.data_nascimento).toISOString().split("T")[0]
                    : "",
                senha: "",
                confirmarSenha: "",
            });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (
            formData.senha &&
            formData.senha !== formData.confirmarSenha
        ) {
            alert("As senhas não coincidem.");
            return;
        }

        const payload = {};

        if (formData.responsavel_nome !== user.usuario) {
            payload.responsavel_nome = formData.responsavel_nome;
        }

        if (formData.email !== user.email) {
            payload.email = formData.email;
        }

        if (
            formData.responsavel_data_nascimento !==
            (
                user.data_nascimento
                    ? new Date(user.data_nascimento).toISOString().split("T")[0]
                    : ""
            )
        ) {
            payload.responsavel_data_nascimento =
                formData.responsavel_data_nascimento;
        }

        if (formData.senha.trim()) {
            payload.senha = formData.senha;
        }

        try {
            await api.put(
                `/responsavel/${user.user_id}`,
                payload
            );

            setEditing(false);
            setChangingPassword(false);

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    };

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

    const initial = user.usuario?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Paper elevation={2} sx={{ p: 4, borderRadius: '12px' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
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
                    {!editing &&
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setEditing(true)}
                        >
                            Editar
                        </Button>
                    }
                </Stack>

                <Divider sx={{ my: 3 }} />

                {editing &&
                    <Stack spacing={2}>
                        <TextField
                            label="Nome"
                            name="responsavel_nome"
                            value={formData.responsavel_nome}
                            onChange={handleChange}
                            disabled={!editing}
                            fullWidth
                        />

                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editing}
                            fullWidth
                        />

                        <TextField
                            label="Data de nascimento"
                            name="responsavel_data_nascimento"
                            type="date"
                            value={formData.responsavel_data_nascimento}
                            onChange={handleChange}
                            disabled={!editing}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        {!changingPassword && (
                            <Button
                                variant="outlined"
                                onClick={() => setChangingPassword(true)}
                            >
                                Alterar senha
                            </Button>
                        )}
                        {changingPassword && (
                            <>
                                <TextField
                                    label="Nova senha"
                                    name="senha"
                                    type="password"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <TextField
                                    label="Confirmar nova senha"
                                    name="confirmarSenha"
                                    type="password"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <Button
                                    size="small"
                                    onClick={() => {
                                        setChangingPassword(false);

                                        setFormData((prev) => ({
                                            ...prev,
                                            senha: "",
                                            confirmarSenha: "",
                                        }));
                                    }}
                                >
                                    Cancelar alteração de senha
                                </Button>
                            </>
                        )}
                    </Stack>
                }
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ mt: 3 }}
                >
                    {editing &&
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setEditing(false);

                                    setFormData({
                                        responsavel_nome: user.responsavel_nome,
                                        email: user.email,
                                        responsavel_data_nascimento:
                                            user.responsavel_data_nascimento,
                                        senha: "",
                                        confirmarSenha: "",
                                    });
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                            >
                                Salvar
                            </Button>
                        </>
                    }
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