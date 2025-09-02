// HistoricoModal.js
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';

function HistoricoModal({ isOpen, onClose, finalRef, historico, responsaveis }) {
    const initialRef = useRef();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (historico && historico.is_edit) {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [historico]);

    const validationSchema = Yup.object({
        responsavel_id: Yup.number()
            .required('Responsável é obrigatório')
            .positive('Deve ser um número positivo')
            .integer('Deve ser um número inteiro'),
        data: Yup.date().required('Data é obrigatória'),
        hora_inicio: Yup.string().required('Hora de início é obrigatória'),
        hora_fim: Yup.string().required('Hora de fim é obrigatória'),
    });

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const combineDateAndTime = (date, time) => {
        if (!date || !time) return '';
        const localDateTime = new Date(`${date}T${time}:00`);
        return localDateTime.toISOString();
    };

    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/historicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Histórico salvo com sucesso!", { theme: "colored" });
                onClose();
            } else {
                toast.error("Erro ao salvar histórico!", { theme: "colored" });
            }
        } catch (err) {
            toast.error("Erro ao conectar com o servidor!", { theme: "colored" });
        }
    };

    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/historicos/${historico.historico_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Histórico atualizado com sucesso!", { theme: "colored" });
                onClose();
            } else {
                toast.error("Erro ao atualizar histórico!", { theme: "colored" });
            }
        } catch (err) {
            toast.error("Erro ao conectar com o servidor!", { theme: "colored" });
        }
    };

    const handleSave = async (values) => {
        const novoHistorico = {
            sala_id: historico.sala_id,
            responsavel_id: values.responsavel_id,
            data_hora_inicio: combineDateAndTime(values.data, values.hora_inicio),
            data_hora_fim: combineDateAndTime(values.data, values.hora_fim),
        };

        if (isEdit) {
            await updateData(novoHistorico);
        } else {
            await postData(novoHistorico);
        }

        onClose();
    };


    return (
        <>
            <ToastContainer />
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{historico?.sala_nome || "Novo Histórico"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{
                                responsavel_id: historico?.responsavel_id || '',
                                data: historico?.data_hora_inicio
                                    ? formatDateForInput(historico.data_hora_inicio).slice(0, 10)
                                    : '',
                                hora_inicio: historico?.data_hora_inicio
                                    ? formatDateForInput(historico.data_hora_inicio).slice(11, 16)
                                    : '',
                                hora_fim: historico?.data_hora_fim
                                    ? formatDateForInput(historico.data_hora_fim).slice(11, 16)
                                    : '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSave}
                        >
                            {({ touched, errors }) => (
                                <Form>
                                    <FormControl mt={4} isInvalid={touched.responsavel_id && errors.responsavel_id}>
                                        <FormLabel>Responsável</FormLabel>
                                        <Field as={Select} name="responsavel_id" placeholder="Selecione um responsável">
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
                                        <Field as={Input} name="data" type="date" />
                                        <ErrorMessage name="data" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl mt={4} isInvalid={touched.hora_inicio && errors.hora_inicio}>
                                        <FormLabel>Hora de Início</FormLabel>
                                        <Field as={Input} name="hora_inicio" type="time" />
                                        <ErrorMessage name="hora_inicio" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl mt={4} isInvalid={touched.hora_fim && errors.hora_fim}>
                                        <FormLabel>Hora de Fim</FormLabel>
                                        <Field as={Input} name="hora_fim" type="time" />
                                        <ErrorMessage name="hora_fim" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <ModalFooter>
                                        <Button colorScheme="green" mr={3} type="submit">
                                            Salvar
                                        </Button>
                                        <Button colorScheme="red" onClick={onClose}>
                                            Cancelar
                                        </Button>
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

export default HistoricoModal;
