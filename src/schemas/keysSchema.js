import { z } from "zod";

export const keysSchema = z.object({
    sala_id: z
        .coerce
        .number()
        .int("O ID da sala deve ser um número inteiro")
        .positive("O ID da sala deve ser maior que zero"),
    disponivel: z.boolean(),
})