import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Button,
    Stack,
    Switch
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { classroomSchema } from '../../schemas/classroomSchema'
import { api } from '../../services/api'
import { toast } from 'sonner';

export default function ClassroomModal({ open, onClose, onSuccess, classroom = null }) {
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(classroomSchema),
        defaultValues: {
            sala_nome: '',
            disponivel: true
        },
    })

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (formData) => {
        setSubmitting(true)
        try {
            if (classroom) {
                await api.put(`/salas/${classroom.sala_id}`, formData)
                toast.success(`${formData.sala_nome} atualizada!`)
            } else {
                await api.post('/salas', formData)
                toast.success(`${formData.sala_nome} criada!`)
            }
            reset()
            onSuccess?.()
            onClose()
        } catch (error) {
            toast.error(
                classroom
                    ? 'Erro ao atualizar sala!'
                    : 'Erro na criação da sala!'
            )
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (open) {
            if (classroom) {
                reset({
                    sala_nome: classroom.sala_nome,
                    disponivel: classroom.disponivel,
                })
            } else {
                reset({
                    sala_nome: '',
                    disponivel: true,
                })
            }
        }
    }, [open, classroom, reset])

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {classroom ? 'Editar sala' : 'Nova sala'}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Controller
                            name="sala_nome"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nome"
                                    fullWidth
                                    autoFocus
                                    error={!!errors.sala_nome}
                                    helperText={errors.sala_nome?.message}
                                />
                            )}
                        />
                        {classroom &&
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
                        {submitting
                            ? 'Salvando...'
                            : classroom
                                ? 'Atualizar'
                                : 'Salvar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}