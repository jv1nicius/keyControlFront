import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';

import { Link } from "react-router-dom";


export default function Home() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                            KeyControl
                        </Typography>
                        <Button variant="contained" component={Link} to="/signin">
                            Entrar
                        </Button>
                        <Button component={Link} to="/signup">
                            Cadastrar
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Container maxWidth={'auto'} >
                <Box
                    sx={{
                        alignItems: "end",
                        display: "flex",
                        minHeight: "45vh",
                    }}
                >
                    <Typography variant='h1'>
                        Gestão <br />
                        <Box component="span" sx={{ color: "primary.main" }}>Inteligente</Box> de Chaves
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end"
                    }}
                >
                    <Typography variant='h6'>
                        Controle empréstimos, registre movimentações e monitore o uso das chaves
                        da sua instituição em um único sistema.
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 2,
                        padding: 2,
                    }}
                >
                    <Grid size={4}>
                        <Card
                            sx={{
                                textAlign: "center",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: 5
                                }
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: "info.light",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <LockIcon fontSize='large' sx={{ color: "info.main" }}
                                        />
                                    </Box>
                                }
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Typography variant='h5'>Controle de Acesso</Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    Gerencie quem tem acesso a cada sala e monitore o uso das chaves em tempo real.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={4}>
                        <Card
                            sx={{
                                textAlign: "center",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: 5
                                }
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: "success.light",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",

                                        }}
                                    >
                                        <SecurityIcon fontSize='large' sx={{ color: "success.main" }} />
                                    </Box>
                                }
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Typography variant='h5'>Segurança</Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    Sistema seguro com autenticação e registro de todas as movimentações de chaves.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={4}>
                        <Card
                            sx={{
                                textAlign: "center",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: 5
                                }
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: "primary.soft",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",

                                        }}
                                    >
                                        <KeyIcon fontSize='large' sx={{ color: "primary.main" }} />
                                    </Box>
                                }
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Typography variant='h5'>Gestão Simplificada</Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    Interface intuitiva para cadastro de professores, salas e controle de empréstimos.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}