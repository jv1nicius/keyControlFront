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
} from "@chakra-ui/react";
import React, { useState, useEffect, useMemo } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { historicoService } from "services/historicoService";
import Card from "components/card/Card";


const columnHelper = createColumnHelper();

export default function ColumnTable({ columnsData, headerInfo = {} }) {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await historicoService.getAll();

                const historicoFormatado = result.map((item) => ({
                    id: item.retirada_id,
                    data: item.data_retirada,
                    hora_retirada: item.hora_retirada?.slice(0, 5),
                    hora_prevista: item.hora_prevista_devolucao?.slice(0, 5),
                    hora_devolucao: item.hora_devolucao?.slice(0, 5) || "-",
                    status: item.status,
                    sala: item.sala_nome,
                    chave: item.chave_nome,
                    responsavel: item.responsavel_nome,
                }));

                setData(historicoFormatado);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            }
        };

        fetchData();
    }, []);

    const columns = useMemo(() => {
        return columnsData.map((col) =>
            columnHelper.accessor(col.accessor, {
                id: col.accessor,
                header: () => (
                    <Text fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
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
    }, [columnsData, textColor]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>

            <Card flexDirection="column" w="100%" px="0px">
                {/* HEADER */}
                <Flex
                    px="25px"
                    mb="8px"
                    justifyContent="space-between"
                    align="center"
                >
                    <Text
                        color={textColor}
                        fontSize="22px"
                        fontWeight="700"
                    >
                        {headerInfo.diaSemana || ""}
                    </Text>

                    <Text
                        color={textColor}
                        fontSize="16px"
                        fontWeight="500"
                    >
                        {headerInfo?.data || ""}
                    </Text>
                </Flex>

                {/* TABLE */}
                <Box overflowX="auto">
                    <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                        <Thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th
                                            key={header.id}
                                            borderColor={borderColor}
                                            cursor="pointer"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>

                        <Tbody>
                            {table.getRowModel().rows.slice(0, 15).map((row) => (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Td key={cell.id} borderColor="transparent">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
        </>
    );
}