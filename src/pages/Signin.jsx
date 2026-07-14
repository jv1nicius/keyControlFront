import { useState } from "react";

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from '../schemas/signinSchema'
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../contexts/hooks/useAuth"

import LoginImg from "../assets/Login-cuate.svg"
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
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column"
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
                            padding: 4,
                            width: "90%",
                            height: "90%",
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
                                gap: 3,
                                pt: 5
                            }}
                        >
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