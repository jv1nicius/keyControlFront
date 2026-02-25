// Chakra imports
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    Button,
    Badge,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import { ButtonGroup, Icon } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

export default function ReservaCard(props) {
    const {
        sala,
        responsavel,
        hora_inicio,
        hora_fim,
        data_inicio,
        status = "ativa",
        onOpen,
    } = props;

    const textColor = useColorModeValue("navy.700", "white");

    const badgeColor = status === "ativa"
        ? "green"
        : status === "cancelada"
            ? "red"
            : "gray";

    return (
        <Card p="20px" mb="10px">
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
                <Box mb={{ base: "10px", md: "0" }}>
                    <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="bold"
                    >
                        {sala}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Responsável: {responsavel}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Data: {data_inicio} | Horário: {hora_inicio} - {hora_fim}
                    </Text>
                </Box>

                <Flex align="center" gap="10px">
                    <Badge colorScheme={badgeColor} variant="subtle">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>

                    <ButtonGroup variant="ghost" spacing="3">
                        <Button
                            colorScheme="teal"
                            onClick={props.onEditClick}
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={props.onDelete}
                        >
                            <DeleteIcon />
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Flex>
        </Card>
    );
}