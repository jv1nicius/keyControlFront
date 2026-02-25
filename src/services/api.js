const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
    historico: `${API_BASE_URL}/historico`,
    historicos: `${API_BASE_URL}/historicos`,
    salas: `${API_BASE_URL}/salas`,
    responsaveis: `${API_BASE_URL}/responsaveis`,
};