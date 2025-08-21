import {
    Avatar,
    Box,
    Flex,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    useColorModeValue,
    Text, Input,
    useDisclosure, Button, FormControl,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import {  AddIcon } from "@chakra-ui/icons";
function ProfessorModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef()
    const finalRef = React.useRef();

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button display="flex" rightIcon={<AddIcon />} colorScheme="green" variant="outline" onClick={onOpen}>
                    Adicionar
                </Button>
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{ "Adicionar Professor" }</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Nome</FormLabel>
                            <Input ref={initialRef} placeholder="Nome" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Siape</FormLabel>
                            <Input placeholder="123445" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>CPF</FormLabel>
                            <Input placeholder="111111111-11" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Data de nascimento</FormLabel>
                            <Input placeholder="13/01/2000" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="green" mr={3}>
                            Salvar
                        </Button>
                        <Button colorScheme="yellow" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfessorModal;