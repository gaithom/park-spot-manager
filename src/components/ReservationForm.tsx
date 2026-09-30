import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { addHours, differenceInHours, format } from "date-fns";
import { CalendarClock, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import { formatMoney } from "@/lib/utils";
import PaymentModal from "./PaymentModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Created outside the component so the Stripe object is not rebuilt per render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DateField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
}) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start font-normal text-foreground"
        >
          <CalendarClock className="text-muted-foreground" />
          {value ? format(value, "d MMM yyyy") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  </div>
);

const ReservationForm = () => {
  const [regNumber, setRegNumber] = useState("");
  const [reservedFor, setReservedFor] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 2));
  const [vehicleType, setVehicleType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const { makeReservation, slots, vehicleTypeCategories } = useParking();

  const availableSlots = slots.filter(
    (slot) => !slot.isOccupied && !slot.isReserved
  );
  const selectedVehicleType = vehicleTypeCategories.find(
    (type) => type.name === vehicleType
  );
  const hours =
    startDate && endDate ? Math.max(differenceInHours(endDate, startDate), 0) : 0;
  const amount = selectedVehicleType
    ? selectedVehicleType.hourlyRate * (hours || 1)
    : 0;

  const canSubmit = Boolean(
    vehicleType && slotNumber && regNumber && reservedFor && startDate && endDate
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !startDate || !endDate) return;

    setReservationData({
      slotNumber: Number(slotNumber),
      regNumber,
      reservedFor,
      startTime: startDate,
      endTime: endDate,
      vehicleType,
      amount,
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    if (reservationData) {
      const success = makeReservation({
        slotNumber: reservationData.slotNumber,
        regNumber: reservationData.regNumber,
        reservedFor: reservationData.reservedFor,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        paymentId: paymentIntent.id,
        amount: reservationData.amount,
        paymentStatus: "succeeded",
        paymentDate: new Date(),
      });

      if (success) {
        toast.success(
          `Bay ${reservationData.slotNumber} reserved for ${reservationData.reservedFor}`
        );
        setRegNumber("");
        setReservedFor("");
        setSlotNumber("");
        setVehicleType("");
        setStartDate(new Date());
        setEndDate(addHours(new Date(), 2));
      } else {
        toast.error("That bay could not be reserved — it may have just been taken");
      }
    }
    setShowPaymentModal(false);
  };

  const handlePaymentError = (message: string) => {
    console.error("Payment failed:", message);
  };

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <CalendarClock />
            </PanelIcon>
            <div>
              <PanelTitle>Reserve a bay</PanelTitle>
              <PanelDescription>
                {availableSlots.length} bays available to hold
              </PanelDescription>
            </div>
          </PanelHeading>
        </PanelHeader>

        <PanelBody>
          <form id="reservation-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="reserveVehicleType">Vehicle type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger id="reserveVehicleType">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypeCategories.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        {type.name} · KSh {type.hourlyRate}/hr
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reserveSlotNumber">Bay</Label>
                <Select value={slotNumber} onValueChange={setSlotNumber}>
                  <SelectTrigger id="reserveSlotNumber">
                    <SelectValue placeholder="Select a bay" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem
                        key={slot.slotNumber}
                        value={String(slot.slotNumber)}
                      >
                        Bay {String(slot.slotNumber).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="reserveRegNumber">Registration number</Label>
                <Input
                  id="reserveRegNumber"
                  value={regNumber}
                  onChange={(event) =>
                    setRegNumber(event.target.value.toUpperCase())
                  }
                  placeholder="KBZ 123A"
                  className="font-mono uppercase tracking-wider"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reservedFor">Reserved for</Label>
                <Input
                  id="reservedFor"
                  value={reservedFor}
                  onChange={(event) => setReservedFor(event.target.value)}
                  placeholder="Customer name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField label="From" value={startDate} onChange={setStartDate} />
              <DateField label="Until" value={endDate} onChange={setEndDate} />
            </div>
          </form>
        </PanelBody>

        <PanelFooter className="flex-col items-stretch gap-3 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated cost
            </p>
            <p className="mt-0.5 flex items-baseline gap-1.5">
              <span
                data-numeric
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                KSh {formatMoney(amount)}
              </span>
              {selectedVehicleType ? (
                <span className="text-xs text-muted-foreground">
                  {hours || 1} {hours === 1 ? "hour" : "hours"} × KSh{" "}
                  {selectedVehicleType.hourlyRate}
                </span>
              ) : null}
            </p>
          </div>

          <Button
            type="submit"
            form="reservation-form"
            className="sm:ml-auto"
            disabled={!canSubmit}
          >
            <CreditCard />
            Pay &amp; reserve
          </Button>
        </PanelFooter>
      </Panel>

      <Elements stripe={stripePromise}>
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          vehicleType={vehicleType}
          duration={
            hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "1 hour"
          }
        />
      </Elements>
    </>
  );
};

export default ReservationForm;
