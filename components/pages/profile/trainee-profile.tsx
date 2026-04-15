"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { ClipboardList } from "lucide-react";
import EditTraineeDataDialog from "@/components/dialogs/trainee/edit-data"
import SettingsDialog from "@/components/dialogs/settings"

interface TraineeProfileProps {
  baseData: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
  };
  specificData: {
    birthdate: Date;
  };
}

export default function TraineeProfile({ baseData, specificData }: TraineeProfileProps) {
  return (
    <section className="grid grid-cols-1 gap-15 lg:gap-10 lg:grid-cols-5">

      {/* PROFIL*/}
      <div className="lg:col-span-3">
      <Card className="h-full">
      <CardContent className="px-0 md:grid md:grid-cols-[1fr_1px_1fr]">
    
    {/* Imię i nazwisko */}
    <div className="md:row-start-1 px-5 min-w-0">
      <div className="text-xl font-michroma text-baby-blue text-center w-full">
        <p className="truncate">{baseData.name}</p>
        <p className="truncate">{baseData.surname}</p>
      </div>
    </div>

    {/* DANE */}
    <div className="md:row-span-2 flex flex-col justify-center text-center px-8 gap-7 mt-8 md:mt-0 min-w-0">
      
      {/* Email */}
      <div>
        <p className="text-zinc-400 text-sm">e-mail</p>
        <p className="truncate"> {baseData.email} </p>
      </div>

      {/* Telefon */}
      <div>
        <p className="text-zinc-400 text-sm">telefon</p>
        <p> {baseData.phone} </p>
      </div>

      {/* Data urodzenia */}
      <div>
        <p className="text-zinc-400 text-sm">data urodzenia</p>
        <p>{formatDate(specificData.birthdate)}</p>
      </div>

    </div>

    {/* Buttony */}
    <div className="flex flex-col items-center px-5 mt-8">
      <div className="w-full max-w-[250px] flex flex-col gap-4">
        <Button variant="secondary"> <ClipboardList/> Ankieta startowa</Button>
        <SettingsDialog />
        <EditTraineeDataDialog baseData={baseData} specificData={specificData} />
      </div>
    </div>


    <div className="hidden md:block md:row-start-1 md:row-span-2 w-[1px] h-60 bg-gold" />

  </CardContent>
</Card>
      </div>

      {/*TO-DO: Podpiac logike do pobierania rekordow z bazy, tworzenie nowych rekordow i edycja */}
      {/* REKORDY OSOBISTE */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent>
            <p className="text-xl text-baby-blue font-michroma mb-8">Rekordy osobiste</p>
            
            <div className="space-y-6">
              {[
                { label: "Wyciskanie leżąc", value: "100 kg" },
                { label: "Martwy ciąg", value: "140 kg" },
                { label: "Przysiad", value: "120 kg" },
              ].map((rekord) => (
                <div key={rekord.label} className="flex items-center justify-between border-b border-zinc-700/50 pb-3">
                  <span className="text-zinc-400 text-md">{rekord.label}</span>
                  <span className="font-bold text-gold text-lg">{rekord.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}