"use server"

import { prisma } from "@/lib/prisma"
import { traineeSchema, trainerSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"
import * as argon2 from "argon2"
import { redirect } from "next/navigation"

export async function registerAction(formData: any, role: "trainee" | "trainer") {
  const schema = role === "trainer" ? trainerSchema : traineeSchema
  const validatedFields = schema.safeParse(formData)

  if (!validatedFields.success) return { error: "Nieprawidłowe dane wejściowe." }

  const data = validatedFields.data
  const hashedPassword = await argon2.hash(data.password)

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name.trim(),
          surname: data.surname.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          password: hashedPassword,
          role: role,
        },
      })

      if (role === "trainer") {
        const d = data as any;
        await tx.trainer.create({ data: { id: newUser.id } });
        await tx.workplace.create({
          data: {
            trainer_id: newUser.id,
            name: d.workplaceName.trim(),
            street: d.street.trim(),
            building_number: d.buildingNumber.trim(),
            flat_number: d.flatNumber.trim() || null,
            city: d.city.trim(),
          }
        });
      } else {
        const d = data as any;
        await tx.trainee.create({
          data: { id: newUser.id, birthdate: new Date(d.birthdate) },
        });
      }
    })
  } catch (error: any) {console.log("LOG BŁĘDU PRISMA:", error.code, error.meta);
    if (error.code === 'P2002') return { error: "Ten e-mail jest już zajęty!" }
    return { error: "Wystąpił błąd podczas rejestracji, spróbuj ponownie." }
  }

  redirect("/?registered=true")
}