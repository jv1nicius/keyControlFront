import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '../../services/api'
import { keysSchema } from '../../schemas/keysSchema'

export default function KeyModal({ open, onClose, onSuccess, editingKey = null }) {
    const [submitting, setSubmitting] = useState(false)
    const [classrooms, setClassrooms] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(keysSchema),
        defaultValues: {
            sala_id: undefined,
            disponivel: true
        },
    })
    const loadClassrooms = async () => {
        try {
            const { data } = await api.get('/salas')
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }
    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (formData) => {
        setSubmitting(true)
        try {
            if (editingKey) {
                await api.put(`/chaves/${editingKey.chave_id}`, formData)
                toast.success(`Chave atualizada!`)
            } else {
                await api.post('/chaves', formData)
                toast.success(`Nova chave criada!`)
            }
            reset()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error(error)
            toast.error(
                editingKey
                    ? 'Erro ao atualizar chave!'
                    : 'Erro na criação da chave!'
            )
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (open) {
            if (editingKey) {
                reset({
                    sala_id: editingKey.sala_id,
                    disponivel: editingKey.disponivel,
                })
            } else {
                reset({
                    sala_id: undefined,
                    disponivel: true,
                })
            }
        }
        loadClassrooms()

    }, [open, editingKey, reset])

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {editingKey ? 'Editar chave' : 'Nova chave'}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Controller
                            name="sala_id"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.sala_id}>
                                    <InputLabel>Sala</InputLabel>

                                    <Select
                                        {...field}
                                        value={field.value ?? ""} label="Sala" onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                    >
                                        {classrooms.map(sala => (
                                            <MenuItem
                                                key={sala.sala_id}
                                                value={sala.sala_id}
                                            >
                                                {sala.sala_nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.sala_id && (
                                        <FormHelperText>{errors.sala_id.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                        {editingKey &&
                            <Controller
                                name="disponivel"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        label={field.value ? 'Disponível' : 'Indisponível'}
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                    />
                                )}
                            />

                        }
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}