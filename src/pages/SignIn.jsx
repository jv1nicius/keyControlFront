import { useState } from "react";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom"

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"

import TextField from "@mui/material/TextField"
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography"

import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

import LoginImg from "../assets/Login-cuate.svg"

import { signinSchema } from '../schemas/signinSchema'
import { useAuth } from "../contexts/hooks/useAuth"
import { radius } from "../layouts/theme/tokens"
import { toast } from 'sonner'

export default function Signin() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            senha: ""
        }
    })

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.senha);
            reset();
            navigate("/");
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
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


            <Grid container sx={{ flex: 1, }}>
                <Grid
                    size={5}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Box
                        component="img"
                        src={LoginImg}
                        sx={{
                            maxHeight: "100%",
                            width: "auto"
                        }}
                    >

                    </Box>
                </Grid>
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
                            border: '1px solid',
                            borderColor: "divider",
                            borderRadius: `${radius.lg}px`,
                            width: "100%",
                            maxWidth: 990,
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                        <Box
                            component='form'
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{
                                width: "100%",
                                maxWidth: 500,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.5,
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    padding: 2,
                                    textAlign: "center"
                                }}
                            >
                                Bem-Vindo
                            </Typography>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email de usuário"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        variant="outlined"
                                        fullWidth
                                        autoFocus
                                    />
                                )}
                            />
                            <Controller
                                name="senha"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Senha"
                                        error={!!errors.senha}
                                        helperText={errors.senha?.message}
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"}
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
                                sx={{ mt: 2 }}
                                disabled={isSubmitting}
                            >
                                Entrar
                            </Button>
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            pt={2}
                        >
                            <Typography variant="subtitle2">
                                Novo aqui?
                            </Typography>

                            <Button
                                component={Link}
                                to="/signup"
                                variant="text"
                                size="small"
                            >
                                Cadastre-se
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}