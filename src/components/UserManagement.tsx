import { useState } from "react";
import { ShieldCheck, UserCog, Users } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";

type Role = "admin" | "attendant";

const roles: { value: Role; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "attendant",
    label: "Attendant",
    description: "Records entries, exits and payments",
    icon: UserCog,
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Full access including rates and analytics",
    icon: ShieldCheck,
  },
];

const UserManagement = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("attendant");
  const { addUser, user } = useParking();

  // Only administrators can create accounts.
  if (user.role !== "admin") {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!addUser({ username, password, role })) {
      toast.error(`Username “${username}” is already taken`);
      return;
    }

    toast.success(`${username} added as ${role}`);
    setUsername("");
    setPassword("");
    setRole("attendant");
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <Users />
          </PanelIcon>
          <div>
            <PanelTitle>Team access</PanelTitle>
            <PanelDescription>Create accounts for staff</PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      <PanelBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-username">Username</Label>
              <Input
                id="new-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="j.wanjiru"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Temporary password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-[13px] font-medium text-foreground">
              Role
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {roles.map((option) => {
                const active = role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary-subtle"
                        : "hover:border-strong hover:bg-muted/60"
                    )}
                  >
                    <option.icon
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-[13px] font-medium",
                          active ? "text-primary" : "text-foreground"
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button type="submit" variant="outline" className="w-full sm:w-auto">
            Create account
          </Button>
        </form>
      </PanelBody>
    </Panel>
  );
};

export default UserManagement;
