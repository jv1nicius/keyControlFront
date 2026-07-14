import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Box, Chip, Card, CardActionArea, Container, CardContent, Grid, Typography, TextField } from '@mui/material'
import ClassroomCard from '../components/modal/ClassroomCard'
import AddClassroomCard from '../components/modal/AddClassroomCard';
import ClassroomModal from '../components/modal/ClassroomModal';
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner';

export default function ClassRoomPage() {
    const [data, setData] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [editingClassroom, setEditingClassroom] = useState(null)
    const { search } = useOutletContext()
    const [sort, setSort] = useState('nome')
    const [order, setOrder] = useState('asc')

    const loadClassroom = async (term = '') => {
        try {
            const { data } = await api.get('/salas', {
                params: {
                    q: term || '*',
                    sort,
                    order
                }
            })
            setData(data)
        } catch (error) {
            console.error(error)
        } finally {
        }
    }

    const handleDelete = async (sala) => {
        try {
            await api.delete(`/salas/${sala.sala_id}`)

            toast.success(`${sala.sala_nome} removida!`)

            setSelected(null)
            loadClassroom()
        } catch (error) {
            toast.error('Erro ao remover sala!')
        }

    }

    useEffect(() => {
        loadClassroom(search)
    }, [search])

    return (
        <>
            {data.length == 0 ?
                "Vazio" :
                <Grid container spacing={1}>
                    {!search && (<Grid size={3}>
                        <AddClassroomCard onClick={() => {
                            setModalOpen(true)
                            setEditingClassroom(null)
                        }} />
                    </Grid>
                    )}

                    {data.map((sala) => (
                        <Grid key={sala.sala_id} size={3}>
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
            }

            <ClassroomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadClassroom}
                classroom={editingClassroom}
            />
        </>
    )
}