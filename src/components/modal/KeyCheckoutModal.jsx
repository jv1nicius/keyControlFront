import * as React from 'react';
import { useForm, Controller } from "react-hook-form";

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
};

export default function KeyCheckoutModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            Responsavel: "",
            Chaves: null,
        }
    });
    const chaves = [{ value: 1, label: "Chave 1" }, { value: 2, label: "Chave 2" }, { value: 3, label: "Chave 3" }, { value: 4, label: "Chave 4" }]
    const professores = [{ value: "Vinícius", label: "Vinícius" }, { value: "Barros", label: "Barros" }, { value: "Rhavy", label: "Rhavy" }]

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>Retirar Chave</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit((data) => {
                            console.log(data);
                            handleClose();
                            reset();
                        })}
                        sx={style}
                    >
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Nova Retirada
                        </Typography>

                        <Controller
                            name="Chaves"
                            control={control}
                            rules={{ required: "Selecione uma chave" }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={chaves}
                                    getOptionLabel={(option) => option.label}
                                    value={
                                        chaves.find((p) => p.value === field.value) || null
                                    }
                                    onChange={(_, option) => field.onChange(option ? option.value : "")}
                                    fullWidth
                                    autoHighlight
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chaves"
                                            error={!!errors.Chaves}
                                            helperText={errors.Chaves?.message}
                                        />)}
                                />
                            )}
                        />
                        <Controller
                            name="Responsavel"
                            control={control}
                            rules={{ required: "Selecione um responsável" }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={professores}
                                    getOptionLabel={(option) => option.label}
                                    value={
                                        professores.find((p) => p.value === field.value) || null
                                    }
                                    onChange={(_, option) =>
                                        field.onChange(option ? option.value : "")
                                    }
                                    fullWidth
                                    autoHighlight
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Responsável"
                                            error={!!errors.Responsavel}
                                            helperText={errors.Responsavel?.message}
                                        />)}
                                />
                            )}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={isSubmitting}
                        >
                            Enviar
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
