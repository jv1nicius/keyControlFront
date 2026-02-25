import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Flex,
    Input,
    Select,
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

function ReservaModal({ isOpen, onClose, finalRef, reserva, responsaveis, salas, onSave }) {
    const initialRef = useRef();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setIsEdit(!!reserva);
    }, [reserva]);

    const validationSchema = Yup.object({
        sala_id: Yup.number().required().positive().integer(),
        responsavel_id: Yup.number().required().positive().integer(),
        data_inicio: Yup.date().required(),
        data_fim: Yup.date()
            .required()
            .min(Yup.ref("data_inicio"), "Data fim deve ser maior ou igual"),
        hora_inicio: Yup.string().required(),
        hora_fim: Yup.string()
            .required()
            .test("hora-fim-maior", "Hora fim deve ser maior que hora início", function (value) {
                const { hora_inicio } = this.parent;
                return value > hora_inicio;
            }),
        frequencia: Yup.string().required(),
        dias_semana: Yup.array().when("frequencia", {
            is: (val) => ["semanal", "quinzenal"].includes(val),
            then: (schema) => schema.min(1, "Selecione ao menos um dia da semana"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const handleSave = async (values) => {
        const novaReserva = {
            sala_id: Number(values.sala_id),
            responsavel_id: Number(values.responsavel_id),
            data_inicio: values.data_inicio,
            data_fim: values.data_fim,
            hora_inicio: values.hora_inicio,
            hora_fim: values.hora_fim,
            frequencia: values.frequencia,
            status: isEdit ? values.status : "ativa",
            dias_semana: ["semanal", "quinzenal", "mensal"].includes(values.frequencia)
                ? values.dias_semana
                : [],
        };

        let responseData = null;

        try {
            const url = isEdit
                ? `http://localhost:5000/reservas/${reserva.reserva_id}`
                : "http://localhost:5000/reservas";

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaReserva),
            });

            if (!response.ok) throw new Error("Erro ao salvar reserva");

            responseData = await response.json();
            toast.success(isEdit ? "Reserva atualizada!" : "Reserva realizada!", { theme: "colored" });

            if (typeof onSave === "function") onSave(responseData);
        } catch (err) {
            console.error(err);
            toast.error(isEdit ? "Erro ao atualizar reserva!" : "Erro ao realizar reserva!", { theme: "colored" });
        }

        onClose();
    };

    return (
        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{reserva?.sala_nome || "Nova Reserva"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            sala_id: reserva?.sala_id || "",
                            responsavel_id: reserva?.responsavel_id || "",
                            data_inicio: reserva?.data_inicio || "",
                            data_fim: reserva?.data_fim || "",
                            hora_inicio: reserva?.hora_inicio || "",
                            hora_fim: reserva?.hora_fim || "",
                            frequencia: reserva?.frequencia || "única",
                            dias_semana: reserva?.dias_semana || [],
                            status: reserva?.status || "ativa",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>
                                <FormControl mt={4}>
                                    <FormLabel>Sala</FormLabel>
                                    <Field as={Select} name="sala_id" placeholder="Selecione uma sala">
                                        {salas.map((sala) => (
                                            <option key={sala.sala_id} value={sala.sala_id}>
                                                {sala.sala_nome}
                                            </option>
                                        ))}
                                    </Field>
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Responsável</FormLabel>
                                    <Field as={Select} name="responsavel_id" placeholder="Selecione um responsável">
                                        {responsaveis.map((resp) => (
                                            <option key={resp.responsavel_id} value={resp.responsavel_id}>
                                                {resp.responsavel_nome}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="responsavel_id" component="div" style={{ color: "red" }} />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Data Início</FormLabel>
                                    <Field as={Input} type="date" name="data_inicio" />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Data Fim</FormLabel>
                                    <Field as={Input} type="date" name="data_fim" />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Hora Início</FormLabel>
                                    <Field as={Input} type="time" name="hora_inicio" />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Hora Fim</FormLabel>
                                    <Field as={Input} type="time" name="hora_fim" />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Frequência</FormLabel>
                                    <Field as={Select} name="frequencia">
                                        <option value="única">Única</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="quinzenal">Quinzenal</option>
                                        <option value="mensal">Mensal</option>
                                    </Field>
                                </FormControl>

                                {["semanal", "quinzenal", "mensal"].includes(values.frequencia) && (
                                    <FormControl mt={4}>
                                        <FormLabel>Dias da Semana</FormLabel>
                                        <Flex gap="10px" wrap="wrap">
                                            {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                                                <Button
                                                    key={dia}
                                                    size="sm"
                                                    colorScheme={values.dias_semana.includes(dia) ? "green" : "gray"}
                                                    variant={values.dias_semana.includes(dia) ? "solid" : "outline"}
                                                    onClick={() => {
                                                        const newValue = values.dias_semana.includes(dia)
                                                            ? values.dias_semana.filter((d) => d !== dia)
                                                            : [...values.dias_semana, dia];
                                                        setFieldValue("dias_semana", newValue);
                                                    }}
                                                >
                                                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][dia - 1]}
                                                </Button>
                                            ))}
                                        </Flex>
                                    </FormControl>
                                )}
                                
                                {isEdit && (
                                    <FormControl mt={4}>
                                        <FormLabel>Status</FormLabel>
                                        <Field as={Select} name="status">
                                            <option value="ativa">Ativa</option>
                                            <option value="finalizada">Finalizada</option>
                                            <option value="cancelada">Cancelada</option>
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
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ReservaModal;