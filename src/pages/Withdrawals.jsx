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

import KeyCheckoutModal from '../components/modal/KeyCheckoutModal';
import WithdrawalsCard from '../components/modal/WithdrawalsCard';
import WithdrawalsModal from '../components/modal/WithdrawalsModal';

export default function Withdrawals() {
    const [classrooms, setClassrooms] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [keys, setKeys] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null)
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [reservationModalOpen, setReservationModalOpen] = useState(false)
    const [reservationClassroom, setReservationClassroom] = useState(null)
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
            const { data } = await api.get('retiradas')
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
        loadClassroom()
        loadWithdrawals()
        loadKeys()
    }, [])

    const classroomsWithKeys = classrooms.map(classroom => ({
        ...classroom,
        keys: keys.filter(key => key.sala_id === classroom.sala_id)
    }));

    return (
        <>
            {classroomsWithKeys.length == 0 ?
                "Vazio" :
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant='outlined' onClick={() => handleOpenReservationModal(null)}>
                                + Reservar sala
                            </Button>
                        </Box>
                    </Grid>
                    {classroomsWithKeys.map((classroom) => (
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