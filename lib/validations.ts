import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków")
  .max(30, "Hasło może mieć maksymalnie 30 znaków")
  .refine((val) => /[a-z]/.test(val) && /[A-Z]/.test(val) && /\d/.test(val), {
    message: "Hasło musi zawierać małe i wielkie litery oraz cyfry",
  })

const isAtLeast15 = (dateString: string) => {
  const birth = new Date(dateString)
  if (isNaN(birth.getTime())) return false

  const today = new Date()
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 15,
    today.getMonth(),
    today.getDate()
  )

  return birth <= thirteenYearsAgo
}

export const traineeSchema = z.object({
  name: z.string().trim().min(1, "Imię jest wymagane"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  email: z
    .string()
    .trim()
    .min(1, "Adres e-mail jest wymagany")
    .email("Podaj poprawny adres e-mail"),
  phone: z
    .string()
    .trim()
    .min(1, "Numer telefonu jest wymagany")
    .regex(/^[0-9\s+()-]{9,30}$/, "Podaj poprawny numer telefonu"),
  birthdate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine((val) => isAtLeast15(val), {
      message: "Musisz mieć co najmniej 15 lat",
    }),
  password: passwordSchema,
  terms: z.boolean().refine((val) => val === true, {
    message: "Musisz wyrazić zgodę",
  }),
})

export type TraineeFormValues = z.infer<typeof traineeSchema>

export const traineePersonalDataSchema = z.object({
  name: z.string().trim().min(1, "Imię jest wymagane"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  phone: z
    .string()
    .trim()
    .min(1, "Numer telefonu jest wymagany")
    .regex(/^[0-9\s+()-]{9,30}$/, "Podaj poprawny numer telefonu"),
  birthdate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine((val) => isAtLeast15(val), {
      message: "Musisz mieć co najmniej 15 lat",
    }),
})

export type TraineePersonalDataValues = z.infer<typeof traineePersonalDataSchema>

export const trainerSchema = z.object({
  name: z.string().trim().min(1, "Imię jest wymagane"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  email: z
    .string()
    .trim()
    .min(1, "Adres e-mail jest wymagany")
    .email("Podaj poprawny adres e-mail"),
  phone: z
    .string()
    .trim()
    .min(1, "Numer telefonu jest wymagany")
    .regex(/^[0-9\s+()-]{9,30}$/, "Podaj poprawny numer telefonu"),
  password: passwordSchema,
  workplaceName: z.string().trim().min(1, "Nazwa miejsca jest wymagana"),
  street: z.string().trim().min(1, "Ulica jest wymagana"),
  buildingNumber: z.string().trim().min(1, "Numer budynku jest wymagany"),
  flatNumber: z
    .string()
    .trim()
    .max(10, "Numer mieszkania jest zbyt długi")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().min(1, "Miasto jest wymagane"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Musisz wyrazić zgodę",
  }),
})

export type TrainerFormValues = z.infer<typeof trainerSchema>
