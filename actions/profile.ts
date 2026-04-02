"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { traineePersonalDataSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateTraineeDataAction(input: unknown) {
  const session = await auth()
  if (!session?.user?.id) return { error: "401" as const }

  const validated = traineePersonalDataSchema.safeParse(input)
  if (!validated.success) return { error: "Nieprawidłowe dane wejściowe." as const }

  const data = validated.data

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: data.name.trim(),
          surname: data.surname.trim(),
          phone: data.phone.trim(),
        },
      })

      await tx.trainee.update({
        where: { id: session.user.id },
        data: { birthdate: new Date(data.birthdate) },
      })
    })
  } catch (e: any) {
    return {
      error: "Nie udało się zapisać danych. Spróbuj ponownie." as const,
    }
  }

  revalidatePath("/dashboard/profile")
  return { success: true as const }
}

