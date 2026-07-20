import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'

export default function ClassroomCard({
    sala,
    selected,
    onToggle,
    onEdit,
    onDelete
}) {

    const keyWithdrawn =
        sala.status?.chavesRetiradas > 0

    return (
        <Card
            sx={{
                border: 1,
                borderColor: sala.disponivel
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
                        <Typography variant="h6">
                            {sala.sala_nome}
                        </Typography>

                        <Box display="flex" gap={1}>
                            <Chip
                                label={
                                    sala.disponivel
                                        ? 'Livre'
                                        : 'Indisponível'
                                }
                                color={
                                    sala.disponivel
                                        ? 'success'
                                        : 'error'
                                }
                                size="small"
                            />

                            {keyWithdrawn && (
                                <Chip
                                    label="Chave retirada"
                                    color="warning"
                                    size="small"
                                />
                            )}

                            {!keyWithdrawn && sala.status?.possuiReserva && (
                                <Chip
                                    label="Reservada"
                                    color="info"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>
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
                        <IconButton
                            onClick={onDelete}
                            color="error"
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Collapse>
        </Card>
    )
}