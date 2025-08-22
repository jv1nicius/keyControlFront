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

import {  AddIcon } from "@chakra-ui/icons";
function ProfessorModal({ obj, isOpen, onClose, onOpen, finalRef }) {
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef()
    // const finalRef = React.useRef();

    const [nome, setNome] = useState('');
    const [siap, setSiap] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNas, setDataNas] = useState('');
    const [cleanModal, setCleanModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        if (obj) {
            console.log('modal');
            console.log(obj);
            setIsEdit(true);
            setCpf(obj.responsavel_cpf);
            setDataNas(obj.responsavel_data_nascimento);
            setNome(obj.responsavel_nome);
            setSiap(obj.responsavel_siap);
        }
    }, [obj]);
    
    const postData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Resposta do servidor:', responseData);
                setCleanModal(true);
            } else {
                console.error('Erro na requisição:', response.statusText);
                setCleanModal(false);
            }
        } catch (err) {
            console.error('Erro ao enviar dados:', err);
            setCleanModal(false);
        }
    };
    
    const updateData = async (dataToSend) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis/${obj.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Resposta do servidor:', responseData);
                setCleanModal(true);
            } else {
                console.error('Erro na requisição:', response.statusText);
                setCleanModal(false);
            }
        } catch (err) {
            console.error('Erro ao enviar dados:', err);
            setCleanModal(false);
        }
    };

    const handleSave = async () => {
        const responsavel = {
            "responsavel_nome": nome,
            "responsavel_siap": siap,
            "responsavel_cpf": cpf,
            "responsavel_data_nascimento": dataNas
        }

        if (isEdit){
            await updateData(responsavel)
        } else {
            await postData(responsavel)
        }

        if (cleanModal){
            setCpf('')
            setDataNas('')
            setNome('')
            setSiap('')
            setCleanModal(false)
        }
        onClose()
    }

    const handleClose = () => {
        setCpf('')
        setDataNas('')
        setNome('')
        setSiap('')
        onClose()
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button display="flex" rightIcon={<AddIcon />} colorScheme="green" variant="outline" onClick={onOpen}>
                    Adicionar
                </Button>
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={handleClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>{isEdit ? "Editar Professor" : "Adicionar Professor"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Nome"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Siap</FormLabel>
                            <Input
                                value={siap}
                                onChange={(e) => setSiap(e.target.value)}
                                placeholder="123445"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>CPF</FormLabel>
                            <Input
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="111111111-11"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Data de nascimento</FormLabel>
                            <Input
                                value={dataNas}
                                onChange={(e) => setDataNas(e.target.value)}
                                placeholder="13/01/2000"
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="green" mr={3} onClick={handleSave}>
                            Salvar
                        </Button>
                        <Button colorScheme="yellow" onClick={handleClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default ProfessorModal;