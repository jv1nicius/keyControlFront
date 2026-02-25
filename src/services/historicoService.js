import { api } from "./api";

export const historicoService = {
    async getAll() {
        const response = await fetch(api.historico);

        if (!response.ok) {
            throw new Error("Erro ao buscar histórico");
        }

        return response.json();
    },
};