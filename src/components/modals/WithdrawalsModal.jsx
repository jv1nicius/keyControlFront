import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from "sonner";

import { api } from '../../services/api'
import { withdrawalSchema } from '../../schemas/withdrawals'

export default function WithdrawalsModal({ open, onClose, user, classroom }) {
    const [submitting, setSubmitting] = useState(false)
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        if (open && classroom) {
            loadKeys(classroom.sala_id);
        }
    }, [open, classroom]);

    const loadKeys = async (sala_id) => {
        const { data } = await api.get(`/chaves`);
        setKeys(data.filter(key => key.sala_id === sala_id));
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(withdrawalSchema),
        defaultValues: {
            responsavel_id: user?.user_id,
            chave_id: classroom?.keys.chave_id,
            status: 'retirada'
        }
    })

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (data) => {
        try {
            await toast.promise(
                api.post('/retiradas', data),
                {
                    loading: 'Retirando chave...',
                    success: 'Chave retirada!',
                    error: (error) =>
                        error.response?.data?.message || 'Erro ao retirar chave',
                }
            );
            reset();
            onClose();
        } catch (error) {
            console.error(error)
        } finally {

        }
    }

    const onError = (errors) => { };

    useEffect(() => {
        if (!user) return;
        if (open && keys.length > 0) {
            const availableKey = keys.find(key => key.disponivel);
            const now = new Date();

            const dataRetirada = now.toLocaleDateString("sv-SE");
            const horaRetirada = now.toTimeString().slice(0, 5);

            const previsao = new Date();
            previsao.setHours(previsao.getHours() + 1);

            const horaPrevista = previsao.toTimeString().slice(0, 5);

            reset({
                chave_id: availableKey?.chave_id ?? null,
                responsavel_id: user.user_id,
                status: "retirada",
                data_retirada: dataRetirada,
                hora_retirada: horaRetirada,
                hora_prevista_devolucao: horaPrevista
            });
        }
    }, [open, keys, user, reset]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Retirar Chave</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <DialogContent>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Retirando...' : 'Retirar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}