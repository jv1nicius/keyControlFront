import { useEffect, useState } from "react"

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import CheckIcon from '@mui/icons-material/Check';

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { createReservaSchema, FREQUENCIA_VALUES, STATUS_VALUES, DIA_SEMANA_LABELS } from '../../schemas/keycheckoutSchema'
import { api } from '../../services/api'
import { useAuth } from "../../contexts/hooks/useAuth"

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function KeyCheckoutModal({ open, onClose, onSuccess, classroom, isAdmin, reservation, }) {
    const [submitting, setSubmitting] = useState(false)
    const [classrooms, setClassrooms] = useState([])
    const [myResponsibility, setMyResponsibility] = useState(false)
    const [responsables, setResponsables] = useState([])
    const [startToday, setStartToday] = useState(false)
    const { user } = useAuth()

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

    const loadResponsibles = async () => {
        try {
            const { data } = await api.get('/responsavel')
            const usersWithoutMe = data.filter(
                (responsible) => responsible.email !== user.email
            );
            setResponsables(usersWithoutMe)
        } catch (error) {
            console.error(error)
        } finally {
            //setLoading(false)
        }
    }

    useEffect(() => {
        loadClassrooms()
        loadResponsibles()
    }, [])

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createReservaSchema),
        defaultValues: {
            sala_id: undefined,
            responsavel_id: undefined,
            hora_inicio: "",
            hora_fim: "",
            data_inicio: "",
            data_fim: "",
            frequencia: "",
            status: "ativa",
            dias_semana: [],
        },
    })

    useEffect(() => {
        if (open && classroom) {
            setValue("sala_id", classroom.sala_id);
        }
    }, [open, classroom])

    useEffect(() => {
        if (open && !isAdmin) {
            setValue("responsavel_id", user.user_id);
        }
    }, [open, isAdmin, user, setValue]);
    useEffect(() => {
        if (!open) return;

        if (reservation) {
            reset({
                sala_id: reservation.sala_id,
                responsavel_id: reservation.responsavel_id,
                hora_inicio: reservation.hora_inicio,
                hora_fim: reservation.hora_fim,
                data_inicio: reservation.data_inicio,
                data_fim: reservation.data_fim,
                frequencia: reservation.frequencia,
                status: reservation.status,
                dias_semana: reservation.dias_semana ?? [],
            });

            setMyResponsibility(
                reservation.responsavel_id === user.user_id
            );

            setStartToday(false);
        } else {
            reset({
                sala_id: classroom?.sala_id,
                responsavel_id: !isAdmin ? user.user_id : undefined,
                hora_inicio: "",
                hora_fim: "",
                data_inicio: "",
                data_fim: "",
                frequencia: "",
                status: "ativa",
                dias_semana: [],
            });

            setMyResponsibility(false);
            setStartToday(false);
        }
    }, [open, reservation, classroom, isAdmin, user, reset]);

    const frequencia = useWatch({ control, name: "frequencia" })
    const mostrarDataFim = frequencia && frequencia !== "única"
    const mostrarDias = frequencia === "semanal" || frequencia === "quinzenal"

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleMyResponsibility = (checked) => {
        setMyResponsibility(checked);

        if (checked) {
            setValue("responsavel_id", user.user_id);
        } else {
            setValue("responsavel_id", undefined);
        }
    }

    const handleStartToday = (checked) => {
        setStartToday(checked);

        if (checked) {
            const today = dayjs().format("YYYY-MM-DD");
            setValue("data_inicio", today);

        } else {
            setValue("data_inicio", "");
        }
    }

    async function onSubmit(data) {
        setSubmitting(true)
        try {
            if (reservation) {
                await api.put(`/reservas/${reservation.reserva_id}`, data);
            } else {
                await api.post("/reservas", data);
            }
            reset()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error("Erro ao criar reserva:", error)
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{reservation ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        {!classroom &&
                            <Controller
                                name="sala_id"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.sala_id}>
                                        <InputLabel>Sala</InputLabel>
                                        <Select {...field} value={field.value ?? ""} label="Sala"
                                            onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                        >
                                            {classrooms.map(sala => (
                                                <MenuItem key={sala.sala_id} value={sala.sala_id}>
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
                        }
                        {classroom &&
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                {classroom.sala_nome}
                            </Alert>
                        }
                        {isAdmin &&
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={myResponsibility}
                                        onChange={(e) => handleMyResponsibility(e.target.checked)}
                                    />
                                }
                                label="Reservar para mim"
                            />
                        }
                        {!isAdmin || myResponsibility ? (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                O responsável será você.
                            </Alert>
                        ) : (
                            <Controller
                                name="responsavel_id"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.responsavel_id}>
                                        <InputLabel>Responsável</InputLabel>

                                        <Select
                                            {...field}
                                            value={field.value ?? ""}
                                            label="Responsável"
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === "" ? undefined : Number(e.target.value)
                                                )
                                            }
                                        >
                                            {responsables.map((responsable) => (
                                                <MenuItem
                                                    key={responsable.responsavel_id}
                                                    value={responsable.responsavel_id}
                                                >
                                                    {responsable.responsavel_nome}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        {errors.responsavel_id && (
                                            <FormHelperText>
                                                {errors.responsavel_id.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        )}


                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Controller
                                name="hora_inicio"
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        label="Hora início"
                                        ampm={false}
                                        value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
                                        onChange={(value) =>
                                            field.onChange(
                                                value ? value.format("HH:mm") : ""
                                            )
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.hora_inicio,
                                                helperText: errors.hora_inicio?.message,
                                            },
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="hora_fim"
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        label="Hora fim"
                                        ampm={false}
                                        value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
                                        onChange={(value) =>
                                            field.onChange(
                                                value ? value.format("HH:mm") : ""
                                            )
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.hora_fim,
                                                helperText: errors.hora_fim?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Controller
                            name="frequencia"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.frequencia}>
                                    <InputLabel>Frequência</InputLabel>
                                    <Select {...field} label="Frequência">
                                        {FREQUENCIA_VALUES.map(f => (
                                            <MenuItem key={f} value={f}>
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.frequencia && (
                                        <FormHelperText>{errors.frequencia.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={startToday}
                                    onChange={(e) => handleStartToday(e.target.checked)}
                                />
                            }
                            label="Começar hoje"
                        />

                        {startToday ?
                            (
                                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                    Começará hoje!
                                </Alert>
                            ) :
                            <Controller
                                name="data_inicio"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Data início"
                                        format="LL"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(value) =>
                                            field.onChange(value ? value.format("YYYY-MM-DD") : "")
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.data_inicio,
                                                helperText: errors.data_inicio?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        }

                        {mostrarDataFim && (
                            <Controller
                                name="data_fim"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Data fim"
                                        format="LL"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(value) =>
                                            field.onChange(value ? value.format("YYYY-MM-DD") : "")
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.data_fim,
                                                helperText: errors.data_fim?.message,
                                            }
                                        }}
                                    />
                                )}
                            />
                        )}


                        {mostrarDias && (
                            <Controller
                                name="dias_semana"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors.dias_semana}>
                                        <FormGroup row>
                                            {Object.entries(DIA_SEMANA_LABELS).map(([valor, label]) => {
                                                const num = Number(valor)
                                                return (
                                                    <FormControlLabel
                                                        key={num}
                                                        label={label}
                                                        control={
                                                            <Checkbox
                                                                checked={field.value?.includes(num) ?? false}
                                                                onChange={e => {
                                                                    const atual = field.value ?? []
                                                                    field.onChange(
                                                                        e.target.checked
                                                                            ? [...atual, num]
                                                                            : atual.filter(d => d !== num)
                                                                    )
                                                                }}
                                                            />
                                                        }
                                                    />
                                                )
                                            })}
                                        </FormGroup>
                                        {errors.dias_semana && (
                                            <FormHelperText>
                                                {errors.dias_semana.message ?? errors.dias_semana.root?.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        )}
                    </Box>
                </DialogContent>
            </LocalizationProvider>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                >
                    {submitting
                        ? "Salvando..."
                        : reservation
                            ? "Atualizar"
                            : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}