import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";

import SignupImg from "../assets/Signup.svg"

export default function Signup() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            usuario_nome: "",
            email: "",
            funcao: "",
            senha: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            console.log(result);
            login(result.access_token);
            reset();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column"
            }}
        >
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
                        bgcolor: "#",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "#d4d4d4",
                            borderRadius: 4,
                            padding: 4,
                            width: "90%",
                            height: "90%",
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
                                name="usuario_nome"
                                control={control}
                                rules={{ required: "Digite seu nome" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome de usuário"
                                        error={!!errors.usuario_nome}
                                        helperText={errors.usuario_nome?.message}
                                        variant="outlined"
                                        fullWidth
                                        autoFocus
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: "Digite seu email" }}
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
                                name="funcao"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Função"
                                        variant="outlined"
                                        fullWidth
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
                                        variant="outlined"
                                        fullWidth
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
        </Box>
    )
}