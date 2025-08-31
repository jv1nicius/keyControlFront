/* eslint-disable */

import {
    Flex,
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { DeleteIcon, EditIcon, CheckIcon } from "@chakra-ui/icons";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';

import ReservaModal from 'components/modal/ReservaModal';
import { useDisclosure } from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ColumnTable(props) {
    const { columnsData, headerInfo = {} } = props;
    const [reservasExibir, setReservasExibir] = useState([]);
    const [reservasBruta, setReservasBruta] = useState([]);

    const [sorting, setSorting] = React.useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef();
    const [selectedReserva, setSelectedReserva] = useState('')
    const [responsaveis, setResponsaveis] = useState([]);

    const onEditClick = async (data) => {
        const reservaData = reservasBruta.filter(r => r.reserva_id === data.id)
        const salaData = await fetchSala(data.sala)
        const responsavelData = await fetchResponsavel(reservaData[0].responsavel_id)
        const reservaModalData = {
            "is_edit": true,
            "reserva_id": reservaData[0].reserva_id,
            "sala_nome": salaData.sala_nome,
            "sala_id": salaData.sala_id,
            "responsavel_id": responsavelData.responsavel_id,
            "data_hora_inicio": reservaData[0].data_hora_inicio,
            "data_hora_fim": reservaData[0].data_hora_fim
        }
        setSelectedReserva(reservaModalData);
        console.log(reservaModalData);
        onOpen();
    };

    const getHoraMinutoUTC = (dateStr) => {
        const match = dateStr.match(/(\d{2}:\d{2}):\d{2}/);
        return match ? match[1] : '';
    }

    
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch("http://localhost:5000/reservas");
                const data = await response.json();
                setReservasBruta(data)
    
                const hoje = new Date();
                const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
                const reservasDoDia = data.filter((reserva) => {
                    const inicio = new Date(reserva.data_hora_inicio);
                    const inicioUTC = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
                    return inicioUTC === hojeUTC;
                });
    
                const reservasFormatadas = reservasDoDia.map((reserva) => ({
                    id: reserva.reserva_id,
                    sala: reserva.sala_id,
                    responsavel_id: reserva.responsavel_id,
                    hora_inicio: getHoraMinutoUTC(reserva.data_hora_inicio),
                    hora_fim: getHoraMinutoUTC(reserva.data_hora_fim),
                }));
                setReservasExibir(reservasFormatadas);
    
            } catch (error) {
                console.error("Erro ao buscar as reservas:", error);
            }
        };
    
        fetchReservas();

        fetchResponsaveis();
    }, []);


    const fetchSala = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/salas/${id}` );
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao buscar a sala:", error);
        }
    };

    const fetchResponsavel = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis/${id}` );
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao buscar a sala:", error);
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

    const handleDelete = async (id) => {
        console.log(id);
        try {
            const response = await fetch(`http://localhost:5000/reservas/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                toast.success("Reserva Excluída!", {theme: "colored"})
            } else {
                toast.error("Erro ao Excluir Reserva", {theme: "colored"})
            }
        } catch (error) {
            console.error("Erro ao excluir a Reserva:", error);
        }
    };


    const handleCheck = async (id) => {
        const data = {reserva_id: id, data_hora_finalizacao: new Date()}
        console.log(data);
        try {
            const response = await fetch(`http://localhost:5000/finalizacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Erro ao Finalizar Reserva!", {theme: "colored"})
                throw new Error("Erro ao finalizar")
            };

            const responseData = await response.json();
            console.log('Finalizado:', responseData);
            toast.success("Reserva Finalizada!", {theme: "colored"})
        } catch (err) {
            console.error('Erro:', err);
        }
    }
    
    

    const columns = React.useMemo(() => {
        return props.columnsData.map((col) =>
            columnHelper.accessor(col.accessor, {
                id: col.accessor,
                header: () => (
                    <Text
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                    >
                        {col.Header}
                    </Text>
                ),
                cell: (info) => (
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                        {info.getValue()}
                    </Text>
                ),
            })
        );
    }, [props.columnsData, textColor]);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setData(reservasExibir);
    }, [reservasExibir]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    return (
        <>
            <ToastContainer />
            <Card
                flexDirection="column"
                w="100%"
                px="0px"
                overflowX={{ sm: 'scroll', lg: 'hidden' }}
            >
                <Flex px="25px" mb="8px" justifyContent="space-between" align="center" marginX={12}>
                    <ReservaModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} finalRef={finalRef} reserva={selectedReserva} responsaveis={responsaveis} />
                    <Text
                        color={textColor}
                        fontSize="22px"
                        mb="4px"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        {headerInfo.diaSemana || ""}
                    </Text>
                    <Text
                        color={textColor}
                        fontSize="16px"
                        fontWeight="500"
                        lineHeight="100%"
                    >
                        {headerInfo?.data || ""}
                    </Text>
                </Flex>
                <Box>
                    <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                        <Thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                pe="10px"
                                                borderColor={borderColor}
                                                cursor="pointer"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <Flex
                                                    justifyContent="space-between"
                                                    align="center"
                                                    fontSize={{ sm: '10px', lg: '12px' }}
                                                    color="gray.400"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: '',
                                                        desc: '',
                                                    }[header.column.getIsSorted()] ?? null}
                                                </Flex>
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody>
                            {table
                                .getRowModel()
                                .rows.slice(0, 15)
                                .map((row) => {
                                    return (
                                        <Tr key={row.id}>
                                            {row.getVisibleCells().map((cell) => {
                                                return (
                                                    <Td
                                                        key={cell.id}
                                                        fontSize={{ sm: '14px' }}
                                                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                                                        borderColor="transparent"
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </Td>
                                                );
                                            })}
                                            <ButtonGroup variant="ghost" spacing="3">
                                                <Button 
                                                    colorScheme='teal'
                                                    onClick={() => onEditClick(row.original)}
                                                >
                                                    {<EditIcon />}
                                                </Button>
                                                <Button 
                                                    colorScheme="red"
                                                    onClick={() => {handleDelete(row.original.id)}}
                                                >
                                                    {<DeleteIcon />}
                                                </Button>
                                                <Button 
                                                    colorScheme="green"
                                                    onClick={() => {handleCheck(row.original.id)}}
                                                >
                                                    {<CheckIcon />}
                                                </Button>
                                            </ButtonGroup>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
        </>
    );
}
