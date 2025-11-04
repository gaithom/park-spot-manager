import { useState } from "react";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarClock, CreditCard } from "lucide-react";
import { format, addHours, differenceInHours, parseISO } from "date-fns";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentModal from "./PaymentModal";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

  const availableSlots = slots.filter(slot => !slot.isOccupied && !slot.isReserved);
  const selectedVehicleType = vehicleTypeCategories.find(vt => vt.name === vehicleType);
  const hours = startDate && endDate ? differenceInHours(endDate, startDate) : 0;
  const amount = selectedVehicleType ? selectedVehicleType.hourlyRate * (hours || 1) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleType) {
      alert('Please select a vehicle type');
      return;
    }

    if (startDate && endDate) {
      // Store the reservation data and show payment modal
      setReservationData({
        slotNumber: Number(slotNumber),
        regNumber,
        reservedFor,
        startTime: startDate,
        endTime: endDate,
        vehicleType,
        amount
      });
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    if (reservationData) {
      // Create the reservation after successful payment
      const success = makeReservation({
        slotNumber: reservationData.slotNumber,
        regNumber: reservationData.regNumber,
        reservedFor: reservationData.reservedFor,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        paymentId: paymentIntent.id,
        amount: reservationData.amount,
        paymentStatus: 'succeeded',
        paymentDate: new Date()
      });

      if (success) {
        // Reset form
        setRegNumber('');
        setReservedFor('');
        setSlotNumber('');
        setVehicleType('');
        setStartDate(new Date());
        setEndDate(addHours(new Date(), 2));
      }
    }
    setShowPaymentModal(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Optionally show error to user
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="bg-blue-500/5">
          <CardTitle className="flex items-center text-blue-600">
            <CalendarClock className="mr-2 h-5 w-5" /> Reserve Parking
          </CardTitle>
        </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <select
                id="vehicleType"
                aria-label="Vehicle Type"
                className="w-full border border-gray-300 rounded-md p-2"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              >
                <option value="">Select vehicle type</option>
                {vehicleTypeCategories.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.name} (KSh {type.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reserveSlotNumber">Slot Number</Label>
              <select 
                id="reserveSlotNumber"
                aria-label="Slot Number"
                className="w-full border border-gray-300 rounded-md p-2"
                value={slotNumber}
                onChange={(e) => setSlotNumber(e.target.value)}
                required
              >
                <option value="">Select a slot</option>
                {availableSlots.map(slot => (
                  <option key={slot.slotNumber} value={slot.slotNumber}>
                    Slot {slot.slotNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reserveRegNumber">Vehicle Registration Number</Label>
            <Input
              id="reserveRegNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g., KBZ123A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reservedFor">Reserved For</Label>
            <Input
              id="reservedFor"
              value={reservedFor}
              onChange={(e) => setReservedFor(e.target.value)}
              placeholder="Customer name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {startDate ? format(startDate, "PPp") : "Select start time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {endDate ? format(endDate, "PPp") : "Select end time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="pt-2 border-t">
            {amount > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Estimated Cost:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">KSh {amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {hours} {hours === 1 ? 'hour' : 'hours'} × KSh {selectedVehicleType?.hourlyRate}/hour
                  </div>
                </div>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!vehicleType || !slotNumber || !regNumber || !reservedFor || !startDate || !endDate}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay & Reserve Slot
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <Elements stripe={stripePromise}>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={amount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        vehicleType={vehicleType}
        duration={hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : 'N/A'}
      />
      </Elements>
    </>
  );
};

export default ReservationForm;
