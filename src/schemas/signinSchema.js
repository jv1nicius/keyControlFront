import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string()
        .min(1, "Digite seu email")
        .email("Email inválido"),

    senha: z
        .string()
        .min(1, "Digite sua senha"),
});