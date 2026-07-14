import { z } from 'zod'

export const classroomSchema = z.object({
    sala_nome: z
        .string()
        .min(2, 'Nome é obrigatório')
        .max(100, 'Nome muito longo'),
    disponivel: z.boolean(),
})