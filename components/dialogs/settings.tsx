"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Settings, LogOut, Key, ShieldAlert, ChevronLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/common/password-input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations"
import { changePasswordAction } from "@/actions/settings"
import { logoutAllDevicesAction } from "@/actions/authorization"

type ViewState = "main" | "logout" | "password" | "delete"

export default function SettingsDialog() {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<ViewState>("main")
  const [deleteInput, setDeleteInput] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [isPasswordPending, startPasswordTransition] = React.useTransition()

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      logoutOtherDevices: false,
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (view !== "password") {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        logoutOtherDevices: false,
      })
    }
  }, [view, passwordForm])


  React.useEffect(() => {
    if (view !== "delete") {
     setDeleteInput("")
    }
  }, [view])


  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setView("main")
        setDeleteInput("")
      }, 200) 
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings/> Ustawienia
        </Button>
      </DialogTrigger>
      <DialogContent>
        
        {/* --------------- MENU GŁÓWNE --------------- */}
        {view === "main" && (
          <div className="animate-in slide-in-from-left-8 fade-in duration-300">
            <DialogHeader>
              <DialogTitle>Ustawienia</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-5">
              <Button
                variant="secondary"
                className="justify-start h-12 text-md border-2 border-baby-blue"
                onClick={() => setView("logout")}
              >
                <LogOut className="ml-1 mr-1" />
                Wyloguj ze wszystkich urządzeń
              </Button>

              <Button
                variant="secondary"
                className="justify-start h-12 text-md border-2 border-baby-blue"
                onClick={() => setView("password")}
              >
                <Key className="ml-1 mr-1" />
                Zmień hasło
              </Button>

              <Button
                variant="secondary"
                className="justify-start h-12 text-md border-2 border-destructive hover:bg-destructive/20"
                onClick={() => setView("delete")}
              >
                <ShieldAlert className="ml-1 mr-1" />
                Usuń konto
              </Button>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="destructive">
                  Zamknij
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}

        {/* --------------- WYLOGUJ Z URZĄDZEŃ --------------- */}
        {view === "logout" && (
          <div className="animate-in slide-in-from-right-12 fade-in duration-300">
            <DialogHeader className="flex flex-row items-center  ml-[-15px]">
              <Button variant="ghost" onClick={() => setView("main")}>
                <ChevronLeft className="size-5" />
              </Button>
              <DialogTitle>Wyloguj urządzenia</DialogTitle>
              
            </DialogHeader>
            <DialogDescription> Spowoduje to zakończenie wszystkich Twoich aktywnych sesji na innych przeglądarkach i urządzeniach. Będziesz musiał zalogować się ponownie.
            </DialogDescription>

          
            <DialogFooter>
              <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await logoutAllDevicesAction()
                  if (res?.error) {
                     toast.error(res.error)
                  }
                })
              }}>
                {isPending ? <Loader2 className="animate-spin" /> : "Wyloguj wszędzie"}
                </Button>
            </DialogFooter>
          </div>
        )}

        {/* --------------- ZMIEŃ HASŁO --------------- */}
        {view === "password" && (
          <div className="animate-in slide-in-from-right-12 fade-in duration-300">
             <DialogHeader className="flex flex-row items-center  ml-[-15px]">
              <Button variant="ghost" onClick={() => setView("main")}>
                <ChevronLeft className="size-5" />
              </Button>
              <DialogTitle>Zmień hasło</DialogTitle>
            </DialogHeader>

            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit((values) => {
                  startPasswordTransition(async () => {
                    passwordForm.clearErrors("currentPassword")
                    const res = await changePasswordAction(values)
                    if (res?.error) {
                      if (res.error === "Obecne hasło jest nieprawidłowe") {
                        passwordForm.setError("currentPassword", {
                          message: res.error,
                        })
                        return
                      }

                      toast.error(res.error)
                      return
                    }

                    toast.success("Hasło zostało zmienione!")
                    passwordForm.reset()
                    setView("main")
                  })
                })}
              >
                <div className="flex flex-col gap-5">
                  <p className="text-xs text-zinc-400"> Hasło ma się składać z minimum 8 znaków: małe i wielkie litery, cyfry</p>

                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Obecne hasło</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="current-password"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e)
                                passwordForm.trigger("newPassword")
                              }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nowe hasło</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e)
                                passwordForm.trigger("confirmNewPassword") 
                                passwordForm.trigger("currentPassword")
                              }}
                          />
                        </FormControl>
                        <FormMessage /> 
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potwierdź nowe hasło</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="logoutOtherDevices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row ml-1 gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        </FormControl>
                          <FormLabel className="text-sm text-zinc-300">
                            Wyloguj mnie z innych urządzeń po zmianie hasła 
                          </FormLabel>
                      </FormItem>
                    )}
                  />
                </div> 
                

                <DialogFooter> 
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setView("main")}
                    disabled={isPasswordPending}
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isPasswordPending || !passwordForm.formState.isValid
                    }
                  >
                    {isPasswordPending ? (
                      <Loader2 className="animate-spin" />
                    ) : "Zapisz"}
                    
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}

        {/* --------------- USUŃ KONTO --------------- */}
        {view === "delete" && (
          <div className="animate-in slide-in-from-right-12 fade-in duration-300">
            <DialogHeader className="flex flex-row items-center  ml-[-15px]">
              <Button variant="ghost" onClick={() => setView("main")}>
                <ChevronLeft className="size-5" />
              </Button>
              <DialogTitle className="text-destructive">Usuwanie konta</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-sm font-bold text-destructive">TEJ AKCJI NIE MOŻNA COFNĄĆ!</p>
                <p className="text-sm text-zinc-400 mt-1">Wszystkie dane, historia treningów i inne utworzone przez Ciebie rzeczy zostaną bezpowrotnie usunięte z naszej bazy danych!</p>
              </div>

              
              <div>
                <label className="text-sm text-zinc-300">
                  Aby potwierdzić, wpisz słowo <span className="font-bold text-white">delete</span>
                </label>
                <Input 
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="delete"
                  className="mt-1 border-destructive/50 focus-visible:ring-destructive/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={() => setView("main")}>Anuluj</Button>
              <Button 
                className="bg-gold hover:bg-gold/60 "
                disabled={deleteInput !== "delete"}
              >
                Usuń konto
              </Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}