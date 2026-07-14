import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { withdrawalSchema } from '../../schemas/withdrawals'
import { toast } from "sonner";

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
        console.log("Sala:", sala_id);
        console.log("Chaves:", data);
        setKeys(data.filter(key => key.sala_id === sala_id));
        console.log(`Chaves da sala :${sala_id}`);

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
            console.log(data);
            console.log(user.user_id)
            await api.post('/retiradas', data)
            reset()
            onClose()
            toast.success('Chave retirada!')
        } catch (error) {
            console.error(error)
            toast.error(error)
        }
    }

    const onError = (errors) => {
        console.log("ERROS", errors);
        console.log(keys)
    };
    useEffect(() => {
        if (!user) return;
        if (open && keys.length > 0) {
            const availableKey = keys.find(key => key.disponivel);
            const now = new Date();

            const dataRetirada = now.toLocaleDateString("sv-SE");
            const horaRetirada = now.toTimeString().slice(0, 5);

            const previsao = new Date();
            previsao.setHours(previsao.getHours() + 2);

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