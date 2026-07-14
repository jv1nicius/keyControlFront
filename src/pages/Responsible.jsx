import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Grid } from '@mui/material'
import ResponsibleCard from '../components/modal/ResponsibleCard'
import { useAuth } from "../contexts/hooks/useAuth";
import ResponsibleModal from '../components/modal/ResponsibleModal';
import { useOutletContext } from 'react-router-dom'

export default function ResponsiblePage() {
    const [data, setData] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const { user } = useAuth()
    const { search } = useOutletContext()
    const [selected, setSelected] = useState(null)
    const [editingResponsible, setEditingResponsible] = useState(null)

    const loadResponsible = async (term = '') => {
        try {
            const { data } = await api.get('/responsavel', {
                params: {
                    q: term || '*'
                }
            })
            const usersWithoutMe = data.filter(
                (responsible) => responsible.email !== user.email
            );
            setData(usersWithoutMe)
            console.log(usersWithoutMe);

        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }

    const handleDelete = async (responsavel) => {
        try {
            await api.delete(`/responsavel/${responsavel.responsavel_id}`)

            toast.success(`${responsavel.responsavel_nome} removido!`)

            setSelected(null)
            loadResponsible()
        } catch (error) {
            toast.error('Erro ao remover Responsavel!')
        }

    }

    useEffect(() => {
        loadResponsible(search)
    }, [search])

    return (
        <>
            {data.length == 0 ?
                "Vazio" :
                <Grid container spacing={1}>
                    {data.map((responsavel) => (
                        <Grid key={responsavel.responsavel_id} size={3}>
                            <ResponsibleCard
                                responsavel={responsavel}
                                selected={selected === responsavel.responsavel_id}
                                onToggle={
                                    () => setSelected(
                                        selected === responsavel.responsavel_id ? null : responsavel.responsavel_id
                                    )}
                                onEdit={() => {
                                    setSelected(null)
                                    setEditingResponsible(responsavel)
                                    setModalOpen(true)
                                }}
                                onDelete={() => handleDelete(responsavel)}
                            />
                        </Grid>
                    ))}
                </Grid>
            }
            <ResponsibleModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadResponsible}
                responsible={editingResponsible}
            />
        </>
    )
}