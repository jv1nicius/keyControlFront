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
    useColorModeValue,
    Text,
    SimpleGrid,
    useDisclosure
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/card/Card.js";
import Banner from "views/admin/professores/components/Banner";
import NFT from "views/admin/home/components/NFT";
import chavesImg from "assets/img/nfts/key.jpg";
import resposaveisImg from "assets/img/nfts/responsaveis.jpg";
import historicoImg from "assets/img/nfts/agenda.png";

export default function UserReports() {
    const textTitulo = "Sistema de Reserva de Chaves";
    const textSecundary = "Bem-vindo ao sistema de controle de chaves!";
    const textSecundary2 = "Aqui você pode cadastrar responsáveis, reservar chaves para salas específicas, acompanhar o histórico de uso e gerenciar devoluções com facilidade.";
    // Chakra Color Mode
    const brandColor = useColorModeValue("brand.500", "white");
    const textColor = useColorModeValue("navy.700", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Banner
                titulo={textTitulo}
                paragrafo={textSecundary}
                paragrafo2={textSecundary2}
            />
            <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap='20px'
                marginTop={10}
                mb={{ base: "20px", xl: "0px" }}>
                <NFT
                    image={chavesImg}
                    name={"🔐 Reservas de Chaves"}
                    text={"Crie reservas associando responsáveis e salas. Veja quais chaves estão disponíveis em tempo real."} />
                <NFT
                image={resposaveisImg}
                    name={"👤 Responsáveis"}
                    text={"Cadastre e gerencie quem pode retirar chaves, com edição e exclusão conforme necessário."}
                />
                <NFT
                image={historicoImg}
                    name={"📋 Histórico"}
                    text={"Acompanhe todas as reservas finalizadas, incluindo datas de retirada e devolução."}
                />
            </SimpleGrid>
        </Box>
    );
}
