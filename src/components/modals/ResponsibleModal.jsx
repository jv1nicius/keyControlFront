import { useState, useEffect } from "react"

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '../../services/api'
import { responsibleUpdateSchema } from "../../schemas/responsibleSchema";

export default function ResponsibleModal({ open, onClose, onSuccess, responsible }) {
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(responsibleUpdateSchema),
        defaultValues: {
            responsavel_nome: "",
            email: "",
            ativo: true,
        },
    });

    useEffect(() => {
        if (responsible && open) {
            reset({
                responsavel_nome: responsible.responsavel_nome,
                email: responsible.email,
                ativo: responsible.ativo,
            });
        }
    }, [responsible, open, reset]);

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (formData) => {
        setSubmitting(true)
        try {
            await api.put(`/responsavel/${responsible.responsavel_id}`, formData)
            toast.success(`${formData.responsavel_nome} foi atualizado!`)
            onSuccess?.()
            onClose()
        } catch (error) {
            toast.error("Erro ao atualizar responsável.");

        } finally {
            setSubmitting(false)
        }
    }
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                {`Editar ${responsible?.responsavel_nome}`}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nome"
                        {...register("responsavel_nome")}
                        error={!!errors.responsavel_nome}
                        helperText={errors.responsavel_nome?.message}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <Controller
                        name="ativo"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Ativo"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}