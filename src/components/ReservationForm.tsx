import { useState } from "react";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarClock } from "lucide-react";
import { format, addHours } from "date-fns";

const ReservationForm = () => {
  const [regNumber, setRegNumber] = useState("");
  const [reservedFor, setReservedFor] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 2));
  const { makeReservation, slots } = useParking();

  const availableSlots = slots.filter(slot => !slot.isOccupied && !slot.isReserved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (startDate && endDate) {
      makeReservation({
        slotNumber: Number(slotNumber),
        regNumber,
        reservedFor,
        startTime: startDate,
        endTime: endDate
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-500/5">
        <CardTitle className="flex items-center text-blue-600">
          <CalendarClock className="mr-2 h-5 w-5" /> Reserve Parking
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reserveSlotNumber">Slot Number</Label>
            <select 
              id="reserveSlotNumber"
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
          <Button type="submit" className="w-full bg-blue-600">
            Reserve Slot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservationForm;
