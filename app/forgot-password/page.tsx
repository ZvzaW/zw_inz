"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // TO-DO: implement logic for sending link 
    console.log("Wysłano link resetujący na adres:", email)
    
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-michroma">
            Zresetuj hasło
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isSubmitted 
              ? "Sprawdź swoją skrzynkę pocztową" 
              : "Podaj swój adres e-mail, aby otrzymać instrukcję do resetowania hasła"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!isSubmitted ? (
            /*FORM*/
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="email">Adres e-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="anna@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
              >
                Wyślij link resetujący
              </Button>
            </form>
          ) : (
            /*SUCCESS VIEW*/
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-baby-blue/10 rounded-full flex items-center justify-center mb-2">
                <MailCheck className="text-baby-blue" size={30}/>
              </div>
              <p className="text-sm text-zinc-300 mt-3">
                Wysłaliśmy link do zmiany hasła na adres:<br />
                <span className="font-semibold text-white mt-1 block">{email}</span>
              </p>
            </div>
          )}

          {/*REDIRECT TO LOGIN*/}
          <div className="mt-7 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-zinc-400 hover:text-baby-blue"
            >
              <ArrowLeft className="mr-2" size={16}/>
              Wróć do logowania
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}