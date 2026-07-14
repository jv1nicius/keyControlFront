import { useEffect, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import FilterListIcon from "@mui/icons-material/FilterList";

import { api } from "../services/api";

import { getStatusChipColor } from "../layouts/theme/statusChip";

const STATUS_LABELS = {
    devolvida: "Devolvida",
    retirada: "Em andamento",
    atrasada: "Atrasada",
};

function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
    if (!hora) return "-";
    return hora.slice(0, 5); // "16:16:00" -> "16:16"
}

export default function History() {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [statusFiltro, setStatusFiltro] = useState("todos");
    const [salaFiltro, setSalaFiltro] = useState("todas");

    const [pagina, setPagina] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(10);

    useEffect(() => {
        carregarHistorico()
    }, [statusFiltro, salaFiltro, pagina])

    const carregarHistorico = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const { data } = await api.get("/historico");
            setHistorico(data);
        } catch (err) {
            setErro("Não foi possível carregar o histórico. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    const statusDisponiveis = useMemo(() => {
        return Array.from(new Set(historico.map((item) => item.status)));
    }, [historico]);

    const salasDisponiveis = useMemo(() => {
        return Array.from(new Set(historico.map((item) => item.sala_nome))).sort();
    }, [historico]);

    const historicoFiltrado = useMemo(() => {
        return historico
            .filter((item) => statusFiltro === "todos" || item.status === statusFiltro)
            .filter((item) => salaFiltro === "todas" || item.sala_nome === salaFiltro)
            .sort((a, b) => {
                const chaveA = `${a.data_retirada}T${a.hora_retirada}`;
                const chaveB = `${b.data_retirada}T${b.hora_retirada}`;
                return chaveB.localeCompare(chaveA); // mais recentes primeiro
            });
    }, [historico, statusFiltro, salaFiltro]);

    const historicoPaginado = historicoFiltrado.slice(
        pagina * itensPorPagina,
        pagina * itensPorPagina + itensPorPagina
    );

    const handleStatusChange = (event) => {
        setStatusFiltro(event.target.value);
        setPagina(0);
    };

    const handleSalaChange = (event) => {
        setSalaFiltro(event.target.value);
        setPagina(0);
    };

    return (
        <>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ sm: "center" }}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                    <FilterListIcon fontSize="small" />
                    <Typography variant="body2">Filtros:</Typography>
                </Stack>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        label="Status"
                        value={statusFiltro}
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        {statusDisponiveis.map((status) => (
                            <MenuItem key={status} value={status}>
                                {STATUS_LABELS[status] ?? status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="sala-label">Sala</InputLabel>
                    <Select
                        labelId="sala-label"
                        label="Sala"
                        value={salaFiltro}
                        onChange={handleSalaChange}
                    >
                        <MenuItem value="todas">Todas</MenuItem>
                        {salasDisponiveis.map((sala) => (
                            <MenuItem key={sala} value={sala}>
                                {sala}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {erro && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {erro}
                </Alert>
            )}

            {carregando ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper variant="outlined">
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sala</TableCell>
                                    <TableCell>Chave</TableCell>
                                    <TableCell>Responsável</TableCell>
                                    <TableCell>Retirada</TableCell>
                                    <TableCell>Devolução prevista</TableCell>
                                    <TableCell>Devolução real</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historicoPaginado.map((item) => {
                                    const label = STATUS_LABELS[item.status] ?? item.status;
                                    const color = getStatusChipColor(item.status);
                                    return (
                                        <TableRow key={item.retirada_id} hover>
                                            <TableCell>{item.sala_nome}</TableCell>
                                            <TableCell>{item.chave_nome}</TableCell>
                                            <TableCell>{item.responsavel_nome}</TableCell>
                                            <TableCell>
                                                {formatarData(item.data_retirada)} às{" "}
                                                {formatarHora(item.hora_retirada)}
                                            </TableCell>
                                            <TableCell>
                                                {formatarHora(item.hora_prevista_devolucao)}
                                            </TableCell>
                                            <TableCell>{formatarHora(item.hora_devolucao)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={label}
                                                    color={color}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {historicoPaginado.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                Nenhum registro encontrado para esse filtro.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={historicoFiltrado.length}
                        page={pagina}
                        onPageChange={(_, novaPagina) => setPagina(novaPagina)}
                        rowsPerPage={itensPorPagina}
                        onRowsPerPageChange={(event) => {
                            setItensPorPagina(parseInt(event.target.value, 10));
                            setPagina(0);
                        }}
                        rowsPerPageOptions={[10, 25, 50]}
                        labelRowsPerPage="Itens por página"
                    />
                </Paper>
            )}
        </>
    );
}