"use server"

import * as argon2 from "argon2"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { changePasswordSchema } from "@/lib/validations"
import { redirect } from "next/navigation"

export async function changePasswordAction(input: unknown) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/?unauthorized=true")
  }

  const validated = changePasswordSchema.safeParse(input)
  if (!validated.success)
    return { error: "Nieprawidłowe dane wejściowe." as const }

  const { currentPassword, newPassword, logoutOtherDevices } = validated.data
  const currentRefreshToken = (session as { refreshToken?: string | null }).refreshToken ?? null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password)
    return { error: "Nie można zmienić hasła dla tego konta." as const }

  const ok = await argon2.verify(user.password, currentPassword)
  if (!ok) return { error: "Obecne hasło jest nieprawidłowe" as const }

  const hashed = await argon2.hash(newPassword)

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    if (logoutOtherDevices && currentRefreshToken) {
      await prisma.refresh_token.deleteMany({
        where: {
          user_id: session.user.id,
          token: {
            not: currentRefreshToken,
          },
        },
      })
    }
  } catch {
    return { error: "Nie udało się zmienić hasła. Spróbuj ponownie." as const }
  }

  return { success: true as const }
}
