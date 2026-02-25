// Chakra imports
import {
    Box,
    Flex,
    Text,
    Button,
    useColorModeValue
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

export default function NFT(props) {
    const {
        retirada_id,
        responsavel,
        data_retirada,
        hora_retirada,
        hora_prevista_devolucao,
        hora_devolucao,
        status,
        onDelete,
        onDevolver
    } = props;

    const textColor = useColorModeValue("navy.700", "white");

    const statusColor = {
        retirada: "orange.400",
        devolvida: "green.400",
        atrasada: "red.400"
    }[status] || "gray.400";

    return (
        <Card p="20px">
            <Flex direction="column">
                <Flex justify="space-between" align="center" mb="10px">
                    <Text color={textColor} fontWeight="bold" fontSize="lg">
                        Retirada #{retirada_id}
                    </Text>
                    <Text color={statusColor} fontWeight="bold">
                        {status.toUpperCase()}
                    </Text>
                </Flex>

                <Text color={textColor} fontSize="sm">
                    <strong>Responsável ID:</strong> {responsavel}
                </Text>
                <Text color={textColor} fontSize="sm">
                    <strong>Data:</strong> {data_retirada}
                </Text>
                <Text color={textColor} fontSize="sm">
                    <strong>Hora Retirada:</strong> {hora_retirada}
                </Text>
                <Text color={textColor} fontSize="sm">
                    <strong>Hora Prevista Devolução:</strong> {hora_prevista_devolucao}
                </Text>
                {hora_devolucao && (
                    <Text color={textColor} fontSize="sm">
                        <strong>Hora Devolução:</strong> {hora_devolucao}
                    </Text>
                )}

                <Flex mt="15px" justify="flex-end" gap="10px">
                    {status !== "devolvida" && (
                        <Button
                            size="sm"
                            colorScheme="green"
                            variant="outline"
                            onClick={onDevolver}
                        >
                            Devolver
                        </Button>
                    )}
                    <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={onDelete}
                        isDisabled={status !== "devolvida"}
                    >
                        Deletar
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}