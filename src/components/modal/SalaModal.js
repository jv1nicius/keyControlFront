import {
    FormLabel,
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
    Switch
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

function SalaModal({ isOpen, onClose, finalRef, sala, refreshList }) {

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setIsEdit(!!sala);
    }, [sala]);

    const validationSchema = Yup.object({
        sala_nome: Yup.string().required("Nome obrigatório"),
    });

    const handleSubmit = async (values) => {

        const payload = {
            sala_nome: values.sala_nome,
            disponivel: values.disponivel
        };

        try {

            const response = await fetch(
                isEdit
                    ? `http://localhost:5000/salas/${sala.sala_id}`
                    : `http://localhost:5000/salas`,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error();

            toast.success(
                isEdit ? "Sala atualizada!" : "Sala criada!",
                { theme: "colored" }
            );

            refreshList();
            onClose();

        } catch {
            toast.error("Erro ao salvar sala!", { theme: "colored" });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalRef}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isEdit ? "Editar Sala" : "Nova Sala"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            sala_nome: sala?.sala_nome || "",
                            disponivel: sala?.disponivel ?? true,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>

                                <FormControl mt={4}>
                                    <FormLabel>Nome da Sala</FormLabel>
                                    <Field as={Input} name="sala_nome" />
                                </FormControl>

                                <FormControl mt={4} display="flex" alignItems="center">
                                    <FormLabel mb="0">
                                        Disponível
                                    </FormLabel>
                                    <Switch
                                        isChecked={values.disponivel}
                                        onChange={(e) =>
                                            setFieldValue("disponivel", e.target.checked)
                                        }
                                        colorScheme="green"
                                    />
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
    );
}

export default SalaModal;