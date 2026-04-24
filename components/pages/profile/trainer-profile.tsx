"use client"

import * as React from "react";
import { changeProfileVisibilityAction } from "@/actions/profile";
import EditTrainerCardDialog from "@/components/dialogs/trainer/edit-trainer-card";
import EditWorkplaceDialog from "@/components/dialogs/trainer/edit-workplace";
import DeleteWorkplaceDialog from "@/components/dialogs/trainer/delete-workplace";
import AddWorkplaceDialog from "@/components/dialogs/trainer/add-workplace";
import SettingsDialog from "@/components/dialogs/settings";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger, PopoverDescription } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { InfoIcon, Star } from "lucide-react";
import { toast } from "sonner";

interface TrainerProfileProps {
  baseData: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    role: string; 
  };
  specificData: {
    work_description: string | null;
    price_per_training: number | null;
    is_public: boolean;
    workplace: {
      id: string;
      name: string;
      street: string;
      building_number: string;
      flat_number: string | null;
      city: string;
    }[];
  };
}

export default function TrainerProfile({ baseData, specificData }: TrainerProfileProps) {
  const [isPublic, setIsPublic] = React.useState(specificData.is_public);
  const [isSaving, startSavingTransition] = React.useTransition();

  const handleProfileVisibilityChange = (checked: boolean) => {
    const previousValue = isPublic;
    setIsPublic(checked);

    startSavingTransition(async () => {
      const result = await changeProfileVisibilityAction(checked);

      if (result?.error) {
        setIsPublic(previousValue);
        toast.error(result.error);
        return;
      }

      toast.success(`Profil jest teraz ${checked ? "publiczny" : "prywatny"}.`);
    });
  };

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-6">
      <div className="lg:col-span-4">
      <Card className="h-full ">
      <CardContent className="px-0 flex flex-col md:grid md:grid-cols-[9fr_1px_10fr] my-auto">
    
    {/* Dane */}
    <div className="order-1 md:order-none md:row-start-1 px-5 min-w-0 text-center mb-8">
      <div className="text-xl font-michroma text-baby-blue w-full">
        <p className="truncate ">{baseData.name}</p>
        <p className="break-words">{baseData.surname}</p>
      </div>
      <p className="truncate text-zinc-400 mt-4"> {baseData.email} </p>
    </div>

    {/* Wizytówka */}
    <div className="order-4 md:order-none md:row-span-2 flex flex-col items-center px-8 gap-6 mt-7 md:mt-0 min-w-0 h-full">
      <div className="text-center space-y-1">
        <p className="text-sm text-zinc-400">Cena za trening</p>
        <p>
          {specificData.price_per_training !== null
            ? `${specificData.price_per_training} PLN`
            : "Brak podanej ceny"}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-zinc-400 text-center">Opis pracy</p>
        <div className="bg-dirty-blue/40 p-2 rounded-md">
          <p className="custom-scrollbar  break-words text-sm whitespace-pre-line p-1 max-h-30 overflow-y-auto">
          {specificData.work_description ?? "Brak opisu"}
        </p>
        </div>
        
      </div>

      <div className="mt-auto">
        <EditTrainerCardDialog
          pricePerTraining={specificData.price_per_training}
          workDescription={specificData.work_description}
        />
      </div>
    </div>

    {/* Zakładki i opcje */}
    <div className="order-2 md:order-none flex flex-col items-center md:mt-auto">
      <div className="w-full max-w-[250px] flex flex-col gap-4">
        <div className="flex mx-auto ">
          <Popover>
          <PopoverTrigger>
            <InfoIcon className="size-4 text-zinc-300 hover:text-gold mr-2 mb-0.5" />
          </PopoverTrigger>
          <PopoverContent>
          <PopoverDescription>
    Profil publiczny pozwala na widoczność Twojego profilu w wyszukiwarce trenerów. Umożliwia to nawiązanie z Tobą współpracy.
    <br />
    Aktualnie twój profil jest <span className="font-bold">{isPublic ? "publiczny" : "prywatny"}</span>.
  </PopoverDescription> 
  </PopoverContent>
        </Popover>
        <p className="text-zinc-300 text-sm mr-5">Profil publiczny</p>
        
        <Switch
          title={isPublic ? "publiczny" : "prywatny"}
          checked={isPublic}
          onCheckedChange={handleProfileVisibilityChange}
          disabled={isSaving}
        />
        </div>
        
        {/*TO-DO: Zaimplementowac moduł opinii*/}
        <Button variant="secondary"> <Star/> Opinie klientów</Button>
        <SettingsDialog baseData={baseData} specificData={specificData} />
      </div>
    </div>

    <div className="order-3 block h-[1px] w-[80%] mx-auto bg-gold mt-8 md:order-none md:row-start-1 md:row-span-2 md:w-[1px] md:h-auto md:my-0" />

  </CardContent>
</Card>
      </div>


{/* MIEJSCA PRACY */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent>
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-xl text-baby-blue font-michroma">Miejsca pracy</p>
              <AddWorkplaceDialog />
            </div>
            <div className="space-y-3 lg:max-h-[225px] overflow-y-auto custom-scrollbar pr-2">
              {specificData.workplace.length > 0 ? (
                specificData.workplace.map((place) => (
                  <div key={place.id} className="bg-dirty-blue rounded-md p-4 pr-2 flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-base font-medium text-gold truncate">{place.name}</p>
                      <p className="text-sm text-zinc-300 mt-2 truncate">
                        ul. {place.street} {place.building_number}
                        {place.flat_number ? `/${place.flat_number}` : ""}, 
                      </p>
                      <p className="text-sm text-zinc-300 truncate">{place.city}</p>
                    </div>

                    <div className="flex flex-col gap-1 my-auto shrink-0">
                      <EditWorkplaceDialog workplace={place} />
                      <DeleteWorkplaceDialog workplaceId={place.id} workplaceName={place.name} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400">Brak dodanych miejsc pracy.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}