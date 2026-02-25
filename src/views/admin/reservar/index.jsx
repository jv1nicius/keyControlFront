import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Grid,
    SimpleGrid,
    Button,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import ReservaModal from "components/modal/ReservaModal";
import NFT from "../reservar/components/NFT";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function UserReports() {
    const [salas, setSalas] = useState([]);
    const [responsaveis, setResponsaveis] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();

    // Chakra Color Mode
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

    const fetchSalas = async () => {
        try {
            const response = await fetch("http://localhost:5000/salas");
            const data = await response.json();
            setSalas(data);
        } catch (error) {
            console.error("Erro ao buscar as salas:", error);
        }
    };

    const fetchResponsaveis = async () => {
        try {
            const response = await fetch("http://localhost:5000/responsavel");
            const data = await response.json();
            setResponsaveis(data);
        } catch (error) {
            console.error("Erro ao buscar os responsáveis:", error);
        }
    };

    const fetchReservas = async () => {
        try {
            const response = await fetch("http://localhost:5000/reservas");
            const data = await response.json();
            setReservas(data);
        } catch (error) {
            console.error("Erro ao buscar as reservas:", error);
        }
    };

    useEffect(() => {
        fetchSalas();
        fetchResponsaveis();
        fetchReservas();
    }, []);

    const handleDelete = async (reserva_id) => {
        try {
            const response = await fetch(`http://localhost:5000/reservas/${reserva_id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Erro ao deletar");

            toast.success("Reserva deletada com sucesso!", { theme: "colored" });
            setReservas(reservas.filter(r => r.reserva_id !== reserva_id));
        } catch (err) {
            console.error(err);
            toast.error("Erro ao deletar reserva.", { theme: "colored" });
        }
    };

    const handleEdit = (reserva) => {
        setReservaSelecionada(reserva);
        onOpen();
    };

    const handleSave = (novaReserva) => {
        if (reservaSelecionada) {
            setReservas(reservas.map(r => r.reserva_id === novaReserva.reserva_id ? novaReserva : r));
        } else {
            setReservas([...reservas, novaReserva]);
        }
    };

    return (
        <>
            <ToastContainer />
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <Grid mb='20px' gridTemplateColumns="1fr" gap={{ base: "20px", xl: "20px" }}>
                    <Flex flexDirection='column'>
                        <Flex justify="space-between" align="center" mb="20px">
                            <Button
                                colorScheme="green"
                                variant="outline"
                                onClick={() => {
                                    setReservaSelecionada(null);
                                    onOpen();
                                }}
                            >
                                + Nova Reserva
                            </Button>
                        </Flex>
                        <SimpleGrid columns={1} gap='20px' mb='20px'>
                            {reservas.map((reserva) => {
                                const salaObj = salas.find(sala => sala.sala_id === reserva.sala_id);
                                const responsavelObj = responsaveis.find(r => r.responsavel_id === reserva.responsavel_id);

                                return (
                                    <NFT
                                        key={reserva.reserva_id}
                                        sala={salaObj?.sala_nome}
                                        responsavel={responsavelObj?.responsavel_nome}
                                        hora_inicio={reserva.hora_inicio}
                                        hora_fim={reserva.hora_fim}
                                        data_inicio={reserva.data_inicio}
                                        status={reserva.status}
                                        onEditClick={() => handleEdit(reserva)}
                                        onDelete={() => handleDelete(reserva.reserva_id)}
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </Flex>
                </Grid>

                <ReservaModal
                    isOpen={isOpen}
                    onClose={onClose}
                    finalRef={finalRef}
                    reserva={reservaSelecionada}
                    responsaveis={responsaveis}
                    salas={salas}
                    onSave={handleSave}
                />
            </Box>
        </>
    );
}