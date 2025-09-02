// Chakra imports
import {
    AvatarGroup,
    Avatar,
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Link,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function NFT(props) {
    const { image = "", name, onOpen, estado = "Livre" } = props;
    const [like, setLike] = useState(false);
    const textColor = useColorModeValue("navy.700", "white");
    const textColorBid = useColorModeValue("brand.500", "white");

    return (
        <Card p='20px'>
            <Flex direction={{ base: "column" }} justify='center'>
                <Box mb={{ base: "20px", "2xl": "20px" }} position='relative'>
                    <Image
                        src={image}
                        w={{ base: "100px", "3xl": "100%" }}
                        h={{ base: "100px", "3xl": "100%" }}
                        borderRadius='20px'
                    />
                </Box>

                <Flex justify="space-between" align="center">
                    <Text
                        color={textColor}
                        fontSize={{
                            base: "xl",
                            md: "lg",
                            lg: "lg",
                            xl: "lg",
                            "2xl": "md",
                            "3xl": "lg",
                        }}
                        mb='5px'
                        fontWeight='bold'
                        me='14px'>
                        {name}
                    </Text>
                    <Button
                        colorScheme="green"
                        variant="outline"
                        onClick={onOpen}
                        isDisabled={estado !== "Livre"}
                    >
                        Reservar
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}
