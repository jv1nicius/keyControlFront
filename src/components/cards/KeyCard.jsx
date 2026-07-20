import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';

export default function KeyCard({ chave, selected, onToggle, onEdit, onDelete }) {
    const disabled = !chave.disponivel && !chave.retirada

    console.log(disabled);

    return (
        <Card
            sx={{
                border: 1,
                borderColor: chave.disponivel
                    ? 'success.main'
                    : 'error.main',
                transition: '0.4s',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                },
            }}
        >
            <CardActionArea onClick={onToggle}>
                <CardContent>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <KeyIcon
                            sx={{
                                color: chave.disponivel ? 'success.main' : 'error.main'
                            }}
                        />
                        <Typography variant='h6'>
                            {chave.chave_nome}
                        </Typography>
                        <Chip
                            label={chave.disponivel ? 'Disponível' : 'Indisponível'}
                            color={chave.disponivel ? 'success' : 'error'}
                            size="small"
                        />
                    </Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                    >
                        Sala: {chave.sala?.sala_nome}
                    </Typography>
                    {!chave.disponivel && chave.retirada && (
                        <Typography
                            variant="body2"
                            color="error.main"
                        >
                            Retirada por {chave.retirada.usuario_nome}
                        </Typography>
                    )}

                    {chave.reserva && (
                        <Typography
                            variant="body2"
                            color="warning.main"
                        >
                            Reserva ativa
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
            <Collapse in={selected}>
                <Divider />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={0.5}
                    px={1}
                    py={0.75}
                >
                    <Tooltip title="Fechar">
                        <IconButton onClick={onToggle}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton onClick={onEdit}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar">
                        <IconButton onClick={onDelete} color='error'>
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Collapse>
        </Card>
    )
}