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
import { Switch } from "@chakra-ui/react";

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
    function validarCPF(cpf) {
        if (!cpf) return false;

        // Remove tudo que não for número
        cpf = cpf.replace(/[^\d]+/g, '');

        // Deve ter 11 dígitos
        if (cpf.length !== 11) return false;

        // Elimina CPFs com todos os números iguais
        if (/^(\d)\1+$/.test(cpf)) return false;

        // Validação do 1º dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        // Validação do 2º dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    const validationSchema = Yup.object({
        nome: Yup.string().required("O nome é obrigatório"),
        siape: Yup.string().required("O Siape é obrigatório").min(7, "Siape deve ter pelo menos 7 caracteres"),
        cpf: Yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido").required("O CPF é obrigatório")
            .test("cpf-valido", "CPF inválido", (value) => validarCPF(value)),
        dataNas: Yup.date().required("A data de nascimento é obrigatória").nullable(),
        ativo: Yup.boolean(),
    });

    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsavel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                toast.error("Erro ao Cadastrar Responsável!", { theme: "colored" })
                throw new Error("Erro ao salvar")
            };

            const responseData = await response.json();
            console.log('Criado:', responseData);
            toast.success("Cadastro Realizado!", { theme: "colored" })
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsavel/${obj.responsavel_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                toast.error("Erro ao Atualizar Responsável!", { theme: "colored" })
                throw new Error("Erro ao atualizar");
            }

            const responseData = await response.json();
            console.log('Atualizado:', responseData);
            toast.success("Dados do Responsável Atualizados!", { theme: "colored" })
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    const handleSubmit = async (values, actions) => {
        if (isEdit) {
            const responsavel = {
                responsavel_nome: values.nome,
                responsavel_data_nascimento: values.dataNas,
                ativo: values.ativo
            };
            await updateData(responsavel);
        } else {
            const responsavel = {
                responsavel_nome: values.nome,
                responsavel_siap: values.siape,
                responsavel_cpf: values.cpf,
                responsavel_data_nascimento: values.dataNas,
                ativo: values.ativo,
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
                                ativo: obj?.ativo ?? true,
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
                                        <FormLabel>Siap</FormLabel>
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

                                    <FormControl mt={4} display="flex" alignItems="center">
                                        <FormLabel mb="0">Ativo</FormLabel>
                                        <Switch
                                            name="ativo"
                                            isChecked={values.ativo}
                                            onChange={(e) => setFieldValue("ativo", e.target.checked)}
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
        </>
    );
}

export default ProfessorModal;
