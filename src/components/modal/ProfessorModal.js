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
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AddIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from 'react-toastify';

function ProfessorModal({ obj, isOpen, onClose, onOpen, finalRef }) {
    const initialRef = useRef();
    const [isEdit, setIsEdit] = useState(false);
    

    useEffect(() => {
        console.log(obj);
        if (obj) {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [obj]);

    const validationSchema = Yup.object({
        nome: Yup.string().required("O nome é obrigatório"),
        siape: Yup.string().required("O Siape é obrigatório").min(7, "Siape deve ter pelo menos 7 caracteres"),
        cpf: Yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido").required("O CPF é obrigatório"),
        dataNas: Yup.date().required("A data de nascimento é obrigatória").nullable(),
    });

    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                toast.error("Erro ao Cadastrar Responsável!", {theme: "colored"})
                throw new Error("Erro ao salvar")
            };

            const responseData = await response.json();
            console.log('Criado:', responseData);
            toast.success("Cadastro Realizado!", {theme: "colored"})
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis/${obj.responsavel_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                toast.error("Erro ao Atualizar Responsável!", {theme: "colored"})
                throw new Error("Erro ao atualizar");
            }

            const responseData = await response.json();
            console.log('Atualizado:', responseData);
            toast.success("Dados do Responsável Atualizados!", {theme: "colored"})
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const handleSubmit = async (values, actions) => {
        if (isEdit) {
            const responsavel = {
                responsavel_nome: values.nome,
                responsavel_data_nascimento: values.dataNas,
            };
            await updateData(responsavel);
        } else {
            const responsavel = {
                responsavel_nome: values.nome,
                responsavel_siap: values.siape,
                responsavel_cpf: values.cpf,
                responsavel_data_nascimento: values.dataNas,
            };
            await postData(responsavel);
        }

        actions.resetForm();
        onClose();
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button rightIcon={<AddIcon />} colorScheme="green" variant="outline" onClick={onOpen}>
                    Adicionar
                </Button>
            </div>

            <ToastContainer />

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEdit ? "Editar Professor" : "Adicionar Professor"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{
                                nome: obj?.responsavel_nome || '',
                                siape: obj?.responsavel_siap || '',
                                cpf: obj?.responsavel_cpf || '',
                                dataNas: obj?.responsavel_data_nascimento || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, handleChange, handleBlur, setFieldValue, touched, errors }) => (
                                <Form>
                                    <FormControl isInvalid={touched.nome && errors.nome}>
                                        <FormLabel>Nome</FormLabel>
                                        <Field as={Input} name="nome" placeholder="Nome" />
                                        <ErrorMessage name="nome" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl mt={4} isInvalid={touched.siape && errors.siape}>
                                        <FormLabel>Siape</FormLabel>
                                        <Input
                                            name="siape"
                                            value={values.siape}
                                            placeholder="1234567"
                                            maxLength={7}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '');
                                                setFieldValue("siape", raw.slice(0, 7));
                                            }}
                                        />
                                        <ErrorMessage name="siape" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl mt={4} isInvalid={touched.cpf && errors.cpf}>
                                        <FormLabel>CPF</FormLabel>
                                        <Input
                                            name="cpf"
                                            value={values.cpf}
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, '');
                                                let formatted = rawValue;
                                                if (rawValue.length <= 11) {
                                                    formatted = rawValue
                                                        .replace(/^(\d{3})(\d)/, '$1.$2')
                                                        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                                                        .replace(/\.(\d{3})(\d)/, '.$1-$2');
                                                }
                                                setFieldValue('cpf', formatted);
                                            }}
                                        />
                                        <ErrorMessage name="cpf" component="div" style={{ color: 'red' }} />
                                    </FormControl>

                                    <FormControl mt={4} isInvalid={touched.dataNas && errors.dataNas}>
                                        <FormLabel>Data de Nascimento</FormLabel>
                                        <Field as={Input} name="dataNas" type="date" />
                                        <ErrorMessage name="dataNas" component="div" style={{ color: 'red' }} />
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

export default ProfessorModal;
