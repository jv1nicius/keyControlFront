import { useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AddCard from '../components/cards/AddCard'
import ClassroomCard from '../components/cards/ClassroomCard'
import ClassroomModal from '../components/modals/ClassroomModal'
import ClassroomSearchCard from '../components/cards/ClassroomSearchCard'

import { api } from '../services/api'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'

export default function ClassRoomPage() {
    const [rooms, setRooms] = useState([])
    const [keys, setKeys] = useState([])
    const [reservations, setReservations] = useState([])
    const [keyWithdrawals, setKeyWithdrawals] = useState([])

    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [editingClassroom, setEditingClassroom] = useState(null)

    const { search } = useOutletContext()

    const [sort] = useState('nome')
    const [order] = useState('asc')

    const loadClassroom = async (term = '') => {
        try {
            const response = await api.get('/salas', {
                params: {
                    q: term || '*'
                }
            })
            setRooms(response.data)

        } catch (error) {
            console.error(error);

        }

    }

    const loadKeys = async () => {
        try {
            const { data } = await api.get('/chaves')
            setKeys(data)
        } catch (error) {
            console.error(error);
        }
    }

    const loadWithdrawals = async () => {
        try {
            const { data } = await api.get('/retiradas')
            setKeyWithdrawals(data)
        } catch (error) {
            console.error(error);
        }
    }

    const loadReservations = async () => {
        try {
            const { data } = await api.get('/reservas')
            setReservations(data)
        } catch (error) {
            console.error(error);
        }
    }

    const roomsComplete = useMemo(() => {
        return rooms.map((room) => {

            const roomKeys = keys.filter(
                key => key.sala_id === room.sala_id
            )

            const roomReservations = reservations.filter(
                reservation =>
                    reservation.sala_id === room.sala_id &&
                    reservation.status === 'ativa'
            )

            const roomKeysComplete = roomKeys.map(key => {

                const withdrawal = keyWithdrawals
                    .filter(retirada => retirada.chave_id === key.chave_id)
                    .sort((a, b) => b.retirada_id - a.retirada_id)[0]

                return {
                    ...key,
                    withdrawal
                }
            })

            return {
                ...room,

                chaves: roomKeysComplete,

                reservas: roomReservations,

                status: {
                    quantidadeChaves: roomKeysComplete.length,

                    chavesDisponiveis:
                        roomKeysComplete.filter(c => c.disponivel).length,

                    chavesRetiradas:
                        roomKeysComplete.filter(c => !c.disponivel).length,

                    possuiReserva:
                        roomReservations.length > 0,

                    retiradaAtual:
                        roomKeysComplete.find(c => !c.disponivel)?.withdrawal ??
                        null
                }
            }
        })
    }, [rooms, keys, reservations, keyWithdrawals])

    const sortedRooms = useMemo(() => {
        return [...roomsComplete].sort((a, b) => {
            if (a.disponivel !== b.disponivel) {
                return Number(b.disponivel) - Number(a.disponivel)
            }

            return a.sala_nome.localeCompare(b.sala_nome)
        })
    }, [roomsComplete])

    const handleDelete = async (sala) => {
        try {
            await api.delete(`/salas/${sala.sala_id}`)

            toast.success(`${sala.sala_nome} removida!`)

            setSelected(null)

            loadClassroom()
        } catch {
            toast.error('Erro ao remover sala!')
        }
    }

    useEffect(() => {
        loadClassroom()
        loadKeys()
        loadReservations()
        loadWithdrawals()
    }, [])

    useEffect(() => {
        loadClassroom(search)
    }, [search])

    return (

        <>
            {roomsComplete.length === 0 ? (
                <Grid container spacing={1}>
                    <Grid key={'add-card'} size={3}>
                        <AddCard
                            title="Adicionar nova sala"
                            onClick={() => {
                                setModalOpen(true)
                                setEditingClassroom(null)
                            }}
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={1}>
                    {!search && (
                        <Grid key={'add-card'} size={3}>
                            <AddCard
                                title="Adicionar nova sala"
                                onClick={() => {
                                    setModalOpen(true)
                                    setEditingClassroom(null)
                                }}
                            />
                        </Grid>
                    )}

                    {sortedRooms.map((sala) => (

                        <Grid
                            key={sala.sala_id}
                            size={3}
                        >
                            <ClassroomCard
                                sala={sala}
                                selected={selected === sala.sala_id}
                                onToggle={() =>
                                    setSelected(
                                        selected === sala.sala_id
                                            ? null
                                            : sala.sala_id
                                    )
                                }
                                onEdit={() => {
                                    setSelected(null)
                                    setEditingClassroom(sala)
                                    setModalOpen(true)
                                }}
                                onDelete={() => handleDelete(sala)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <ClassroomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadClassroom}
                classroom={editingClassroom}
            />
        </>
    )
}