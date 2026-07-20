import { z } from "zod";

export const FREQUENCIA_VALUES = ["única", "semanal", "quinzenal", "mensal"];
export const STATUS_VALUES = ["ativa", "cancelada", "finalizada"];
export const DIA_SEMANA_LABELS = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  7: "Domingo",
};

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const reservaBaseSchema = z.object({
  sala_id: z
    .number({
      required_error: "O campo sala_id é obrigatório.",
      invalid_type_error: "sala_id deve ser um número inteiro.",
    })
    .int("sala_id deve ser um número inteiro.")
    .positive("sala_id deve ser um número inteiro positivo."),

  responsavel_id: z
    .number({
      required_error: "O campo responsavel_id é obrigatório.",
      invalid_type_error: "responsavel_id deve ser um número inteiro.",
    })
    .int("responsavel_id deve ser um número inteiro.")
    .positive("responsavel_id deve ser um número inteiro positivo."),

  hora_inicio: z
    .string({ required_error: "O campo hora_inicio é obrigatório." })
    .regex(TIME_REGEX, "hora_inicio deve estar no formato HH:MM ou HH:MM:SS."),

  hora_fim: z
    .string({ required_error: "O campo hora_fim é obrigatório." })
    .regex(TIME_REGEX, "hora_fim deve estar no formato HH:MM ou HH:MM:SS."),

  data_inicio: z
    .string({ required_error: "O campo data_inicio é obrigatório." })
    .regex(DATE_REGEX, "data_inicio deve estar no formato YYYY-MM-DD."),

  data_fim: z
    .string()
    .regex(DATE_REGEX, "data_fim deve estar no formato YYYY-MM-DD.")
    .optional(),

  frequencia: z.enum(FREQUENCIA_VALUES, {
    required_error: "O campo frequencia é obrigatório.",
    message: "O campo frequencia aceita apenas: única, semanal, quinzenal ou mensal.",
  }),

  status: z
    .enum(STATUS_VALUES, {
      required_error: "O campo status é obrigatório.",
      message: "O campo status aceita apenas: ativa, cancelada ou finalizada.",
    })
    .default("ativa"),

  dias_semana: z
    .array(
      z
        .number({
          invalid_type_error: "Cada elemento de dias_semana deve ser um número inteiro.",
        })
        .int("Cada dia deve ser um número inteiro.")
        .min(1, "O valor mínimo para dias_semana é 1 (Segunda-feira).")
        .max(7, "O valor máximo para dias_semana é 7 (Domingo).")
    )
    .optional(),
});

function validarReserva(data, ctx) {
  if (data.hora_inicio && data.hora_fim && data.hora_inicio >= data.hora_fim) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["hora_fim"],
      message: "hora_fim deve ser posterior a hora_inicio.",
    });
  }

  if (data.frequencia && data.frequencia !== "única") {
    if (!data.data_fim) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_fim"],
        message: "data_fim é obrigatório quando a frequência não é 'única'.",
      });
    } else if (data.data_inicio && data.data_fim < data.data_inicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_fim"],
        message: "data_fim deve ser igual ou posterior a data_inicio.",
      });
    }
  }

  if (
    (data.frequencia === "semanal" || data.frequencia === "quinzenal") &&
    (!data.dias_semana || data.dias_semana.length === 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dias_semana"],
      message: "dias_semana é obrigatório para frequência semanal ou quinzenal.",
    });
  }

  if (data.dias_semana && data.dias_semana.length > 0) {
    const unique = new Set(data.dias_semana);
    if (unique.size !== data.dias_semana.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dias_semana"],
        message: "dias_semana não pode conter valores duplicados.",
      });
    }
  }
}

export const createReservaSchema = reservaBaseSchema.superRefine(validarReserva)

export const updateReservaSchema = reservaBaseSchema.partial().superRefine(validarReserva)