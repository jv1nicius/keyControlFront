// Chakra imports
import {
    Box,
    Flex,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState } from "react";

export default function NFT(props) {
    const { image = "", name, text} = props;
    const [like, setLike] = useState(false);
    const textColor = useColorModeValue("navy.700", "white");
    const textColorBid = useColorModeValue("brand.500", "white");

    return (
        <Card p='20px'>
            <Flex direction={{ base: "column" }} justify='center'>
                <Box mb={{ base: "20px", "2xl": "20px" }} position='relative'>
                    <Image
                        src={image}
                        w={{ base: "150px", "3xl": "100%" }}
                        h={{ base: "150px", "3xl": "100%" }}
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
                </Flex>
                    <Text
                        color='secondaryGray.600'
                        fontSize={{
                            base: "sm",
                        }}
                        fontWeight='400'
                        me='14px'>
                        {text}
                    </Text>
            </Flex>
        </Card>
    );
}
