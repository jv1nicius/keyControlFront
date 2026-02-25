import {
    Box,
    Flex,
    Grid,
    SimpleGrid,
    useColorModeValue,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import NFT from "../retiradas/components/NFT";
import RetiradaModal from "components/modal/RetiradaModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Retiradas() {
    const [retiradas, setRetiradas] = useState([]);
    const [responsaveis, setResponsaveis] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [chaves, setChaves] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [retiradaSelecionada, setRetiradaSelecionada] = useState(null);

    const textColor = useColorModeValue("navy.700", "white");

    useEffect(() => {
        fetchRetiradas();
        fetchResponsaveis();
        fetchChaves();
        fetchReservas();
    }, []);

    const fetchRetiradas = async () => {
        try {
            const response = await fetch("http://localhost:5000/retiradas");
            const data = await response.json();
            setRetiradas(data);
        } catch (error) {
            console.error("Erro ao buscar retiradas:", error);
        }
    };

    const fetchResponsaveis = async () => {
        try {
            const response = await fetch("http://localhost:5000/responsavel");
            const data = await response.json();
            setResponsaveis(data);
        } catch (error) {
            console.error("Erro ao buscar responsáveis:", error);
        }
    };

    const fetchReservas = async () => {
        try {
            const response = await fetch("http://localhost:5000/reservas");
            const data = await response.json();
            setReservas(data);
        } catch (error) {
            console.error("Erro ao buscar reservas:", error);
        }
    };

    const fetchChaves = async () => {
        try {
            const response = await fetch("http://localhost:5000/chaves");
            const data = await response.json();
            setChaves(data);
        } catch (error) {
            console.error("Erro ao buscar chaves:", error);
        }
    };

    const handleDelete = async (retirada) => {
        if (retirada.status !== "devolvida") {
            toast.error("Só é possível deletar retiradas já devolvidas!", { theme: "colored" });
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:5000/retiradas/${retirada.retirada_id}`,
                { method: "DELETE" }
            );
            if (!response.ok) throw new Error();
            toast.success("Retirada deletada!", { theme: "colored" });
            fetchRetiradas();
        } catch {
            toast.error("Erro ao deletar retirada!", { theme: "colored" });
        }
    };

    const handleDevolver = async (retirada_id) => {
        try {
            const agora = new Date();
            const horaAtual = agora.toTimeString().slice(0, 8);

            const response = await fetch(
                `http://localhost:5000/retiradas/${retirada_id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'devolvida', hora_devolucao: horaAtual }),
                }
            );

            if (!response.ok) throw new Error();

            setRetiradas(prev =>
                prev.map(r =>
                    r.retirada_id === retirada_id
                        ? { ...r, status: 'devolvida', hora_devolucao: horaAtual }
                        : r
                )
            );

            toast.success("Retirada devolvida!", { theme: "colored" });
        } catch (err) {
            console.error(err);
            toast.error("Erro ao devolver retirada!", { theme: "colored" });
        }
    };

    const getNomeResponsavel = (id) => {
        const resp = responsaveis.find(r => r.responsavel_id === id);
        return resp ? resp.responsavel_nome : `ID ${id}`;
    };

    return (
        <>
            <ToastContainer />
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <Grid mb='20px' gridTemplateColumns="1fr" gap={{ base: "20px", xl: "20px" }}>
                    <Flex flexDirection='column'>
                        <Flex justify="flex-start" mb="20px">
                            <Button
                                colorScheme="green"
                                variant="outline"
                                onClick={() => {
                                    setRetiradaSelecionada(null);
                                    onOpen();
                                }}
                            >
                                + Nova Retirada
                            </Button>
                        </Flex>

                        <SimpleGrid columns={1} gap='20px'>
                            {retiradas.map((retirada) => (
                                <NFT
                                    key={retirada.retirada_id}
                                    retirada_id={retirada.retirada_id}
                                    responsavel={getNomeResponsavel(retirada.responsavel_id)}
                                    data_retirada={retirada.data_retirada}
                                    hora_retirada={retirada.hora_retirada}
                                    hora_prevista_devolucao={retirada.hora_prevista_devolucao}
                                    hora_devolucao={retirada.hora_devolucao}
                                    status={retirada.status}
                                    onDelete={() => handleDelete(retirada)}
                                    onDevolver={() => handleDevolver(retirada.retirada_id)}
                                />
                            ))}
                        </SimpleGrid>
                    </Flex>
                </Grid>

                <RetiradaModal
                    isOpen={isOpen}
                    onClose={onClose}
                    retirada={retiradaSelecionada}
                    refreshList={fetchRetiradas}
                    chaves={chaves}
                    responsaveis={responsaveis}
                    reservas={reservas}
                />
            </Box>
        </>
    );
}