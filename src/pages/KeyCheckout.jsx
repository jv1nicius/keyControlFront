import { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import KeyCheckoutModal from '../components/modal/KeyCheckoutModal';
import ReservationCard from '../components/modal/ReservationCard';

import { useAuth } from '../contexts/hooks/useAuth';
import { api } from "../services/api";

export default function KeyCheckout() {
    const [data, setData] = useState([])
    const [dataTam, setDataTam] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [classrooms, setClassrooms] = useState([])
    const [responsables, setResponsables] = useState([])
    const [selected, setSelected] = useState(null)
    const [editingReservation, setEditingReservation] = useState(null);
    const { user, isAdmin } = useAuth()

    const loadKeycheckout = async () => {
        try {
            const { data } = await api.get('/reservas')
            setData(data)
            setDataTam(data.length)
        } catch (error) {
            console.error(error)
        }
    }

    const loadClassrooms = async () => {
        try {
            const { data } = await api.get('/salas')
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        }
    }

    const loadResponsibles = async () => {
        try {
            const { data } = await api.get('/responsavel')
            const usersWithoutMe = data.filter(
                (responsible) => responsible.email !== user.email
            );
            setResponsables(usersWithoutMe)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadKeycheckout()
        loadClassrooms()
        loadResponsibles()
    }, [])

    const formatarData = (data) => {
        const [ano, mes, dia] = data.split('-');

        const meses = [
            'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
            'jul', 'ago', 'set', 'out', 'nov', 'dez'
        ];

        return `${Number(dia)} ${meses[Number(mes) - 1]} ${ano}`;
    };


    const DIAS_SEMANA = [
        { num: 1, label: 'S' },
        { num: 2, label: 'T' },
        { num: 3, label: 'Q' },
        { num: 4, label: 'Q' },
        { num: 5, label: 'S' },
        { num: 6, label: 'S' },
        { num: 7, label: 'D' },
    ];

    const getClassroomName = (id) => {
        return classrooms.find(c => c.sala_id === id)?.sala_nome || id;
    }

    const getResponsableName = (id) => {
        if (id === user.user_id) {
            return "Você"
        }
        return responsables.find(r => r.responsavel_id === id)?.responsavel_nome || id;
    }
    const handleEdit = (reserva) => {
        setEditingReservation(reserva);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/reservas/${id}`);
            loadKeycheckout();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4">
                    Reservas
                </Typography>
                <Button variant="outlined" onClick={() => setModalOpen(true)}>
                    + Nova Reserva
                </Button>
            </Box>
            {dataTam == 0 ?
                "Vazio" :
                <>
                    <Typography variant='body2' color='text.secondary'>
                        {dataTam == 1 ? "1 reserva cadastrada" : `${dataTam} reservas cadastradas`}
                    </Typography>
                    {/* 
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-evenly", alignItems: "center" }}>
                        <Button onClick={loadKeycheckout}>Todas ( {dataTam} )</Button>
                        <Button>Ativas</Button>
                        <Button>Canceladas</Button>
                        <Button>Finalizadas</Button>
                    </Stack>
*/}

                    <Grid container spacing={1}>
                        {data.map((reserva) => (
                            <Grid
                                key={reserva.reserva_id}
                                size={{ xs: 12, md: 6, lg: 4 }}
                            >
                                <ReservationCard
                                    reserva={reserva}
                                    getClassroomName={getClassroomName}
                                    getResponsableName={getResponsableName}
                                    formatarData={formatarData}
                                    DIAS_SEMANA={DIAS_SEMANA}
                                    selected={selected === reserva.reserva_id}
                                    onToggle={
                                        () => setSelected(
                                            selected === reserva.reserva_id ? null : reserva.reserva_id
                                        )}
                                    onEdit={() => handleEdit(reserva)}
                                    onDelete={() => handleDelete(reserva.reserva_id)}
                                    isAdmin={isAdmin}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            }

            <KeyCheckoutModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingReservation(null);
                }}
                onSuccess={() => {
                    loadKeycheckout();
                    setEditingReservation(null);
                }}
                reservation={editingReservation}
                isAdmin={isAdmin}
            />
        </>
    )
}