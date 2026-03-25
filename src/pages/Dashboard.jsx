import { useState } from "react";

import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import LooksOneIcon from '@mui/icons-material/LooksOne';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

export default function Dashboard() {
    const [view, setView] = useState('diaria');

    const hoje = new Date().toISOString().split("T")[0];

    const reservasIndividual = [

        { "reserva_id": 1, "sala_id": 1, "responsavel_id": 1, "hora_inicio": "07:00", "hora_fim": "07:50", "data_inicio": "2026-02-03", "data_fim": "2026-03-19", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 2, "sala_id": 2, "responsavel_id": 1, "hora_inicio": "07:50", "hora_fim": "08:40", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 3, "sala_id": 3, "responsavel_id": 1, "hora_inicio": "08:40", "hora_fim": "09:30", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 4, "sala_id": 4, "responsavel_id": 1, "hora_inicio": "09:50", "hora_fim": "10:40", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 5, "sala_id": 5, "responsavel_id": 1, "hora_inicio": "10:40", "hora_fim": "11:30", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 6, "sala_id": 6, "responsavel_id": 1, "hora_inicio": "11:30", "hora_fim": "12:20", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },

        { "reserva_id": 7, "sala_id": 7, "responsavel_id": 1, "hora_inicio": "13:20", "hora_fim": "14:10", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 8, "sala_id": 8, "responsavel_id": 1, "hora_inicio": "14:10", "hora_fim": "15:00", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 9, "sala_id": 9, "responsavel_id": 1, "hora_inicio": "15:20", "hora_fim": "16:10", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 10, "sala_id": 10, "responsavel_id": 1, "hora_inicio": "16:10", "hora_fim": "17:00", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 11, "sala_id": 11, "responsavel_id": 1, "hora_inicio": "17:00", "hora_fim": "17:50", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },

        { "reserva_id": 12, "sala_id": 12, "responsavel_id": 1, "hora_inicio": "18:50", "hora_fim": "19:40", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 13, "sala_id": 13, "responsavel_id": 1, "hora_inicio": "19:40", "hora_fim": "20:30", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 14, "sala_id": 14, "responsavel_id": 1, "hora_inicio": "20:40", "hora_fim": "21:30", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] },
        { "reserva_id": 15, "sala_id": 15, "responsavel_id": 1, "hora_inicio": "21:30", "hora_fim": "22:20", "data_inicio": "2026-02-03", "data_fim": "2026-06-30", "frequencia": "semanal", "status": "ativa", "dias_semana": [2, 3, 4, 5, 6, 7] }
    ]

    const dias = [
        { "coluna": "Hora", "id": 0 },
        { "coluna": "Domingo", "id": 1 },
        { "coluna": "Segunda", "id": 2 },
        { "coluna": "Terça", "id": 3 },
        { "coluna": "Quarta", "id": 4 },
        { "coluna": "Quinta", "id": 5 },
        { "coluna": "Sexta", "id": 6 },
        { "coluna": "Sábado", "id": 7 }
    ]

    const horarios = reservasIndividual.map((reserva, index) => reserva.hora_inicio)

    const salas = [{ "id": 1, "nome": "Sala" }]

    const handleView = (event, newView) => {
        setView(newView);
    };

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
                            <Typography>
                                Chave em uso
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
                            <Typography>
                                Agendamentos ativos
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
                            <Typography>
                                Chaves/Salas livres
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box
                sx={{
                    pt: 2,
                    pb: 1
                }}
            >
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleView}
                    aria-label="visualização de calendário"
                >
                    <ToggleButton value="diaria" aria-label="diária">
                        <LooksOneIcon />
                    </ToggleButton>
                    <ToggleButton value="semanal" aria-label="semanal">
                        <ViewWeekIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {view === "diaria" ?
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Hoje
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                        </TableBody>
                    </Table>
                </TableContainer>
                :
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {dias.map((coluna) => (
                                    <TableCell key={coluna.id}>
                                        {coluna.coluna}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {horarios.map((horario) => (
                                <TableRow key={horario}>
                                    {dias.map((dia, i) => {
                                        if (dia.id === 0) {
                                            return (
                                                <TableCell key={dia.id}>
                                                    {horario}
                                                </TableCell>
                                            );
                                        }
                                        const reservasAtivasHoje = reservasIndividual.filter(r =>
                                            r.data_inicio <= hoje &&
                                            r.data_fim >= hoje
                                        );

                                        const reserva = reservasAtivasHoje.find(r =>
                                            r.hora_inicio === horario &&
                                            r.dias_semana.includes(dia.id)
                                        );
                                        return (
                                            <TableCell key={dia.id}>
                                                {reserva ? `id ${reserva.sala_id}` : ""}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }


        </Box>
    );
}