import { z } from 'zod'

export const withdrawalSchema = z.object({
    chave_id: z.number(),
    responsavel_id: z.number(),
    reserva_id: z.number().nullable().optional(),
    data_retirada: z.string(),
    hora_retirada: z.string(),
    hora_prevista_devolucao: z.string().optional(),
    hora_devolucao: z.string().nullable().optional(),
    status: z.enum(["retirada", "devolvida", "atrasada"]),
});
