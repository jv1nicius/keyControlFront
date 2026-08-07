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

import { getStatusChipColor } from '../../layouts/theme/statusChip'

export default function ReservationCard({
    reserva,
    getClassroomName,
    getResponsableName,
    formatarData,
    DIAS_SEMANA,
    selected,
    onToggle,
    isAdmin,
    onEdit,
    onDelete,
    user
}) {
    const statusLabel =
        reserva?.status.charAt(0).toUpperCase() + reserva?.status.slice(1);

    const frequenciaLabel =
        reserva.frequencia.charAt(0).toUpperCase() + reserva.frequencia.slice(1);

    return (
        <Card>
            <CardActionArea onClick={onToggle}>
                <CardContent>
                    <Box display="flex" gap={2} alignItems="center">
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap={0.5}
                            minWidth={54}
                        >
                            <Typography variant='h6'>
                                {getClassroomName(reserva.sala_id)}
                            </Typography>
                        </Box>

                        <Box flex={1} display="flex" flexDirection="column" gap={0.75}>
                            <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
                                <Typography variant='subtitle2'>
                                    {getResponsableName(reserva.responsavel_id)}
                                </Typography>

                                <Chip
                                    label={statusLabel}
                                    size="small"
                                    color={getStatusChipColor(reserva.status)}
                                />

                                <Chip
                                    label={frequenciaLabel}
                                    size="small"
                                    variant='outlined'
                                    color='info'
                                />
                            </Box>
                            <Typography variant='body2' color='text.secondary'>
                                {reserva.hora_inicio} - {reserva.hora_fim}
                            </Typography>

                            <Typography variant='body2' color='text.secondary'>
                                {formatarData(reserva.data_inicio)} →{" "}
                                {formatarData(reserva.data_fim)}
                            </Typography>

                            <Box display="flex" gap={0.5}>
                                {DIAS_SEMANA.map((dia) => {
                                    const ativo = reserva.dias_semana?.includes(dia.num);

                                    return (
                                        <Box
                                            key={dia.num}
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                background: ativo ? "primary.main" : "transparent",
                                                color: ativo ? "primary.contrastText" : "text.disabled",
                                                border: ativo ? "none" : "1.5px solid",
                                                borderColor: 'divider',
                                            }}
                                        >
                                            {dia.label}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
            {(isAdmin || user.user_id == reserva.responsavel_id) &&
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
                            <IconButton color='error' onClick={onDelete}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Collapse>
            }

        </Card>
    );
}