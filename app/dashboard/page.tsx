"use client"

import { useState } from "react"
import { Users, MessageSquare, ChevronRight, Bell, MessageCircle, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrainerStats from "@/components/pages/trainer-stats"
import TraineeStats from "@/components/pages/trainee-stats"
import { Separator } from "@/components/ui/separator"


interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  redirect_url: string | null;
  type: "request" | "comment" | "message" | "other";
  isRead: boolean;
  created_at: string; 
}

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

//MOCK DATA
const initialNotifications: Notification[] = [
  {
    id: "uuid-1",
    user_id: "user-1",
    title: "Nowa prośba o współpracę",
    message: "Adam Kowalski chce nawiązać współpracę. Sprawdź listę.",
    redirect_url: "/dashboard/clients/requests",
    type: "request",
    isRead: false,
    created_at: today.toISOString(),
  },
  {
    id: "uuid-2",
    user_id: "user-2",
    title: "Nowy komentarz",
    message: "Anna zostawiła nowy komentarz pod planem.",
    redirect_url: "/dashboard/plans/123",
    type: "comment",
    isRead: false,
    created_at: today.toISOString(),
  },
  {
    id: "uuid-3",
    user_id: "user-3",
    title: "Nowa wiadomość",
    message: "Anna Kowalska wysłała nową wiadomość.",
    redirect_url: null,
    type: "message",
    isRead: true,
    created_at: yesterday.toISOString(),
  },
  {
    id: "uuid-4",
    user_id: "user-3",
    title: "Nowa wiadomość",
    message: "Anna Kowalska wysłała nową wiadomość.",
    redirect_url: null,
    type: "message",
    isRead: true,
    created_at: "04/03/2026",
  },
  {
    id: "uuid-5",
    user_id: "user-3",
    title: "Nowa wiadomość",
    message: "Anna Kowalska wysłała nową wiadomość.",
    redirect_url: null,
    type: "message",
    isRead: true,
    created_at: "04/03/2026",
  },
  {
    id: "uuid-6",
    user_id: "user-3",
    title: "Nowa wiadomość",
    message: "Anna Kowalska wysłała nową wiadomość.",
    redirect_url: null,
    type: "message",
    isRead: true,
    created_at: "06/03/2026",
  }
]

export default function DashboardPage() {
  const role: "trainer" | "trainee" = "trainer" //TO-DO: change role recognition

  const [mobileTab, setMobileTab] = useState<"notifications" | "stats">("notifications")

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request": return <Users size={16} />
      case "comment": return <MessageSquare size={16} />
      case "message": return <MessageCircle size={16} />
      default: return <Bell size={16} />
    }
  }

  //TO-DO: Implement redirecting to new url and updating isRead status
  const handleNotificationClick = (id: string, url: string | null) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
    if (url) console.log(`Przekierowuję do: ${url}`)
  }

  const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString)
    const dateFormatted = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    if (date.toDateString() === today.toDateString()) return `Dzisiaj, ${dateFormatted}`
    if (date.toDateString() === yesterday.toDateString()) return `Wczoraj, ${dateFormatted}`
    return dateFormatted
  }

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const groupKey = formatDateGroup(notif.created_at)
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(notif)
    return acc
  }, {} as Record<string, Notification[]>)

  const unreadCount = notifications.filter(n => !n.isRead).length


  // POWIADOMIENIA
  const renderNotifications = () => (
    <section>
      <div className="items-center gap-3 mb-5 justify-center hidden lg:flex">
        <h2 className="text-2xl font-michroma ">Powiadomienia</h2>
        <span className="flex items-center justify-center min-w-8 h-8 px-2 rounded-full border-2 border-baby-blue text-baby-blue text-sm font-bold font-michroma">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      </div>

      <Card className="h-[707px] overflow-hidden ">
      <CardContent className="h-full pr-1">
    
    <div className="h-full overflow-y-auto custom-scrollbar space-y-6 pr-5">
          {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
            <div key={dateLabel} className="space-y-6">
              <div className="flex items-center gap-4">
                <Separator className="flex-1"/>
                <span className="text-gold text-sm ">{dateLabel}</span>
                <Separator className="flex-1"/>
              </div>

              <div className="space-y-3">
                {notifs.map((notif) => (
                  <button 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id, notif.redirect_url)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl bg-dirty-blue hover:bg-hover group text-left ${
                      !notif.isRead 
                        ? "border-2 border-baby-blue" 
                        : "border-zinc-800"
                    }`}
                  >
                    <div className="space-y-3 text-sm">
                      <div className={`flex gap-2 font-semibold ${!notif.isRead ? "text-baby-blue" : "text-zinc-300"}`}>
                        {notif.title} {getNotificationIcon(notif.type)}
                      </div>
                      <p className="text-zinc-400">{notif.message}</p>
                    </div>
                    <ChevronRight className={`shrink-0 ${!notif.isRead ? "text-baby-blue" : "text-zinc-300"}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-zinc-400 text-md py-4">Brak powiadomień</p>
          )}
          </div>
        </CardContent>
      </Card>
    </section>
  )

  //STATYSTYKI
  const renderStats = () => (
    <section>
      <h2 className="text-2xl font-michroma text-white mb-5 hidden lg:flex justify-center">Statystyki</h2>
      <Card className="h-[707px]">
        <CardContent>
          
          {/* Kolejny trening */}
          <div className="flex items-center justify-between bg-dirty-blue py-4 rounded-xl">
              <span className="text-zinc-300 text-sm uppercase pl-5 pr-2">Kolejny trening</span>
              <div className="flex mr-4 gap-2 items-center bg-dirty-navy/60 px-3 py-3 rounded-lg text-baby-blue">
                  <Calendar size={16}/>
                  <span className="whitespace-nowrap mt-1">20.20.2026, 18:00</span>
              </div>
          </div>

          {/* Statystyki dla roli*/}
          {role === "trainer" ? <TrainerStats /> : <TraineeStats />}

        </CardContent>
      </Card>
    </section>
  )

  //RENDER
  return (
    <div className="w-full min-h-[calc(100vh-20rem)] flex flex-col justify-center">
      {/*MOBILE*/}
      <div className="block lg:hidden">
        <Tabs
          value={mobileTab}
          onValueChange={(v) => setMobileTab(v as "notifications" | "stats")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2  bg-dark-navy font-michroma mb-8 z-1 border border-baby-blue/40">
            <TabsTrigger value="notifications" className="text-xs">Powiadomienia <span>{unreadCount > 99 ? "99+" : unreadCount}</span></TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">Statystyki</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" >
            {mobileTab === "notifications" ? renderNotifications() : null}
          </TabsContent>

          <TabsContent value="stats">
            {mobileTab === "stats" ? renderStats() : null}
          </TabsContent>
        </Tabs>
      </div>

      {/*DESKTOP*/}
      <div className="hidden lg:grid lg:grid-cols-2 gap-12">
        {renderNotifications()}
        {renderStats()}
      </div>

    </div>
  )
}
