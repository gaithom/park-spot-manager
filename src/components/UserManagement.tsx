
import { useState } from "react";
import { useParking } from "@/context/parking";
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
    <Card className="w-full bg-black border-primary/20">
      <CardHeader className="bg-primary/5 border-b border-primary/20">
        <CardTitle className="flex items-center text-primary">
          <Users className="mr-2 h-5 w-5" /> User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
              className="bg-secondary border-primary/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="bg-secondary border-primary/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">User Role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as "admin" | "attendant")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" className="border-primary text-primary" />
                <Label htmlFor="admin" className="text-foreground">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attendant" id="attendant" className="border-primary text-primary" />
                <Label htmlFor="attendant" className="text-foreground">Attendant</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full bg-primary">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
