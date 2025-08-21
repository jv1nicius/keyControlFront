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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ColumnTable(props) {
    const { columnsData, headerInfo = {} } = props;
    const [reservas, setReservas] = useState([]);
    const [sorting, setSorting] = React.useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch("http://localhost:3001/reservas");
                const data = await response.json();
                setReservas(data);
            } catch (error) {
                console.error("Erro ao buscar as salas:", error);
            }
        };

        fetchReservas();
    }, []);

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
        setData(reservas);
    }, [reservas]);

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
        <Card
            flexDirection="column"
            w="100%"
            px="0px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
            <Flex px="25px" mb="8px" justifyContent="space-between" align="center" marginX={12}>
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
                                            <Button colorScheme='teal'>{<EditIcon />}</Button>
                                            <Button colorScheme="red">{<DeleteIcon />}</Button>
                                        </ButtonGroup>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </Box>
        </Card>
    );
}
