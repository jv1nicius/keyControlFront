import {
    Box,
    Flex,
    Grid,
    SimpleGrid,
    useColorModeValue,
    useDisclosure,
    Button
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import NFT from "../salas/components/NFT";
import SalaModal from "components/modal/SalaModal";
import classroomIcon from "assets/img/nfts/classroomIcon-removebg-preview.png";
import { ToastContainer, toast } from "react-toastify";

export default function Salas() {

    const [salas, setSalas] = useState([]);
    const [salaSelecionada, setSalaSelecionada] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();

    const textColor = useColorModeValue("navy.700", "white");

    const fetchSalas = async () => {
        try {
            const response = await fetch("http://localhost:5000/salas");
            const data = await response.json();
            setSalas(data);
        } catch (error) {
            console.error("Erro ao buscar as salas:", error);
        }
    };

    const handleDelete = async (sala) => {
        try {
            const response = await fetch(
                `http://localhost:5000/salas/${sala.sala_id}`,
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error();

            toast.success("Sala excluída!", { theme: "colored" });
            fetchSalas();

        } catch {
            toast.error("Erro ao excluir sala!", { theme: "colored" });
        }
    };

    const handleEdit = (sala) => {
        setSalaSelecionada(sala);
        onOpen();
        fetchSalas();
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    return (
        <>
            <ToastContainer />
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <Flex justify="space-between" align="center" mb="20px">
                    <Button
                        colorScheme="green"
                        variant="outline"
                        onClick={() => {
                            setSalaSelecionada(null);
                            onOpen();
                        }}
                    >
                        + Nova Sala
                    </Button>
                </Flex>

                <Grid gap="20px">
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px">
                        {salas.map((sala) => (
                            <NFT
                                key={sala.sala_id}
                                name={sala.sala_nome}
                                image={classroomIcon}
                                disponivel={sala.disponivel}
                                onEditClick={() => handleEdit(sala)}
                                onDelete={() => handleDelete(sala)}
                            />
                        ))}
                    </SimpleGrid>
                </Grid>

                <SalaModal
                    isOpen={isOpen}
                    onClose={onClose}
                    finalRef={finalRef}
                    sala={salaSelecionada}
                    refreshList={fetchSalas}
                />
            </Box>
        </>
    );
}