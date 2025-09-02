import {
    Avatar,
    Box,
    Flex,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    useColorModeValue,
    Text, Input,
    useDisclosure, Button, FormControl,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { ToastContainer, toast } from 'react-toastify';

function ReservaModal({ isOpen, onClose, finalRef, reserva, responsaveis }) {
    const initialRef = React.useRef();
    const [cleanModal, setCleanModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        if (reserva && reserva.is_edit) {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [reserva]);

    const validationSchema = Yup.object({
        responsavel_id: Yup.number().required('Responsável é obrigatório').positive('Deve ser um número positivo').integer('Deve ser um número inteiro'),
        data: Yup.date().required('Data é obrigatória').nullable(),
        hora_inicio: Yup.string().required('Hora de início é obrigatória'),
        hora_fim: Yup.string().required('Hora de fim é obrigatória'),
    });

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const isoString = date.toISOString();
        return isoString.slice(0, 16);
    };

    const combineDateAndTime = (date, time) => {
        if (!date || !time) return '';

        const localDateTime = new Date(`${date}T${time}:00`);
        return localDateTime.toISOString();
    };



    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Resposta do servidor:', responseData);
                toast.success("Reserva Realizada!", {theme: "colored"})
                setCleanModal(true);
            } else {
                console.error('Erro na requisição:', response.statusText);
                toast.error("Erro ao Realizar Reserva!", {theme: "colored"})
                setCleanModal(false);
            }
        } catch (err) {
            console.error('Erro ao enviar dados:', err);
            setCleanModal(false);
        }
    };

    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/reservas/${reserva.reserva_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Reserva Atualizada!", {theme: "colored"})
                setCleanModal(true);
            } else {
                toast.error("Erro ao Atualizar Reserva", {theme: "colored"})
                console.error('Erro na requisição:', response.statusText);
                setCleanModal(false);
            }
        } catch (err) {
            console.error('Erro ao enviar dados:', err);
            setCleanModal(false);
        }
    };

    const handleSave = async (values) => {
        const novaReserva = {
            "sala_id": reserva.sala_id,
            "responsavel_id": values.responsavel_id,
            "data_hora_inicio": combineDateAndTime(values.data, values.hora_inicio),
            "data_hora_fim": combineDateAndTime(values.data, values.hora_fim),
        }

        if (isEdit) {
            await updateData(novaReserva)
        } else {
            await postData(novaReserva)
        }
        onClose()
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <>
        <ToastContainer />
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{reserva?.sala_nome || "Nova Reserva"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Formik
                        initialValues={{
                            responsavel_id: reserva?.responsavel_id || '',
                            data: reserva?.data_hora_inicio ? formatDateForInput(reserva.data_hora_inicio).slice(0, 10) : '',
                            hora_inicio: reserva?.data_hora_inicio ? formatDateForInput(reserva.data_hora_inicio).slice(11, 16) : '',
                            hora_fim: reserva?.data_hora_fim ? formatDateForInput(reserva.data_hora_fim).slice(11, 16) : '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }) => (
                            <Form>
                                <FormControl mt={4} isInvalid={touched.responsavel_id && errors.responsavel_id}>
                                    <FormLabel>Responsável</FormLabel>
                                    <Field
                                        as={Select}
                                        name="responsavel_id"
                                        placeholder="Selecione um responsável"
                                    >
                                        {responsaveis.map((resp) => (
                                            <option key={resp.responsavel_id} value={resp.responsavel_id}>
                                                {resp.responsavel_nome}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="responsavel_id" component="div" style={{ color: 'red' }} />
                                </FormControl>

                                <FormControl mt={4} isInvalid={touched.data && errors.data}>
                                    <FormLabel>Data</FormLabel>
                                    <Field
                                        as={Input}
                                        name="data"
                                        type="date"
                                        placeholder="Selecione a data"
                                    />
                                    <ErrorMessage name="data" component="div" style={{ color: 'red' }} />
                                </FormControl>

                                <FormControl mt={4} isInvalid={touched.hora_inicio && errors.hora_inicio}>
                                    <FormLabel>Hora de Início</FormLabel>
                                    <Field
                                        as={Input}
                                        name="hora_inicio"
                                        type="time"
                                        placeholder="Selecione a hora de início"
                                    />
                                    <ErrorMessage name="hora_inicio" component="div" style={{ color: 'red' }} />
                                </FormControl>

                                <FormControl mt={4} isInvalid={touched.hora_fim && errors.hora_fim}>
                                    <FormLabel>Hora de Fim</FormLabel>
                                    <Field
                                        as={Input}
                                        name="hora_fim"
                                        type="time"
                                        placeholder="Selecione a hora de fim"
                                    />
                                    <ErrorMessage name="hora_fim" component="div" style={{ color: 'red' }} />
                                </FormControl>

                                <ModalFooter>
                                    <Button colorScheme="green" mr={3} type="submit">
                                        Salvar
                                    </Button>
                                    <Button colorScheme="red" onClick={handleClose}>Cancelar</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    );
}

export default ReservaModal;
