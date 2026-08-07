import { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { api } from '../services/api'
import { useAuth } from "../contexts/hooks/useAuth";

import KeyCheckoutModal from '../components/modals/KeyCheckoutModal';
import WithdrawalsCard from '../components/cards/WithdrawalsCard';
import WithdrawalsModal from '../components/modals/WithdrawalsModal';

export default function Withdrawals() {
    const [classrooms, setClassrooms] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [keys, setKeys] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null)
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [reservationModalOpen, setReservationModalOpen] = useState(false)
    const [reservationClassroom, setReservationClassroom] = useState(null)
    const [reservations, setReservations] = useState([]);
    const { user, loading, isAdmin } = useAuth()

    const loadClassroom = async () => {
        try {
            const { data } = await api.get('/salas')
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }

    const loadReservations = async () => {
        try {
            const { data } = await api.get('/reservas');
            setReservations(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadKeys = async () => {
        try {
            const { data } = await api.get('/chaves')
            setKeys(data)
        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }

    const loadWithdrawals = async () => {
        try {
            const { data } = await api.get('/retiradas')
            setWithdrawals(data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleOpenModal = (classroom) => {
        if (!user?.user_id) return;
        if (!classroom) return;
        if (keys.length === 0) return;
        setSelectedClassroom(classroom);
        setModalOpen(true);
    };

    const handleOpenReservationModal = (classroom) => {
        setReservationClassroom(classroom ?? null);
        setReservationModalOpen(true);
    };

    useEffect(() => {
        loadClassroom();
        loadWithdrawals();
        loadKeys();
        loadReservations();
    }, []);

const getReservationStatus = (classroom) => {
    if (!user?.user_id) {
        return {
            reservation: null,
            hasReservation: false,
            isToday: false,
            isNear: false,
        };
    }

    const now = new Date();

    // JS: domingo = 0
    const today = now.getDay();

    // sua API usa 1..7?
    const weekDay = today === 0 ? 7 : today;

    const reservation = reservations.find(r => {
        if (r.sala_id !== classroom.sala_id) return false;
        if (r.responsavel_id !== user.user_id) return false;
        if (r.status !== "ativa") return false;

        const todayDate = now.toISOString().split("T")[0];

        if (
            todayDate < r.data_inicio ||
            todayDate > r.data_fim
        ) {
            return false;
        }

        return r.dias_semana.includes(weekDay);
    });

    if (!reservation) {
        return {
            reservation: null,
            hasReservation: false,
            isToday: false,
            isNear: false,
        };
    }

    const [hour, minute] = reservation.hora_inicio.split(":");

    const reservationDate = new Date();
    reservationDate.setHours(Number(hour), Number(minute), 0);

    const diffMinutes =
        (reservationDate.getTime() - now.getTime()) / 1000 / 60;

    return {
        reservation,
        hasReservation: true,
        isToday: true,
        isNear: diffMinutes >= 0 && diffMinutes <= 30,
        minutesRemaining: Math.floor(diffMinutes)
    };
};

const classroomsWithReservations = classrooms.map((classroom) => {

    const reservation = reservations.find(r =>
        r.sala_id === classroom.sala_id &&
        r.status === "ativa"
    );

    return {
        ...classroom,
        keys: keys.filter(key => key.sala_id === classroom.sala_id),
        reservation,
        reservationStatus: getReservationStatus(classroom)
    };
});


    return (
        <>
            {classroomsWithReservations.length == 0 ?
                "Vazio" :
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant='outlined' onClick={() => handleOpenReservationModal(null)}>
                                + Reservar sala
                            </Button>
                        </Box>
                    </Grid>
                    {classroomsWithReservations.map((classroom) => (
                        <Grid size={4} key={classroom.sala_id}>
                            <WithdrawalsCard
                                classroom={classroom}
                                withdrawals={withdrawals}
                                keys={keys}
                                user={user}
                                onOpen={handleOpenModal}
                                onOpenReservation={handleOpenReservationModal}
                                reload={() => {
                                    loadClassroom();
                                    loadWithdrawals();
                                    loadKeys();
                                }}
                            />
                        </Grid>
                    ))}
                </Grid >
            }

            <WithdrawalsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                user={user}
                classroom={selectedClassroom}
            />
            <KeyCheckoutModal
                open={reservationModalOpen}
                onClose={() => {
                    setReservationModalOpen(false)
                    setReservationClassroom(null)
                }}
                classroom={reservationClassroom}
                onSuccess={() => {
                    loadClassroom()
                    loadWithdrawals()
                    loadKeys()
                }}
            />
        </>
    )
}