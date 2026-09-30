import { useState } from "react";
import { ParkingSquare } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-mobile";
import type { ParkingSlot } from "@/types";
import ActiveParkingDurations from "./ActiveParkingDurations";
import ParkingLotGrid from "./ParkingLotGrid";
import ParkingStats from "./ParkingStats";
import ParkingTable from "./ParkingTable";
import ParkVehicleForm from "./ParkVehicleForm";
import RemoveVehicleForm from "./RemoveVehicleForm";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AttendantDashboard = () => {
  // Matches the `xl` breakpoint, below which the entry form is not shown
  // inline — so selecting a bay has to open the sheet instead.
  const formIsInSheet = useMediaQuery("(max-width: 1279px)");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    if (formIsInSheet) setIsSheetOpen(true);
  };

  const handleParkingComplete = () => {
    setSelectedSlot(null);
    if (formIsInSheet) setIsSheetOpen(false);
  };

  const forms = (
    <div className="space-y-4">
      <ParkVehicleForm
        selectedSlot={selectedSlot}
        onParkingComplete={handleParkingComplete}
      />
      <RemoveVehicleForm />
    </div>
  );

  return (
    <div className="space-y-6">
      <ParkingStats />

      <Tabs defaultValue="map">
        <TabsList variant="underline">
          <TabsTrigger value="map">Lot map</TabsTrigger>
          <TabsTrigger value="register">Bay register</TabsTrigger>
          <TabsTrigger value="sessions">Active sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-5">
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <PanelHeader>
                <PanelHeading>
                  <PanelIcon>
                    <ParkingSquare />
                  </PanelIcon>
                  <div>
                    <PanelTitle>Facility map</PanelTitle>
                    <PanelDescription>
                      Tap a free bay to start an entry
                    </PanelDescription>
                  </div>
                </PanelHeading>
              </PanelHeader>
              <PanelBody>
                <ParkingLotGrid
                  onSlotSelect={handleSlotSelect}
                  selectedSlot={selectedSlot?.slotNumber ?? null}
                />
              </PanelBody>
            </Panel>

            {/* On mobile the entry form lives in the sheet instead. */}
            <div className="hidden xl:block">{forms}</div>
            <div className="xl:hidden">
              <RemoveVehicleForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="register" className="mt-5">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ParkingTable />
            </div>
            <div>{forms}</div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-5">
          <ActiveParkingDurations />
        </TabsContent>
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>
              Record entry
              {selectedSlot ? ` · bay ${selectedSlot.slotNumber}` : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            <ParkVehicleForm
              selectedSlot={selectedSlot}
              onParkingComplete={handleParkingComplete}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AttendantDashboard;
