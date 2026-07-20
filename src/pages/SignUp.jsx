import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


import SignupImg from "../assets/Signup.svg"

import { api } from "../services/api";
import { radius } from "../layouts/theme/tokens"
import { responsibleSchema } from "../schemas/responsibleSchema";
import { useAuth } from "../contexts/hooks/useAuth";
import { toast } from 'sonner';

export default function Signup() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [campoAtivo, setCampoAtivo] = useState(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm({
        resolver: zodResolver(responsibleSchema),
        defaultValues: {
            responsavel_nome: "",
            responsavel_cpf: "",
            responsavel_data_nascimento: "",
            responsavel_siap: "",
            responsavel_matricula: "",
            email: "",
            senha: "",
            ativo: true
        }
    });
    const onSubmit = async (data) => {
        try {
            await api.post("/responsavel", data);
            try {
                await login(data.email, data.senha);
            } catch (loginError) {
                toast.error("Cadastro realizado, mas não foi possível entrar automaticamente.");
                return;
            }
            reset();
            navigate("/");
        } catch (error) {
            if (error.response?.status === 422) {
                const { detalhes, erro } = error.response.data;

                toast.error(erro);

                Object.entries(detalhes).forEach(([campo, mensagens]) => {
                    setError(campo, {
                        type: "server",
                        message: mensagens[0],
                    });
                });

                return;
            }

            toast.error("Ocorreu um erro inesperado.");
        }

    }

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Link
                        to="/"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            flexGrow: 1,
                        }}>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                            KeyControl
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    pt: 2,
                    pl: 2
                }}
            >
                <Typography
                    variant="subtitle1"
                >
                    Já possui uma conta?
                    <Button
                        component={Link}
                        to="/signin"
                        variant="text"
                        size="small"
                    >
                        Clique aqui
                    </Button>
                </Typography>
            </Box>
            <Grid
                container
                sx={{
                    flex: 1,
                }}
            >

                <Grid
                    size={7}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: `${radius.lg}px`,
                            padding: 4,
                            width: "90%",
                            maxWidth: 990,
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}

                    >
                        <Typography
                            variant="h4"
                            sx={{
                                textAlign: "center"
                            }}
                        >
                            Cadastre-se
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{
                                width: "100%",
                                maxWidth: 500,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                pt: 5
                            }}
                        >
                            <Controller
                                name="responsavel_nome"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome de usuário"
                                        error={!!errors.responsavel_nome}
                                        helperText={errors.responsavel_nome?.message}
                                        variant="outlined"
                                        fullWidth
                                        autoFocus
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                            <Controller
                                name="responsavel_cpf"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="CPF"
                                        error={!!errors.responsavel_cpf}
                                        helperText={errors.responsavel_cpf?.message}
                                        fullWidth
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 11);

                                            const cpfFormatado = value
                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

                                            field.onChange(cpfFormatado);
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="responsavel_data_nascimento"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Data de nascimento"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.responsavel_data_nascimento}
                                        helperText={errors.responsavel_data_nascimento?.message}
                                        fullWidth
                                    />
                                )}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    width: "100%",
                                    alignItems: "center"
                                }}
                            >
                                {(campoAtivo === null || campoAtivo === "siap") && (
                                    <Box
                                        sx={{
                                            flex: campoAtivo === "siap" ? 1 : 0.5,
                                            transition: "all 0.3s ease"
                                        }}
                                        onClick={() => setCampoAtivo("siap")}
                                    >
                                        <Controller
                                            name="responsavel_siap"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="SIAP"
                                                    error={!!errors.responsavel_siap}
                                                    helperText={errors.responsavel_siap?.message}
                                                    fullWidth
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 7);

                                                        field.onChange(value);
                                                        if (value === "") {
                                                            setCampoAtivo(null);
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                )}

                                {campoAtivo === null && (
                                    <Typography>Ou</Typography>
                                )}

                                {(campoAtivo === null || campoAtivo === "matricula") && (
                                    <Box
                                        sx={{
                                            flex: campoAtivo === "matricula" ? 1 : 0.5,
                                            transition: "all 0.3s ease"
                                        }}
                                        onClick={() => setCampoAtivo("matricula")}
                                    >
                                        <Controller
                                            name="responsavel_matricula"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Matrícula"
                                                    error={!!errors.responsavel_matricula}
                                                    helperText={errors.responsavel_matricula?.message}
                                                    fullWidth
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 12);

                                                        field.onChange(value);
                                                        if (value === "") {
                                                            setCampoAtivo(null);
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Controller
                                name="senha"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        label="Senha"
                                        variant="outlined"
                                        error={!!errors.senha}
                                        helperText={errors.senha?.message}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                Cadastrar
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    size={5}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Box
                        component="img"
                        src={SignupImg}
                        sx={{
                            maxHeight: "100%",
                            width: "auto"
                        }}
                    >
                    </Box>
                </Grid>
            </Grid>
        </Box >
    )
}