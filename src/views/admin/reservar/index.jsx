/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
    Box,
    Flex,
    Grid,
    SimpleGrid,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import ReservaModal from "components/modal/ReservaModal";
import React, { useState, useEffect } from "react";
import NFT from "../reservar/components/NFT";
import classroomIcon from "assets/img/nfts/classroomIcon-removebg-preview.png";
import ColumnsTable from "views/admin/reservar/components/ColumnsTable";
import { columnsDataReservas } from "views/admin/reservar/variables/columnsData";

export default function UserReports() {
    const [salas, setSalas] = useState([]);
    const [responsaveis, setResponsaveis] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [finalizacoes, setFinalizacoes] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();
    const [estadosDasSalas, setEstadosDasSalas] = useState({});


    // Chakra Color Mode
    const brandColor = useColorModeValue("brand.500", "white");
    const textColor = useColorModeValue("navy.700", "white");
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
            const response = await fetch("http://localhost:5000/responsaveis");
            const data = await response.json();
            setResponsaveis(data);
        } catch (error) {
            console.error("Erro ao buscar as salas:", error);
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
        fetchFinalizacoes();
    }, []);

    const fetchFinalizacoes = async () => {
        try {
            const response = await fetch("http://localhost:5000/finalizacoes");
            const data = await response.json();
            setFinalizacoes(data);
        } catch (error) {
            console.error("Erro ao buscar as finalizações:", error);
        }
    };

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Grid
                mb='20px'
                gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
                gap={{ base: "20px", xl: "20px" }}
                display={{ base: "block", xl: "grid" }}>
                <Flex
                    flexDirection='column'
                    gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
                        gap='20px'
                        mb='20px'>
                        {salas.map((sala) =>
                            <NFT
                                key={sala.sala_id}
                                name={sala.sala_nome}
                                image={classroomIcon}
                                onOpen={() => {
                                    setReservaSelecionada(sala);
                                    onOpen();
                                }}
                            />
                        )
                        }
                    </SimpleGrid>
                </Flex>
                <Flex
                    flexDirection='column'
                    gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
                    <ColumnsTable columnsData={columnsDataReservas} />
                </Flex>
            </Grid>
            <ReservaModal isOpen={isOpen} onClose={onClose} finalRef={finalRef} reserva={reservaSelecionada} responsaveis={responsaveis} />
        </Box>
    );
}
