"use client"

import { useSession } from "next-auth/react"
import {
  Users,
  MessageSquare,
  ChevronRight,
  Bell,
  MessageCircle,
  Calendar,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import TrainerStats from "@/components/pages/trainer-stats"
import TraineeStats from "@/components/pages/trainee-stats"
import {
  getNotificationsAction,
  getUnreadCountAction,
} from "@/actions/notifications"
import { useEffect, useState, useRef } from "react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const [mobileTab, setMobileTab] = useState<"notifications" | "stats">(
    "notifications"
  )
  const [notificationsGrouped, setNotificationsGrouped] = useState<
    Record<string, any[]>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const unreadCountRef = useRef<number | null>(null)

  useEffect(() => {
    fetchUnreadCount(true)
    loadNotifications(0)

    const intervalId = setInterval(() => {
      fetchUnreadCount(false)
    }, 100000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchUnreadCount = async (isInitialLoad: boolean) => {
    const response = await getUnreadCountAction()

    if (response.error) {
      if (response.error === "401") {
        window.location.href = "/?unauthorized=true"
        return
      }
    }

    const newCount = response.count

    if (
      !isInitialLoad &&
      unreadCountRef.current !== null &&
      newCount !== unreadCountRef.current
    ) {
      loadNotifications(0, true)
    }

    unreadCountRef.current = newCount
    setUnreadCount(newCount)
  }

  const loadNotifications = async (
    pageNum: number,
    isBackgroundRefresh = false
  ) => {
    if (pageNum === 0 && !isBackgroundRefresh) setIsLoading(true)
    else if (!isBackgroundRefresh) setIsFetchingMore(true)

    if (!isBackgroundRefresh) setError(null)

    try {
      const response = await getNotificationsAction(pageNum)

      if (response.error) {
        if (response.error === "401")
          window.location.href = "/?unauthorized=true"
        else if (!isBackgroundRefresh) setError(response.error)
        return
      }

      const { grouped, hasMore: moreAvailable } = response

      setNotificationsGrouped((prev) => {
        const newState = { ...prev }
        Object.entries(grouped as Record<string, any[]>).forEach(
          ([label, items]) => {
            if (newState[label]) {
              const existingIds = new Set(newState[label].map((n: any) => n.id))
              const uniqueNewItems = items.filter(
                (item: any) => !existingIds.has(item.id)
              )

              if (pageNum === 0) {
                newState[label] = [...uniqueNewItems, ...newState[label]]
              } else {
                newState[label] = [...newState[label], ...uniqueNewItems]
              }
            } else {
              newState[label] = items
            }
          }
        )
        return newState
      })

      if (!isBackgroundRefresh) {
        setHasMore(moreAvailable)
        setPage(pageNum)
      }
    } catch (error: any) {
      if (!isBackgroundRefresh)
        setError("Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.")
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Users size={16} />
      case "comment":
        return <MessageSquare size={16} />
      case "message":
        return <MessageCircle size={16} />
      default:
        return <Bell size={16} />
    }
  }

  const renderNotifications = () => (
    <section>
      <div className="mb-5 hidden items-center justify-center gap-3 lg:flex">
        <h2 className="font-michroma text-2xl">Powiadomienia</h2>
        <span className="border-baby-blue text-baby-blue font-michroma flex h-8 min-w-8 items-center justify-center rounded-full border-2 px-2 text-sm font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      </div>

      <Card className="h-[707px] overflow-hidden">
        <CardContent className="h-full pr-1">
          <div className="custom-scrollbar h-full space-y-6 overflow-y-auto pr-5">
            {error && (
              <Alert variant="destructive" className="mx-auto">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <Loader2 className="mx-auto mt-10 animate-spin" />
            ) : (
              <>
                {Object.entries(notificationsGrouped).map(([label, items]) => (
                  <div key={label} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <span className="text-gold text-xs font-medium uppercase">
                        {label}
                      </span>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-3">
                      {items.map((notif: any) => (
                        <button
                          key={notif.id}
                          className={`bg-dirty-blue hover:bg-hover group flex w-full items-center justify-between rounded-xl p-4 text-left transition-all ${
                            !notif.is_read
                              ? "border-baby-blue border-2"
                              : "border border-zinc-800"
                          }`}
                        >
                          <div className="space-y-3 text-sm">
                            <div
                              className={`flex gap-2 font-semibold ${!notif.is_read ? "text-baby-blue" : "text-zinc-300"}`}
                            >
                              {notif.title} {getNotificationIcon(notif.type)}
                            </div>
                            <p className="leading-relaxed text-zinc-400">
                              {notif.message}
                            </p>
                          </div>
                          <ChevronRight
                            className={`shrink-0 ${!notif.is_read ? "text-baby-blue" : "text-zinc-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {hasMore && !error && (
                  <div className="flex justify-center pb-4">
                    <button
                      onClick={() => loadNotifications(page + 1)}
                      disabled={isFetchingMore}
                      className="text-baby-blue hover:bg-dark-navy/70 bg-dirty-navy/70 rounded-lg px-4 py-3 text-sm"
                    >
                      {isFetchingMore ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Załaduj więcej"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )

  const renderStats = () => (
    <section>
      <h2 className="font-michroma mb-5 hidden justify-center text-2xl text-white lg:flex">
        Statystyki
      </h2>
      <Card className="h-[707px]">
        <CardContent>
          <div className="bg-dirty-blue flex items-center justify-between rounded-xl py-4">
            <span className="pr-2 pl-5 text-sm text-zinc-300 uppercase">
              Kolejny trening
            </span>
            <div className="bg-dirty-navy/60 text-baby-blue mr-4 flex items-center gap-2 rounded-lg px-3 py-3">
              <Calendar size={16} />
              <span className="mt-1 whitespace-nowrap">20.20.2026, 18:00</span>
            </div>
          </div>
          {role === "trainer" ? <TrainerStats /> : <TraineeStats />}
        </CardContent>
      </Card>
    </section>
  )

  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col justify-center">
      <div className="block lg:hidden">
        <Tabs
          value={mobileTab}
          onValueChange={(v) => setMobileTab(v as any)}
          className="w-full"
        >
          <TabsList className="bg-dark-navy font-michroma border-baby-blue/40 z-1 mb-8 grid w-full grid-cols-2 border">
            <TabsTrigger value="notifications" className="text-xs">
              Powiadomienia{" "}
              <span>{unreadCount > 99 ? "99+" : unreadCount}</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              Statystyki
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notifications">
            {renderNotifications()}
          </TabsContent>
          <TabsContent value="stats">{renderStats()}</TabsContent>
        </Tabs>
      </div>
      <div className="hidden gap-12 lg:grid lg:grid-cols-2">
        {renderNotifications()}
        {renderStats()}
      </div>
    </div>
  )
}

// "use client"

// import {
//   Users,
//   MessageSquare,
//   ChevronRight,
//   Bell,
//   MessageCircle,
//   Calendar,
// } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import TrainerStats from "@/components/pages/trainer-stats"
// import TraineeStats from "@/components/pages/trainee-stats"
// import { Separator } from "@/components/ui/separator"
// import { useEffect, useState } from "react"
// import { getNotificationsAction } from "@/actions/notifications"

// interface Notification {
//   id: string
//   user_id: string
//   title: string
//   message: string
//   redirect_url: string | null
//   type: "request" | "comment" | "message" | "other"
//   isRead: boolean
//   created_at: string
// }

// const today = new Date()
// const yesterday = new Date(today)
// yesterday.setDate(yesterday.getDate() - 1)

// //MOCK DATA
// const initialNotifications: Notification[] = [
//   {
//     id: "uuid-1",
//     user_id: "user-1",
//     title: "Nowa prośba o współpracę",
//     message: "Adam Kowalski chce nawiązać współpracę. Sprawdź listę.",
//     redirect_url: "/dashboard/clients/requests",
//     type: "request",
//     isRead: false,
//     created_at: today.toISOString(),
//   },
//   {
//     id: "uuid-2",
//     user_id: "user-2",
//     title: "Nowy komentarz",
//     message: "Anna zostawiła nowy komentarz pod planem.",
//     redirect_url: "/dashboard/plans/123",
//     type: "comment",
//     isRead: false,
//     created_at: today.toISOString(),
//   },
//   {
//     id: "uuid-3",
//     user_id: "user-3",
//     title: "Nowa wiadomość",
//     message: "Anna Kowalska wysłała nową wiadomość.",
//     redirect_url: null,
//     type: "message",
//     isRead: true,
//     created_at: yesterday.toISOString(),
//   },
//   {
//     id: "uuid-4",
//     user_id: "user-3",
//     title: "Nowa wiadomość",
//     message: "Anna Kowalska wysłała nową wiadomość.",
//     redirect_url: null,
//     type: "message",
//     isRead: true,
//     created_at: "04/03/2026",
//   },
//   {
//     id: "uuid-5",
//     user_id: "user-3",
//     title: "Nowa wiadomość",
//     message: "Anna Kowalska wysłała nową wiadomość.",
//     redirect_url: null,
//     type: "message",
//     isRead: true,
//     created_at: "04/03/2026",
//   },
//   {
//     id: "uuid-6",
//     user_id: "user-3",
//     title: "Nowa wiadomość",
//     message: "Anna Kowalska wysłała nową wiadomość.",
//     redirect_url: null,
//     type: "message",
//     isRead: true,
//     created_at: "06/03/2026",
//   },
// ]

// export default function DashboardPage() {
//   const role: "trainer" | "trainee" = "trainer" //TO-DO: change role recognition

//   const [mobileTab, setMobileTab] = useState<"notifications" | "stats">(
//     "notifications"
//   )

//   const [notifications, setNotifications] =
//     useState<Notification[]>(initialNotifications)

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "request":
//         return <Users size={16} />
//       case "comment":
//         return <MessageSquare size={16} />
//       case "message":
//         return <MessageCircle size={16} />
//       default:
//         return <Bell size={16} />
//     }
//   }

//   //TO-DO: Implement redirecting to new url and updating isRead status
//   const handleNotificationClick = (id: string, url: string | null) => {
//     setNotifications((prev) =>
//       prev.map((notif) =>
//         notif.id === id ? { ...notif, isRead: true } : notif
//       )
//     )
//     if (url) console.log(`Przekierowuję do: ${url}`)
//   }

//   const formatDateGroup = (dateString: string) => {
//     const date = new Date(dateString)
//     const dateFormatted = date.toLocaleDateString("pl-PL", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     })
//     if (date.toDateString() === today.toDateString())
//       return `Dzisiaj, ${dateFormatted}`
//     if (date.toDateString() === yesterday.toDateString())
//       return `Wczoraj, ${dateFormatted}`
//     return dateFormatted
//   }

//   const groupedNotifications = notifications.reduce(
//     (acc, notif) => {
//       const groupKey = formatDateGroup(notif.created_at)
//       if (!acc[groupKey]) acc[groupKey] = []
//       acc[groupKey].push(notif)
//       return acc
//     },
//     {} as Record<string, Notification[]>
//   )

//   const unreadCount = notifications.filter((n) => !n.isRead).length

//   // POWIADOMIENIA
//   const renderNotifications = () => (
//     <section>
//       <div className="mb-5 hidden items-center justify-center gap-3 lg:flex">
//         <h2 className="font-michroma text-2xl">Powiadomienia</h2>
//         <span className="border-baby-blue text-baby-blue font-michroma flex h-8 min-w-8 items-center justify-center rounded-full border-2 px-2 text-sm font-bold">
//           {unreadCount > 99 ? "99+" : unreadCount}
//         </span>
//       </div>

//       <Card className="h-[707px] overflow-hidden">
//         <CardContent className="h-full pr-1">
//           <div className="custom-scrollbar h-full space-y-6 overflow-y-auto pr-5">
//             {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
//               <div key={dateLabel} className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <Separator className="flex-1" />
//                   <span className="text-gold text-sm">{dateLabel}</span>
//                   <Separator className="flex-1" />
//                 </div>

//                 <div className="space-y-3">
//                   {notifs.map((notif) => (
//                     <button
//                       key={notif.id}
//                       onClick={() =>
//                         handleNotificationClick(notif.id, notif.redirect_url)
//                       }
//                       className={`bg-dirty-blue hover:bg-hover group flex w-full items-center justify-between rounded-xl p-4 text-left ${
//                         !notif.isRead
//                           ? "border-baby-blue border-2"
//                           : "border-zinc-800"
//                       }`}
//                     >
//                       <div className="space-y-3 text-sm">
//                         <div
//                           className={`flex gap-2 font-semibold ${!notif.isRead ? "text-baby-blue" : "text-zinc-300"}`}
//                         >
//                           {notif.title} {getNotificationIcon(notif.type)}
//                         </div>
//                         <p className="text-zinc-400">{notif.message}</p>
//                       </div>
//                       <ChevronRight
//                         className={`shrink-0 ${!notif.isRead ? "text-baby-blue" : "text-zinc-300"}`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             {notifications.length === 0 && (
//               <p className="text-md py-4 text-center text-zinc-400">
//                 Brak powiadomień
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </section>
//   )

//   //STATYSTYKI
//   const renderStats = () => (
//     <section>
//       <h2 className="font-michroma mb-5 hidden justify-center text-2xl text-white lg:flex">
//         Statystyki
//       </h2>
//       <Card className="h-[707px]">
//         <CardContent>
//           {/* Kolejny trening */}
//           <div className="bg-dirty-blue flex items-center justify-between rounded-xl py-4">
//             <span className="pr-2 pl-5 text-sm text-zinc-300 uppercase">
//               Kolejny trening
//             </span>
//             <div className="bg-dirty-navy/60 text-baby-blue mr-4 flex items-center gap-2 rounded-lg px-3 py-3">
//               <Calendar size={16} />
//               <span className="mt-1 whitespace-nowrap">20.20.2026, 18:00</span>
//             </div>
//           </div>

//           {/* Statystyki dla roli*/}
//           {role === "trainer" ? <TrainerStats /> : <TraineeStats />}
//         </CardContent>
//       </Card>
//     </section>
//   )

//   //RENDER
//   return (
//     <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col justify-center">
//       {/*MOBILE*/}
//       <div className="block lg:hidden">
//         <Tabs
//           value={mobileTab}
//           onValueChange={(v) => setMobileTab(v as "notifications" | "stats")}
//           className="w-full"
//         >
//           <TabsList className="bg-dark-navy font-michroma border-baby-blue/40 z-1 mb-8 grid w-full grid-cols-2 border">
//             <TabsTrigger value="notifications" className="text-xs">
//               Powiadomienia{" "}
//               <span>{unreadCount > 99 ? "99+" : unreadCount}</span>
//             </TabsTrigger>
//             <TabsTrigger value="stats" className="text-xs">
//               Statystyki
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="notifications">
//             {mobileTab === "notifications" ? renderNotifications() : null}
//           </TabsContent>

//           <TabsContent value="stats">
//             {mobileTab === "stats" ? renderStats() : null}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/*DESKTOP*/}
//       <div className="hidden gap-12 lg:grid lg:grid-cols-2">
//         {renderNotifications()}
//         {renderStats()}
//       </div>
//     </div>
//   )
// }
