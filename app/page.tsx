"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TO-DO: implement login handling
  }


  const searchParams = useSearchParams()
  const router = useRouter()
  const isRegistered = searchParams.get("registered") === "true"
  const hasShownToast = useRef(false)

  useEffect(() => {
    if (isRegistered && !hasShownToast.current) {
      // Wyświetla zielony Toast, który zniknie po ok. 4 sekundach
      hasShownToast.current = true
      toast.success("Konto utworzone pomyślnie!", {
        description: "Możesz się teraz zalogować.",
        duration: 4000,
      })

      // Opcjonalnie: czyścimy URL, żeby po odświeżeniu toast nie wyskoczył znowu
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete("registered")
      router.replace(`/?${newParams.toString()}`, { scroll: false })
    }
  }, [isRegistered, searchParams, router])

  
  //PAGE
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-michroma text-2xl">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*EMAIL*/}
            <div className="space-y-1.5">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="anna@example.com"
                required
              />
            </div>

            {/*PASSWORD*/}
            <div className="space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/*PASSWORD RESET*/}
              <div className="flex justify-start pt-1 pl-1">
                <Link
                  href="/forgot-password"
                  className="text-baby-blue text-xs hover:underline"
                >
                  Zapomniałeś hasła?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Zaloguj się
            </Button>
          </form>

          {/*REDIRECT TO REGISTRATION*/}
          <div className="pt-6 text-center text-sm text-zinc-400">
            Nie masz jeszcze konta?{" "}
            <Link href="/register" className="text-baby-blue hover:underline">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
