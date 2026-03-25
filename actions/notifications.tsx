"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"


export async function getNotificationsAction(page: number = 0) {
  const session = await auth(); 
  if (!session) throw new Error("UNAUTHORIZED")
    
  try {
    const limit = 1
    const notifications = await prisma.notification.findMany({
      where: { user_id: session.user.id },
      take: limit + 1, 
      skip: page * limit,
      orderBy: { created_at: 'desc' }, 
    })

    const hasMore = notifications.length > limit
    const notificationsToDisplay = hasMore ? notifications.slice(0, limit) : notifications
    const grouped = groupNotificationsByDate(notificationsToDisplay)
  
    return { grouped, hasMore }
    
  } catch(error) {
    return { 
      grouped: {}, 
      hasMore: false,
      error: "Nie udało się pobrać danych. Spróbuj odświeżyć stronę"
    }
  } 
}

function groupNotificationsByDate(notifications: any[]) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: Record<string, any[]> = {}

  notifications.forEach((notif) => {
    const date = new Date(notif.created_at)
    let label = ""

    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isToday) {
      label = "DZISIAJ"
    } else if (isYesterday) {
      label = "WCZORAJ"
    } else {
      const dayName = date.toLocaleDateString("pl-PL", { weekday: "short" }).replace('.', '') 
      label = `${dayName}, ${formatDate(date)}`
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(notif)
  })

  return groups
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
}