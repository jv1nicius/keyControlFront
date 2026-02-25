import {
    FormLabel,
    Select,
    Input,
    Button,
    FormControl,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

function RetiradaModal({
    isOpen,
    onClose,
    finalRef,
    retirada,
    responsaveis,
    chaves,
    reservas,
    refreshList
}) {
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setIsEdit(!!retirada);
    }, [retirada]);

    const validationSchema = Yup.object({
        chave_id: Yup.number().required(),
        responsavel_id: Yup.number().required(),
        hora_prevista_devolucao: Yup.string().required(),
        status: Yup.string().required(),
    });

    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/retiradas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Retirada registrada!", { theme: "colored" });
                refreshList();
            } else {
                toast.error("Erro ao registrar retirada!", { theme: "colored" });
                console.log(dataToSend);
            }
        } catch (err) {
            toast.error("Erro ao registrar retirada!", { theme: "colored" });
            console.log(dataToSend);
        }
    };

    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(
                `http://localhost:5000/retiradas/${retirada.retirada_id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend),
                }
            );

            if (response.ok) {
                toast.success("Retirada atualizada!", { theme: "colored" });
                refreshList();
            } else {
                toast.error("Erro ao atualizar retirada!", { theme: "colored" });
            }
        } catch (err) {
            toast.error("Erro ao atualizar retirada!", { theme: "colored" });
        }
    };

    const handleSave = async (values) => {
        const chaveSelecionada = chaves.find(c => c.chave_id === Number(values.chave_id));
        if (!chaveSelecionada) {
            toast.error("Chave inválida!", { theme: "colored" });
            return;
        }

        const agora = new Date();
        const horaRetirada = isEdit ? values.hora_retirada : agora.toTimeString().slice(0, 8);

        const formatTime = (time) => {
            if (!time) return null;
            return time.length === 5 ? time + ":00" : time;
        };

        const horaPrevista = formatTime(values.hora_prevista_devolucao);

        const [hrRetirada, minRetirada] = horaRetirada.split(":").map(Number);
        const [hrPrev, minPrev] = horaPrevista.split(":").map(Number);
        const minutosRetirada = hrRetirada * 60 + minRetirada;
        const minutosPrevista = hrPrev * 60 + minPrev;

        if (minutosPrevista <= minutosRetirada) {
            toast.error("A hora prevista de devolução deve ser maior que a hora de retirada!", { theme: "colored" });
            return;
        }

        const baseData = {
            chave_id: Number(values.chave_id),
            responsavel_id: Number(values.responsavel_id),
            reserva_id: values.reserva_id ? Number(values.reserva_id) : null,
            data_retirada: isEdit ? values.data_retirada : agora.toISOString().split("T")[0],
            hora_retirada: horaRetirada,
            hora_prevista_devolucao: horaPrevista,
            status: isEdit ? values.status : "retirada",
        };

        try {
            if (isEdit) {
                const updatePayload = {
                    ...baseData,
                    ...(values.status === "devolvida" && {
                        hora_devolucao: new Date().toTimeString().slice(0, 8)
                    })
                };
                await updateData(updatePayload);
            } else {
                await postData(baseData);
            }
            onClose();
        } catch (err) {
            console.error("Erro ao salvar retirada:", err);
            toast.error("Erro ao salvar retirada!", { theme: "colored" });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalRef}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isEdit ? "Editar Retirada" : "Nova Retirada"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            chave_id: retirada?.chave_id || '',
                            responsavel_id: retirada?.responsavel_id || '',
                            reserva_id: retirada?.reserva_id || '',
                            data_retirada: retirada?.data_retirada || '',
                            hora_retirada: retirada?.hora_retirada || '',
                            hora_prevista_devolucao: retirada?.hora_prevista_devolucao || '',
                            hora_devolucao: retirada?.hora_devolucao || '',
                            status: retirada?.status || 'retirada',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                    >
                        <Form>

                            <FormControl mt={4}>
                                <FormLabel>Chave</FormLabel>
                                <Field as={Select} name="chave_id">
                                    <option value="">Selecione</option>
                                    {chaves?.filter(c => !c.is_retirada)?.map(chave => (
                                        <option key={chave.chave_id} value={chave.chave_id}>
                                            {chave.chave_nome}
                                        </option>
                                    ))}
                                </Field>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Responsável</FormLabel>
                                <Field as={Select} name="responsavel_id">
                                    <option value="">Selecione</option>
                                    {responsaveis?.map((resp) => (
                                        <option key={resp.responsavel_id} value={resp.responsavel_id}>
                                            {resp.responsavel_nome}
                                        </option>
                                    ))}
                                </Field>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Reserva (Opcional)</FormLabel>
                                <Field as={Select} name="reserva_id">
                                    <option value="">Nenhuma</option>
                                    {reservas?.map((reserva) => (
                                        <option key={reserva.reserva_id} value={reserva.reserva_id}>
                                            Reserva #{reserva.reserva_id}
                                        </option>
                                    ))}
                                </Field>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Hora Prevista Devolução</FormLabel>
                                <Field as={Input} type="time" name="hora_prevista_devolucao" />
                            </FormControl>

                            {/* Hora Devolução só na edição */}
                            {isEdit && (
                                <FormControl mt={4}>
                                    <FormLabel>Hora Devolução</FormLabel>
                                    <Field as={Input} type="time" name="hora_devolucao" />
                                </FormControl>
                            )}

                            {/* Status só na edição */}
                            {isEdit && (
                                <FormControl mt={4}>
                                    <FormLabel>Status</FormLabel>
                                    <Field as={Select} name="status">
                                        <option value="retirada">Retirada</option>
                                        <option value="devolvida">Devolvida</option>
                                        <option value="atrasada">Atrasada</option>
                                    </Field>
                                </FormControl>
                            )}

                            <ModalFooter>
                                <Button colorScheme="green" mr={3} type="submit">
                                    Salvar
                                </Button>
                                <Button colorScheme="red" onClick={onClose}>
                                    Cancelar
                                </Button>
                            </ModalFooter>

                        </Form>
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default RetiradaModal;