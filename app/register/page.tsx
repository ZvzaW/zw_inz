"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
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
import {
  traineeSchema,
  trainerSchema,
  type TraineeFormValues,
  type TrainerFormValues,
} from "@/lib/validations"

export default function RegisterPage() {
  const [showPasswordTrainee, setShowPasswordTrainee] = useState(false)
  const [showPasswordTrainer, setShowPasswordTrainer] = useState(false)
  const [activeTab, setActiveTab] = useState<"trainee" | "trainer">("trainee")

  const traineeForm = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      birthdate: "",
      password: "",
      terms: false,
    },
  })

  const trainerForm = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      workplaceName: "",
      street: "",
      buildingNumber: "",
      flatNumber: "",
      city: "",
      terms: false,
    },
  })

  const handleTabChange = (value: string) => {
    const tab = value === "trainer" ? "trainer" : "trainee"
    setActiveTab(tab)

    if (tab === "trainee") {
      traineeForm.reset()
    } else {
      trainerForm.reset()
    }
  }

  const onSubmitTrainee = (data: TraineeFormValues) => {
    // TODO: implement registration handling for trainee
    console.log("Trainee register", data)
  }

  const onSubmitTrainer = (data: TrainerFormValues) => {
    // TODO: implement registration handling for trainer
    console.log("Trainer register", data)
  }



  //PAGE
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className={`text-center`}>
          <CardTitle className="text-2xl font-michroma pb-2">
            Zarejestruj się
          </CardTitle>
          <CardDescription>
            Dołącz jako trener lub podopieczny
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/*Role picker*/}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#14161a]">
              <TabsTrigger value="trainee">Podopieczny</TabsTrigger>
              <TabsTrigger value="trainer">Trener</TabsTrigger>
            </TabsList>


            {/* TRAINEE TAB */}
            <TabsContent value="trainee">
              <form
                className="space-y-6"
                onSubmit={traineeForm.handleSubmit(onSubmitTrainee)}
              >
                <div className="grid grid-cols-2 gap-4">
                {/*NAME*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainee-name">Imię *</Label>
                    <Input
                      id="trainee-name"
                      placeholder="Anna"
                      aria-invalid={!!traineeForm.formState.errors.name}
                      {...traineeForm.register("name")}
                    />
                    {traineeForm.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {traineeForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                {/*SURNAME*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainee-surname">Nazwisko *</Label>
                    <Input
                      id="trainee-surname"
                      placeholder="Kowalska"
                      aria-invalid={!!traineeForm.formState.errors.surname}
                      {...traineeForm.register("surname")}
                    />
                    {traineeForm.formState.errors.surname && (
                      <p className="text-xs text-destructive">
                        {traineeForm.formState.errors.surname.message}
                      </p>
                    )}
                  </div>
                </div>

                {/*EMAIL*/}
                <div className="space-y-1.5">
                  <Label htmlFor="trainee-email">Adres e-mail *</Label>
                  <Input
                    id="trainee-email"
                    type="email"
                    placeholder="anna@example.com"
                    aria-invalid={!!traineeForm.formState.errors.email}
                    {...traineeForm.register("email")}
                  />
                  {traineeForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {traineeForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                {/*PHONE*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainee-phone">Numer telefonu *</Label>
                    <Input
                      id="trainee-phone"
                      type="tel"
                      aria-invalid={!!traineeForm.formState.errors.phone}
                      {...traineeForm.register("phone")}
                    />
                    {traineeForm.formState.errors.phone && (
                      <p className="text-xs text-destructive">
                        {traineeForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                {/*BIRTHDATE*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainee-birthdate">Data urodzenia *</Label>
                    <Input
                      id="trainee-birthdate"
                      type="date"
                      aria-invalid={
                        !!traineeForm.formState.errors.birthdate
                      }
                      {...traineeForm.register("birthdate")}
                    />
                    {traineeForm.formState.errors.birthdate && (
                      <p className="text-xs text-destructive">
                        {traineeForm.formState.errors.birthdate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/*PASSWORD*/}
                <div className="space-y-1.5">
                  <Label htmlFor="trainee-password">Hasło *</Label>
                  <div className="relative">
                    <Input
                      id="trainee-password"
                      type={showPasswordTrainee ? "text" : "password"}
                      className="pr-10"
                      aria-invalid={!!traineeForm.formState.errors.password}
                      {...traineeForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordTrainee(!showPasswordTrainee)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPasswordTrainee ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Min. 8 znaków: małe i wielkie litery, cyfry
                  </p>
                  {traineeForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {traineeForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/*TERMS*/} 
                <div className="flex items-center space-x-2">
                  <Controller
                    name="terms"
                    control={traineeForm.control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms-trainee"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={!!traineeForm.formState.errors.terms}
                      />
                    )}
                  />
                  <Label
                    htmlFor="terms-trainee"
                    className="text-sm font-normal"
                  >
                    Wyrażam zgodę na przetwarzanie danych. *
                  </Label>
                </div>
                {traineeForm.formState.errors.terms && (
                  <p className="text-xs text-destructive -translate-y-4">
                    {traineeForm.formState.errors.terms.message}
                  </p>
                )}

                <Button className="w-full" type="submit">
                  Utwórz konto podopiecznego
                </Button>
              </form>
            </TabsContent>

{/*------------------------------------------------------------------------------------- */}
            {/* TRAINER TAB */}
            <TabsContent value="trainer">
              <form
                className="space-y-6"
                onSubmit={trainerForm.handleSubmit(onSubmitTrainer)}
              >
                <div className="grid grid-cols-2 gap-4">
                {/*NAME*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainer-name">Imię *</Label>
                    <Input
                      id="trainer-name"
                      placeholder="Anna"
                      aria-invalid={!!trainerForm.formState.errors.name}
                      {...trainerForm.register("name")}
                    />
                    {trainerForm.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {trainerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/*SURANME*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="trainer-surname">Nazwisko *</Label>
                    <Input
                      id="trainer-surname"
                      placeholder="Kowalska"
                      aria-invalid={!!trainerForm.formState.errors.surname}
                      {...trainerForm.register("surname")}
                    />
                    {trainerForm.formState.errors.surname && (
                      <p className="text-xs text-destructive">
                        {trainerForm.formState.errors.surname.message}
                      </p>
                    )}
                  </div>
                </div>

                {/*EMAIL*/}
                <div className="space-y-1.5">
                  <Label htmlFor="trainer-email">Adres e-mail *</Label>
                  <Input
                    id="trainer-email"
                    type="email"
                    placeholder="anna@example.com"
                    aria-invalid={!!trainerForm.formState.errors.email}
                    {...trainerForm.register("email")}
                  />
                  {trainerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {trainerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/*PHONE*/}
                <div className="space-y-1.5">
                  <Label htmlFor="trainer-phone">Numer telefonu *</Label>
                  <Input
                    id="trainer-phone"
                    type="tel"
                    aria-invalid={!!trainerForm.formState.errors.phone}
                    {...trainerForm.register("phone")}
                  />
                  {trainerForm.formState.errors.phone && (
                    <p className="text-xs text-destructive">
                      {trainerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/*PASSWORD*/}
                <div className="space-y-1.5">
                  <Label htmlFor="trainer-password">Hasło *</Label>
                  <div className="relative">
                    <Input
                      id="trainer-password"
                      type={showPasswordTrainer ? "text" : "password"}
                      className="pr-10"
                      aria-invalid={!!trainerForm.formState.errors.password}
                      {...trainerForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordTrainer(!showPasswordTrainer)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPasswordTrainer ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Min. 8 znaków: małe i wielkie litery, cyfry
                  </p>
                  {trainerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {trainerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* WORKPLACE SECTION */}
                <div className="p-3.5 border border-gold rounded-md space-y-4 mt-2">
                  <Label className="font-semibold text-gold w-full justify-center">
                    Główne miejsce pracy
                  </Label>

                  {/*WORKPLACE NAME*/}
                  <div className="space-y-1.5">
                    <Label htmlFor="workplace-name">Nazwa miejsca *</Label>
                    <Input
                      id="workplace-name"
                      className="border-gold"
                      aria-invalid={
                        !!trainerForm.formState.errors.workplaceName
                      }
                      {...trainerForm.register("workplaceName")}
                      placeholder="np. Siłownia X"
                    />
                    {trainerForm.formState.errors.workplaceName && (
                      <p className="text-xs text-destructive">
                        {trainerForm.formState.errors.workplaceName.message}
                      </p>
                    )}
                  </div>

                {/*STREET*/}
                  <div className="space-y-1">
                    <Label htmlFor="street">Ulica *</Label>
                    <Input
                      id="street"
                      className="border-gold"
                      aria-invalid={!!trainerForm.formState.errors.street}
                      {...trainerForm.register("street")}
                    />
                    {trainerForm.formState.errors.street && (
                      <p className="text-xs text-destructive">
                        {trainerForm.formState.errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    {/*BUILDING NUMBER*/}
                    <div className="space-y-1">
                      <Label htmlFor="building-number">Nr bud. *</Label>
                      <Input
                        id="building-number"
                        className="border-gold"
                        aria-invalid={
                          !!trainerForm.formState.errors.buildingNumber
                        }
                        {...trainerForm.register("buildingNumber")}
                      />
                      {trainerForm.formState.errors.buildingNumber && (
                        <p className="text-xs text-destructive">
                          {
                            trainerForm.formState.errors.buildingNumber
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="pb-1 text-center text-md">/</div>
                    {/*FLAT NUMBER*/}
                    <div className="space-y-1">
                      <Label htmlFor="flatnumber">Nr mieszk.</Label>
                      <Input
                        id="flat-number"
                        className="border-gold"
                        aria-invalid={!!trainerForm.formState.errors.flatNumber}
                        {...trainerForm.register("flatNumber")}
                      />
                      {trainerForm.formState.errors.flatNumber && (
                        <p className="text-xs text-destructive">
                          {trainerForm.formState.errors.flatNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                {/*CITY*/}
                  <div className="space-y-1">
                    <Label htmlFor="city">Miasto *</Label>
                    <Input
                      id="city"
                      className="border-gold"
                      aria-invalid={!!trainerForm.formState.errors.city}
                      {...trainerForm.register("city")}
                    />
                    {trainerForm.formState.errors.city && (
                      <p className="text-xs text-destructive">
                        {trainerForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 ">
                    Kolejne miejsca pracy możesz dodać po zalogowaniu do
                    systemu.
                  </p>
                </div>

                {/*TERMS*/}
                <div className="flex items-center space-x-2 ">
                  <Controller
                    name="terms"
                    control={trainerForm.control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={!!trainerForm.formState.errors.terms}
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Wyrażam zgodę na przetwarzanie danych. *
                  </Label>
                </div>
                {trainerForm.formState.errors.terms && (
                  <p className="text-xs text-destructive -translate-y-4">
                    {trainerForm.formState.errors.terms.message}
                  </p>
                )}

                <Button className="w-full" type="submit">
                  Utwórz konto trenera
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-zinc-400 pt-6">
              Masz już konto?{" "}
              <Link href="/" className="text-baby-blue hover:underline">
                Zaloguj się
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}