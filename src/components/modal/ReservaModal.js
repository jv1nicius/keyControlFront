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

function ReservaModal({ isOpen, onClose, finalRef, reserva }) {
    const initialRef = React.useRef();
    const [responsavel_id, setResponsavelId] = useState('')
    const [data_hora_inicio, setDataHoraInicio] = useState(Date)
    const [data_hora_fim, setDataHoraFim] = useState(Date)
    const [cleanModal, setCleanModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        if (reserva && reserva.is_edit) {
            setIsEdit(true);
            setResponsavelId(reserva.responsavel_id || '');
            setDataHoraInicio(formatDateForInput(reserva.data_hora_inicio)); 
            setDataHoraFim(formatDateForInput(reserva.data_hora_fim)); 
        } else {
            setIsEdit(false);
            setResponsavelId('');
            setDataHoraInicio('');
            setDataHoraFim('');
        }
    }, [reserva]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const isoString = date.toISOString();
        return isoString.slice(0, 16);
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
            const response = await fetch(`http://localhost:5000/reservas/${reserva.reserva_id}`, {
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
        const novaReserva = {
            "sala_id": reserva.sala_id,
            "responsavel_id": responsavel_id,
            "data_hora_inicio": data_hora_inicio,
            "data_hora_fim": data_hora_fim,
        }
        // console.log(reserva.reserva_id);
        // console.log(JSON.stringify(novaReserva));

        if (isEdit){
            await updateData(novaReserva)
        } else {
            await postData(novaReserva)
        }

        if (cleanModal){
            setResponsavelId('')
            setDataHoraInicio(Date)
            setDataHoraFim(Date)
            setCleanModal(false)
        }
        onClose()
    }

    const handleClose = () => {
        setResponsavelId('')
        setDataHoraInicio(Date)
        setDataHoraFim(Date)
        onClose()
    }
    return (
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
                    <FormControl mt={4}>
                        <FormLabel>Responsável Siap</FormLabel>
                        <Input 
                            placeholder="Responsável Siap" 
                            type="number"
                            value={responsavel_id}
                            // defaultValue={reserva?.responsavel_id}
                            onChange={(e) => setResponsavelId(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Data e Hora de Início</FormLabel>
                        <Input
                            placeholder="Data e Hora de Início"
                            type="datetime-local"
                            // defaultValue={reserva?.data_hora_inicio?.slice(0,16)}
                            value={data_hora_inicio}
                            onChange={(e) => setDataHoraInicio(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Data e Hora de Fim</FormLabel>
                        <Input
                            placeholder="Data e Hora de Fim"
                            type="datetime-local"
                            // defaultValue={reserva?.data_hora_fim?.slice(0,16)}
                            value={data_hora_fim}
                            onChange={(e) => setDataHoraFim(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="brand" mr={3} onClick={() => {handleSave()}}>
                        Save
                    </Button>
                    <Button onClick={handleClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ReservaModal;
