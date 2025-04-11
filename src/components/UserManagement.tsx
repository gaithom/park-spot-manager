
import { useState } from "react";
import { useParking } from "@/context/ParkingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users } from "lucide-react";

const UserManagement = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "attendant">("attendant");
  const { addUser, user } = useParking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addUser(username, password, role)) {
      // Reset form if successful
      setUsername("");
      setPassword("");
      setRole("attendant");
    }
  };

  // Only admin can add users
  if (user.role !== "admin") {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-indigo-500/5">
        <CardTitle className="flex items-center text-indigo-600">
          <Users className="mr-2 h-5 w-5" /> User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>User Role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as "admin" | "attendant")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attendant" id="attendant" />
                <Label htmlFor="attendant">Attendant</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full bg-indigo-600">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
