import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useParking } from '@/context/parking';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emptyForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/*
  Serves both `/admin` and `/admin-login`, which previously carried two separate
  implementations — one of which signed in on *any* credentials because it
  awaited a synchronous boolean and only handled the throw path.
*/
const AdminLogin = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, addUser, user } = useParking();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate('/dashboard');
    }
  }, [user.isLoggedIn, navigate]);

  const set = (key: keyof typeof emptyForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError('');
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!form.username || !form.password) {
          setError('Enter both a username and a password');
          return;
        }

        if (login(form.username, form.password)) {
          toast.success('Signed in');
          navigate('/dashboard');
        } else {
          setError('Invalid username or password');
        }
        return;
      }

      if (!form.username || !form.email || !form.password) {
        setError('All fields are required');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (addUser({ username: form.username, password: form.password, role: 'admin' })) {
        toast.success('Administrator account created. Please sign in.');
        setMode('login');
        setForm({ ...emptyForm, username: form.username });
      } else {
        setError('That username already exists');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Administrator access"
      description="Manage rates, staff accounts and facility analytics."
    >
      <div className="mb-6 flex items-center gap-2.5 rounded-lg border bg-surface-sunken px-3.5 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <p className="text-xs leading-snug text-muted-foreground">
          Restricted area. Staff without admin rights should use the{' '}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            standard sign in
          </Link>
          .
        </p>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => {
          setMode(value as 'login' | 'register');
          setError('');
        }}
        className="mb-5"
      >
        <TabsList variant="segmented" className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
      </Tabs>

      {error ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md border border-danger/30 bg-danger-subtle px-3 py-2 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="admin-page-username">Username</Label>
          <Input
            id="admin-page-username"
            value={form.username}
            onChange={set('username')}
            placeholder="admin"
            autoComplete="username"
            disabled={isLoading}
            required
          />
        </div>

        {mode === 'register' ? (
          <div className="space-y-1.5">
            <Label htmlFor="admin-page-email">Email</Label>
            <Input
              id="admin-page-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="admin@parkease.co.ke"
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="admin-page-password">Password</Label>
          <Input
            id="admin-page-password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            disabled={isLoading}
            required
          />
        </div>

        {mode === 'register' ? (
          <div className="space-y-1.5">
            <Label htmlFor="admin-page-confirm">Confirm password</Label>
            <Input
              id="admin-page-confirm"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              required
            />
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? 'Working…'
            : mode === 'register'
              ? 'Create administrator account'
              : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
