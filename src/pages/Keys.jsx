import { useState, useMemo, useEffect } from 'react'

import AddCard from '../components/cards/AddCard'
import Grid from '@mui/material/Grid'

import KeyCard from '../components/cards/KeyCard'
import KeyModal from '../components/modals/KeyModal'

import { api } from '../services/api'

import { toast } from 'sonner'

export default function KeyPage() {
    const [keys, setKeys] = useState([])
    const [classrooms, setClassrooms] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [reservations, setReservations] = useState([])
    const [data, setData] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [editingKey, setEditingKey] = useState(null)


    const loadKeys = async () => {
        try {
            const { data } = await api.get('/chaves')
            setKeys(data)
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
        } finally {
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

    const loadReservations = async () => {
        try {
            const { data } = await api.get('/reservas')
            setReservations(data)
        } catch (error) {
            console.error(error);
        }
    }

    const keysComplete = useMemo(() => {
        return keys.map((key) => {
            const classroom = classrooms.find(
                sala => sala.sala_id === key.sala_id
            )

            const withdrawal = withdrawals
                .filter(r => r.chave_id === key.chave_id)
                .sort((a, b) => b.retirada_id - a.retirada_id)[0] ?? null

            const reservation = reservations.find(
                r =>
                    r.sala_id === key.sala_id &&
                    r.status === 'ativa'
            ) ?? null

            return {
                ...key,
                sala: classroom,
                retirada: withdrawal,
                reserva: reservation
            }
        })
    }, [keys, classrooms, withdrawals, reservations])

    const sortedKeys = useMemo(() => {
        return [...keysComplete].sort((a, b) => {
            if (a.disponivel !== b.disponivel) {
                return Number(b.disponivel) - Number(a.disponivel)
            }

            return a.chave_nome.localeCompare(b.chave_nome)
        })
    }, [keysComplete])

    const handleDelete = async (chave) => {
        try {
            await api.delete(`/chaves/${chave.chave_id}`)

            toast.success(`${chave.chave_nome} removida!`)

            setSelected(null)
            loadKeys()
        } catch (error) {
            toast.error('Erro ao remover chave!')
        }

    }

    useEffect(() => {
        loadKeys()
        loadClassrooms()
        loadWithdrawals()
        loadReservations()
    }, [])


    return (
        <>
            {sortedKeys.length == 0 ?
                "Vazio" :
                <Grid container spacing={1}>
                    <Grid size={3}>
                        <AddCard
                            title="Adicionar nova chave"
                            onClick={() => {
                                setModalOpen(true)
                                setEditingKey(null)
                            }}
                        />
                    </Grid>

                    {sortedKeys.map((chave) => (
                        <Grid key={chave.chave_id} size={3}>
                            <KeyCard
                                chave={chave}
                                selected={selected === chave.chave_id}
                                onToggle={
                                    () =>
                                        setSelected(selected === chave.chave_id ? null : chave.chave_id)
                                }
                                onEdit={() => {
                                    setSelected(null)
                                    setEditingKey(chave)
                                    setModalOpen(true)
                                }}
                                onDelete={() => handleDelete(chave)}
                                classrooms={classrooms}
                            />
                        </Grid>
                    ))}
                </Grid>
            }

            <KeyModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setEditingKey(null)
                }}
                onSuccess={loadKeys}
                editingKey={editingKey}
            />
        </>
    )
}