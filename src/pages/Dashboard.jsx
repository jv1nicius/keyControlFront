import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import KeyCheckout from "./KeyReservations";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from "@mui/material/Typography";

import LooksOneIcon from '@mui/icons-material/LooksOne';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import { api } from '../services/api'

export default function Dashboard() {
    const [keysInUse, setKeysInUse] = useState([]);
    const [freeKeys, setFreeKeys] = useState([]);
    const [scheduling, setScheduling] = useState([])

    const loadKeys = async () => {
        try {
            const { data } = await api.get('/chaves')
            setKeysInUse(data.filter(key => !key.disponivel));
            setFreeKeys(data.filter(key => key.disponivel));
        } catch (error) {
            console.error(error)
        }
    }
    const loadKeycheckout = async () => {
        try {
            const { data } = await api.get('/reservas')
            setScheduling(data.filter((KeyCheckout) => KeyCheckout.status === 'ativa'))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadKeys()
        loadKeycheckout()
    }, [])


    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Card
                        sx={{
                            height: 90,
                            transition: "0.3s",
                            '&:hover': {
                                transform: "translateY(-5px)",
                                boxShadow: 5
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1">
                                Chave em uso
                            </Typography>

                            <Typography>
                                {keysInUse.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card
                        sx={{
                            height: 90,
                            transition: "0.3s",
                            '&:hover': {
                                transform: "translateY(-5px)",
                                boxShadow: 5
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1">
                                Agendamentos ativos
                            </Typography>
                            <Typography>
                                {scheduling.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card
                        sx={{
                            height: 90,
                            transition: "0.3s",
                            '&:hover': {
                                transform: "translateY(-5px)",
                                boxShadow: 5
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle1">
                                Chaves/Salas livres
                            </Typography>
                            <Typography>
                                {freeKeys.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}