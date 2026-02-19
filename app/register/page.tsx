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
                    <Label htmlFor="firstName">Imię *</Label>
                    <Input id="firstName" placeholder="Anna"/>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Nazwisko *</Label>
                    <Input id="lastName" placeholder="Kowalska" />
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
                    <Label htmlFor="birthDate">Data urodzenia *</Label>
                    <Input id="birthDate" type="date"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Hasło *</Label>
                  <Input id="password" type="password" />
                  <p className="text-xs text-zinc-400">Min. 8 znaków: małe i wielkie litery, cyfry</p>
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
                    <Label htmlFor="t-firstName">Imię *</Label>
                    <Input id="t-firstName" placeholder="Anna" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t-lastName">Nazwisko *</Label>
                    <Input id="t-lastName" placeholder="Kowalska" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-email">Adres e-mail *</Label>
                  <Input id="t-email" type="email" placeholder="anna@example.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-phone">Numer telefonu *</Label>
                  <Input id="t-phone" type="tel" placeholder="+48 000 000 000" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-password">Hasło *</Label>
                  <Input id="t-password" type="password" />
                  <p className="text-xs text-zinc-400">Min. 8 znaków: małe i wielkie litery, cyfry</p>
                </div>

                {/* WORKPLACE SECTION */}
                <div className="p-3.5 border border-gold rounded-md space-y-4 mt-2">
                  <Label className="font-semibold text-gold w-full justify-center">
                    Główne miejsce pracy
                  </Label>

                  <div className="space-y-1.5">
                    <Label htmlFor="t-workplace-name">Nazwa miejsca *</Label>
                    <Input
                      id="t-workplace-name"
                      className="border-gold"
                      placeholder="np. Siłownia X"
                    />
                  </div>
                  
                  <div className="space-y-1">
                      <Label htmlFor="t-street" >
                        Ulica *
                      </Label>
                      <Input
                        id="t-street"
                        className="border-gold"
                      />
                  </div>
                  
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="t-building-number" >
                        Nr bud. *
                      </Label>
                      <Input
                        id="t-building-number"
                        className="border-gold"
                      />
                    </div>
                    <div className="pb-1 text-center text-md">
                      /
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="t-apartment-number" >
                        Nr mieszk.
                      </Label>
                      <Input
                        id="t-apartment-number"
                        className="border-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="t-city">Miasto *</Label>
                    <Input id="t-city" className="border-gold" />
                  </div>
                  <p className="text-xs text-zinc-300 ">Kolejne miejsca pracy możesz dodać po zalogowaniu do systemu.</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms-trainer" />
                  <Label htmlFor="terms-trainer" className="text-sm font-normal">
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