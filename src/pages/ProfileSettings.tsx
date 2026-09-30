import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, UserRound } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useParking } from '@/context/parking';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from '@/components/ui/panel';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs text-destructive">{message}</p> : null;

export default function ProfileSettings() {
  const { user, updateProfile } = useParking();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);

      const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      // Only send password fields when a new password was actually entered.
      if (data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      await updateProfile(updateData);

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });

      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Could not save changes',
        description: error.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Account"
        title="Profile & settings"
        description="Your details and sign-in credentials."
        backTo="/dashboard"
        actions={
          <Badge variant={user.role === 'admin' ? 'subtle' : 'outline'}>
            {user.role === 'admin' ? 'Administrator' : 'Attendant'}
          </Badge>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHeader>
            <PanelHeading>
              <PanelIcon>
                <UserRound />
              </PanelIcon>
              <div>
                <PanelTitle>Profile information</PanelTitle>
                <PanelDescription>How you appear across the app</PanelDescription>
              </div>
            </PanelHeading>
          </PanelHeader>

          <PanelBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jane Wanjiru" {...register('name')} />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@parkease.co.ke"
                {...register('email')}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                {...register('phone')}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelHeading>
              <PanelIcon className="bg-muted text-muted-foreground">
                <KeyRound />
              </PanelIcon>
              <div>
                <PanelTitle>Password</PanelTitle>
                <PanelDescription>Leave blank to keep your current one</PanelDescription>
              </div>
            </PanelHeading>
          </PanelHeader>

          <PanelBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('currentPassword')}
              />
              <FieldError message={errors.currentPassword?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('newPassword')}
              />
              <FieldError message={errors.newPassword?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </PanelBody>

          <PanelFooter className="py-3.5">
            <p>Changes apply to this account only.</p>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save changes'}
            </Button>
          </PanelFooter>
        </Panel>
      </form>
    </AppLayout>
  );
}
