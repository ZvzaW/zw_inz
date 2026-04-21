import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import TrainerProfile from "@/components/pages/profile/trainer-profile"
import TraineeProfile from "@/components/pages/profile/trainee-profile"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/?unauthorized=true")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      trainee: true, 
      trainer: {
        include: {
          workplace: true, 
        }
      },
    }
  })

  if (!user) {
    redirect("/?unauthorized=true")
  }

  const baseUserData = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }

  return (
    <div className="w-full p-3 flex flex-col justify-center min-h-[calc(100vh-15rem)]">
      {user.role === "trainer" && user.trainer ? (
        <TrainerProfile baseData={baseUserData} specificData={user.trainer} />
      ) : user.role === "trainee" && user.trainee ? (
        <TraineeProfile baseData={baseUserData} specificData={user.trainee} />
      ) : (
        <p className="text-zinc-400">Brak szczegółowych danych profilu dla tej roli.</p>
      )}
    </div>
  )
}