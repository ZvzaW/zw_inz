"use client"

import * as React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  traineePersonalDataSchema,
  type TraineePersonalDataValues,
} from "@/lib/validations"
import { updateTraineeDataAction } from "@/actions/profile"

export interface EditTraineeDataDialogProps {
  baseData: {
    id: string
    name: string
    surname: string
    email: string
    phone: string
  }
  specificData: {
    birthdate: Date
  }
}

export default function EditTraineeDataDialog({
  baseData,
  specificData,
}: EditTraineeDataDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const toDateInputValue = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const form = useForm<TraineePersonalDataValues>({
    resolver: zodResolver(traineePersonalDataSchema),
    defaultValues: {
      name: baseData.name ?? "",
      surname: baseData.surname ?? "",
      phone: baseData.phone ?? "",
      birthdate: specificData.birthdate
        ? toDateInputValue(new Date(specificData.birthdate))
        : "",
    },
    mode: "onChange",
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          form.reset({
            name: baseData.name ?? "",
            surname: baseData.surname ?? "",
            phone: baseData.phone ?? "",
            birthdate: specificData.birthdate
              ? toDateInputValue(new Date(specificData.birthdate))
              : "",
          })
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Pencil/> Dane
        </Button>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Edycja danych
          </DialogTitle>
        </DialogHeader>
        <button className="sr-only">focus</button>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              startTransition(async () => {
                const res = await updateTraineeDataAction(values)
                if (res?.error) {
                    toast.error(res.error)
                    return
                  }
                  
                toast.success("Zapisano dane!")
                setOpen(false)
              })
            })}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer telefonu</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="tel"
                      inputMode="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data urodzenia</FormLabel>
                  <FormControl>
                    <Input className="appearance-none" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                className="min-w-[100px]"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Anuluj
              </Button>

              <Button
                type="submit"
                className="min-w-[100px]"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ?  
                  <Loader2 className="animate-spin" /> : "Zapisz"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

