"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [showPasswordTrainee, setShowPasswordTrainee] = useState(false)
  const [showPasswordTrainer, setShowPasswordTrainer] = useState(false)


  //PAGE
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className={`text-center`}>
          <CardTitle className="text-2xl font-michroma pb-2">Zarejestruj się</CardTitle>
          <CardDescription>
            Dołącz jako trener lub podopieczny
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/*Role picker*/}
          <Tabs defaultValue="trainee" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#14161a]">
              <TabsTrigger value="trainee">Podopieczny</TabsTrigger>
              <TabsTrigger value="trainer">Trener</TabsTrigger>
            </TabsList>

            {/* TRAINEE TAB */}
            <TabsContent value="trainee">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Imię *</Label>
                    <Input id="name" placeholder="Anna"/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="surname">Nazwisko *</Label>
                    <Input id="surname" placeholder="Kowalska" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email">Adres e-mail *</Label>
                  <Input id="email" type="email" placeholder="anna@example.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Numer telefonu *</Label>
                    <Input id="phone" type="tel" placeholder="000 000 000" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="birthdate">Data urodzenia *</Label>
                    <Input id="birthdate" type="date"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Hasło *</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPasswordTrainee ? "text" : "password"} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordTrainee(!showPasswordTrainee)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPasswordTrainee ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300">Min. 8 znaków: małe i wielkie litery, cyfry</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms-trainee" />
                  <Label htmlFor="terms-trainee" className="text-sm font-normal">
                    Wyrażam zgodę na przetwarzanie danych. *
                  </Label>
                </div>

                <Button className="w-full mt-4">Utwórz konto podopiecznego</Button>
              </form>
            </TabsContent>

            {/* TRAINER TAB */}
            <TabsContent value="trainer">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Imię *</Label>
                    <Input id="name" placeholder="Anna" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="surname">Nazwisko *</Label>
                    <Input id="surname" placeholder="Kowalska" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Adres e-mail *</Label>
                  <Input id="email" type="email" placeholder="anna@example.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Numer telefonu *</Label>
                  <Input id="phone" type="tel" placeholder="000 000 000" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password-trainer">Hasło *</Label>
                  <div className="relative">
                    <Input 
                      id="password-trainer" 
                      type={showPasswordTrainer ? "text" : "password"} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordTrainer(!showPasswordTrainer)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPasswordTrainer ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300">Min. 8 znaków: małe i wielkie litery, cyfry</p>
                </div>

                {/* WORKPLACE SECTION */}
                <div className="p-3.5 border border-gold rounded-md space-y-4 mt-2">
                  <Label className="font-semibold text-gold w-full justify-center">
                    Główne miejsce pracy
                  </Label>

                  <div className="space-y-1.5">
                    <Label htmlFor="workplace-name">Nazwa miejsca *</Label>
                    <Input
                      id="workplace-name"
                      className="border-gold"
                      placeholder="np. Siłownia X"
                    />
                  </div>
                  
                  <div className="space-y-1">
                      <Label htmlFor="street" >
                        Ulica *
                      </Label>
                      <Input
                        id="street"
                        className="border-gold"
                      />
                  </div>
                  
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="building-number" >
                        Nr bud. *
                      </Label>
                      <Input
                        id="building-number"
                        className="border-gold"
                      />
                    </div>
                    <div className="pb-1 text-center text-md">
                      /
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="flatnumber" >
                        Nr mieszk.
                      </Label>
                      <Input
                        id="flat-number"
                        className="border-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="city">Miasto *</Label>
                    <Input id="city" className="border-gold" />
                  </div>
                  <p className="text-xs text-zinc-300 ">Kolejne miejsca pracy możesz dodać po zalogowaniu do systemu.</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Wyrażam zgodę na przetwarzanie danych. *
                  </Label>
                </div>

                <Button className="w-full mt-4">Utwórz konto trenera</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}