import { useState } from "react"
import { AlertCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { useParking } from "@/context/parking"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emptyFields = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

interface AdminAccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/*
  The hidden administrator entrance, reached by tapping the logo four times.
  Previously duplicated across NavBar, HomeNavBar and Home with three different
  layouts; this is the single shared surface.
*/
const AdminAccessDialog = ({ open, onOpenChange }: AdminAccessDialogProps) => {
  const { addUser } = useParking()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [fields, setFields] = useState(emptyFields)
  const [error, setError] = useState("")

  const set = (key: keyof typeof emptyFields) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("")
    setFields((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const reset = () => {
    setFields(emptyFields)
    setError("")
    setMode("login")
  }

  const handleRegister = () => {
    if (fields.password !== fields.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!fields.email || !fields.username || !fields.password) {
      setError("All fields are required")
      return
    }

    const created = addUser({
      username: fields.username.trim(),
      password: fields.password,
      role: "admin",
    })

    if (!created) {
      setError("Registration failed — that username may already exist.")
      return
    }

    toast.success("Administrator account created. You can sign in now.")
    setFields({ ...emptyFields, username: fields.username.trim() })
    setMode("login")
  }

  const handleLogin = () => {
    const stored = localStorage.getItem("parkingUserCredentials")
    const credentials = stored ? JSON.parse(stored) : {}
    const username = fields.username.trim()

    const match = Object.entries(credentials).find(
      ([key, value]: [string, any]) =>
        key.trim() === username && value.password === fields.password
    )

    if (!match) {
      setError("Invalid username or password")
      toast.error("Invalid credentials. Please try again.")
      return
    }

    const [storedUsername, userData] = match as [
      string,
      { role: string; name?: string; email?: string; password: string }
    ]
    const role = storedUsername.toLowerCase().includes("admin")
      ? "admin"
      : userData.role

    const session = {
      username: storedUsername,
      isLoggedIn: true,
      role,
      name: userData.name || storedUsername,
      email: userData.email || "",
    }

    localStorage.setItem("parkingUser", JSON.stringify(session))
    sessionStorage.setItem("parkingUser", JSON.stringify(session))
    window.location.href =
      role === "admin" ? "/dashboard?admin=true" : "/dashboard"
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (mode === "register") handleRegister()
    else handleLogin()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-[27rem]">
        <DialogHeader>
          <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <DialogTitle>Administrator access</DialogTitle>
          <DialogDescription>
            Restricted area. Sign in with an administrator account to manage
            users, rates and analytics.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as "login" | "register")
            setError("")
          }}
        >
          <TabsList variant="segmented" className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </Tabs>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-subtle px-3 py-2 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              value={fields.username}
              onChange={set("username")}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          {mode === "register" ? (
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={fields.email}
                onChange={set("email")}
                placeholder="admin@parkease.co.ke"
                autoComplete="email"
                required
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={fields.password}
              onChange={set("password")}
              placeholder="••••••••"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              required
            />
          </div>

          {mode === "register" ? (
            <div className="space-y-1.5">
              <Label htmlFor="admin-confirm">Confirm password</Label>
              <Input
                id="admin-confirm"
                type="password"
                value={fields.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          ) : null}

          <Button type="submit" className="w-full">
            {mode === "register"
              ? "Create administrator account"
              : "Sign in to dashboard"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminAccessDialog
