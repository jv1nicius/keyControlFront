// Chakra imports
import {
    Box,
    Flex,
    Image,
    Text,
    useColorModeValue,
    Button,
    Badge
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function NFT(props) {

    const {
        image = "",
        name,
        disponivel,
        onEditClick,
        onDelete
    } = props;

    const textColor = useColorModeValue("navy.700", "white");

    return (
        <Card p='20px'>
            <Flex direction="column">

                <Box mb='20px' position='relative' textAlign="center">
                    <Image
                        src={image}
                        w="100px"
                        h="100px"
                        borderRadius='20px'
                        mx="auto"
                    />
                </Box>

                <Flex justify="space-between" align="center" mb="10px">
                    <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight='bold'>
                        {name}
                    </Text>

                    <Badge
                        colorScheme={disponivel ? "green" : "red"}
                        borderRadius="8px"
                        px="10px"
                        py="4px"
                    >
                        {disponivel ? "Disponível" : "Indisponível"}
                    </Badge>
                </Flex>

                <Flex gap="10px" mt="10px">
                    <Button
                        colorScheme="green"
                        size="sm"
                        flex="1"
                        onClick={onEditClick}
                        variant="outline"
                    >
                        Editar
                    </Button>

                    <Button
                        colorScheme="red"
                        size="sm"
                        flex="1"
                        onClick={onDelete}
                        variant="outline"
                    >
                        Excluir
                    </Button>
                </Flex>

            </Flex>
        </Card>
    );
}