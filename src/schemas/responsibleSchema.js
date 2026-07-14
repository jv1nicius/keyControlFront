import { z } from "zod"

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    // Bloqueia CPFs como 111.111.111-11
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    if (resto !== Number(cpf[9])) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    return resto === Number(cpf[10]);
}

export const responsibleSchema = z.object({
    responsavel_nome: z
        .string()
        .min(4, "O nome deve ter no mínimo 4 caracteres")
        .max(255, "O nome deve ter no máximo 255 caracteres"),

    responsavel_siap: z
        .string()
        .length(7, "O SIAP deve ter exatamente 7 caracteres")
        .optional()
        .or(z.literal("")),

    responsavel_cpf: z
        .string()
        .regex(
            /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            "CPF inválido"
        ).refine((cpf) => validarCPF(cpf), {
            message: "CPF inválido"
        }),

    responsavel_matricula: z
        .string()
        .min(7, "A matrícula deve ter no mínimo 7 dígitos!")
        .max(15, "A senha deve ter no máximp 15 dígitos!")
        .optional()
        .or(z.literal("")),

    responsavel_data_nascimento: z
        .string()
        .min(1, "Informe a data de nascimento"),

    email: z
        .email("Email inválido"),

    senha: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(50, "A senha deve ter no máximo 50 caracteres"),

    ativo: z.boolean().default(true),
})

export const responsibleUpdateSchema = responsibleSchema
    .pick({
        responsavel_nome: true,
        email: true,
        ativo: true,
    })
    .partial();