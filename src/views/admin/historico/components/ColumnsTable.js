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

import HistoricoModal from 'components/modal/HistoricoModal';
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
    const [selectedHistorico, setSelectedHistorico] = useState('')
    const [responsaveis, setResponsaveis] = useState([]);
    const [salas, setSalas] = useState([]);

    const onEditClick = async (data) => {
        setSelectedHistorico(data);
        onOpen();
        /* const reservaData = reservasBruta.filter(r => r.reserva_id === data.id);

        if (reservaData.length === 0) {
            console.error('Reserva não encontrada para id:', data.id);
            return;
        }

        try {
            // Aqui você usa o ID real da sala, não o nome
            const salaData = await fetchSala(reservaData[0].sala_id);
            const responsavelData = await fetchResponsavel(reservaData[0].responsavel_id);

            if (!salaData || !responsavelData) {
                console.error('Sala ou responsável não encontrados');
                return;
            }

            const reservaModalData = {
                is_edit: true,
                reserva_id: reservaData[0].reserva_id,
                sala_nome: salaData.sala_nome,
                sala_id: salaData.sala_id,
                responsavel_id: responsavelData.responsavel_id,
                data_hora_inicio: reservaData[0].data_hora_inicio,
                data_hora_fim: reservaData[0].data_hora_fim,
            };

            setSelectedReserva(reservaModalData);
            onOpen();
        } catch (error) {
            console.error("Erro ao buscar dados da reserva:", error);
        } */
    };


    const getHoraMinutoUTC = (dateStr) => {
        const match = dateStr.match(/(\d{2}:\d{2}):\d{2}/);
        return match ? match[1] : '';
    }


    const fetchSala = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/salas/${id}`);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao buscar a sala:", error);
        }
    };

    const fetchResponsavel = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/responsaveis/${id}`);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao buscar a responsável:", error);
        }
    };

    const fetchSalas = async () => {
        try {
            const response = await fetch("http://localhost:5000/salas");
            const data = await response.json();
            setSalas(data);
        } catch (error) {
            console.error("Erro ao buscar as salas:", error)
        }
    }

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
            const response = await fetch(`http://localhost:5000/historicos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Reserva Excluída!", { theme: "colored" })
            } else {
                toast.error("Erro ao Excluir Reserva", { theme: "colored" })
            }
        } catch (error) {
            console.error("Erro ao excluir a Reserva:", error);
        }
    };


    const handleCheck = async (id) => {
        const data = { reserva_id: id, data_hora_finalizacao: new Date() }
        console.log(data);
        try {
            const response = await fetch(`http://localhost:5000/finalizacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Erro ao Finalizar Reserva!", { theme: "colored" })
                throw new Error("Erro ao finalizar")
            };

            const responseData = await response.json();
            console.log('Finalizado:', responseData);
            toast.success("Reserva Finalizada!", { theme: "colored" })
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
    
    useEffect(() => {

        const fetchHistorico = async () => {
            try {
                const response = await fetch("http://localhost:5000/historicos");
                const data = await response.json();
                setReservasBruta(data);

                const reservasFormatadas = await Promise.all(
                    data.map(async (reserva) => {
                        const salaData = await fetchSala(reserva.sala_id);
                        const responsavelData = await fetchResponsavel(reserva.responsavel_id);

                        return {
                            id: reserva.historico_id,
                            reserva_id: reserva.reserva_id,
                            sala: salaData.sala_nome,
                            sala_id: salaData.sala_id,
                            responsavel_id: responsavelData.responsavel_nome,
                            responsavel_nome: responsavelData.responsavel_id,
                            hora_inicio: getHoraMinutoUTC(reserva.data_hora_inicio),
                            hora_fim: getHoraMinutoUTC(reserva.data_hora_fim),
                            data_hora_inicio:reserva.data_hora_inicio,
                            data_hora_fim: reserva.data_hora_fim
                        };
                    })
                );

                setReservasExibir(reservasFormatadas);
                console.log(reservasFormatadas);
                
            } catch (error) {
                console.error("Erro ao buscar o histórico:", error);
            }
        };

        fetchHistorico();
        fetchResponsaveis();
        fetchSalas();
    }, [isOpen]);



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
                    <HistoricoModal
                        isOpen={isOpen}
                        onClose={onClose}
                        finalRef={finalRef}
                        historico={selectedHistorico}
                        responsaveis={responsaveis}
                        salas={salas}
                    />

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
                                    console.log(row);
                                    
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
                                                    onClick={() => { handleDelete(row.original.id) }}
                                                >
                                                    {<DeleteIcon />}
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
