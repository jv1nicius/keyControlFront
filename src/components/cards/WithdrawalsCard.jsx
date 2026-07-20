import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { api } from '../../services/api';

export default function WithdrawalsCard({ classroom, withdrawals, keys, user, onOpen, onOpenReservation, reload }) {

    const retirada = withdrawals.find(w => {
        const key = keys.find(k => k.chave_id === w.chave_id);

        return (
            key?.sala_id === classroom.sala_id &&
            (w.status === "retirada" || w.status === "atrasada")
        );
    });

    const handleReturn = async (retiradaId) => {
        try {
            await api.put(`/retiradas/${retiradaId}`, {
                status: "devolvida",
                hora_devolucao: new Date().toLocaleTimeString("pt-BR", {
                    hour12: false,
                }),
            });

            reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant='h6'>
                        {classroom.sala_nome}
                    </Typography>

                    <Chip
                        label={classroom.disponivel ? "Livre" : "Ocupada"}
                        color={classroom.disponivel ? "success" : "error"}
                    />
                </Box>

                <Divider sx={{ my: 1 }} />

                {!classroom.disponivel ? (
                    retirada?.responsavel_id === user?.user_id ? (
                        <Button variant="outlined" onClick={() => handleReturn(retirada.retirada_id)}>
                            Devolver chave
                        </Button>
                    ) : (
                        <Button variant="outlined" disabled>
                            Retirada por outro usuário
                        </Button>
                    )
                ) : classroom.keys.length > 0 ? (
                    <Button variant="outlined" onClick={() => onOpen(classroom)}>
                        Retirar Chave
                    </Button>
                ) : (
                    <Button variant="outlined" disabled>
                        Sem chaves
                    </Button>
                )}

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onOpenReservation(classroom)}
                >
                    Reservar sala
                </Button>
            </CardContent>
        </Card>
    );
}