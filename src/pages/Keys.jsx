import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Grid } from '@mui/material'
import KeyCard from '../components/modal/KeyCard'
import AddKeyCard from '../components/modal/AddKeyCard'
import KeyModal from '../components/modal/KeyModal'
import { toast } from 'sonner'

export default function KeyPage() {
    const [data, setData] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [editingKey, setEditingKey] = useState(null)
    const [classrooms, setClassrooms] = useState([])

    const loadClassrooms = async () => {
        try {
            const { data } = await api.get('/salas')
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        } finally {
        }
    }

    const loadKeys = async () => {
        try {
            const { data } = await api.get('/chaves')
            setData(data)
        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }

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
    }, [])


    return (
        <>
            {data.length == 0 ?
                "Vazio" :
                <Grid container spacing={1}>
                    <Grid size={3}>
                        <AddKeyCard onClick={() => {
                            setModalOpen(true)
                            setEditingKey(null)
                        }} />
                    </Grid>

                    {data.map((chave) => (
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