import { useState } from 'react';
import { X, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useParking } from '@/context/parking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAuthModal = ({ isOpen, onClose }: AdminAuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const { login, addUser } = useParking();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid admin credentials');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addUser({
        username: formData.username,
        password: formData.password,
        role: 'admin'
      });
      setError('Admin account created successfully! Please log in.');
      setActiveTab('login');
      // Clear form after successful registration
      setFormData({
        email: '',
        password: '',
        username: ''
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Admin registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-background text-left shadow-xl transition-all sm:my-8 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Tabs */}
          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
            defaultValue="login"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-muted/50">
              <TabsTrigger 
                value="login" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full mb-4 transition-transform hover:scale-105">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">
                  {activeTab === 'login' ? 'Admin Login' : 'Register Admin'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === 'login' 
                    ? 'Enter your admin credentials' 
                    : 'Create a new admin account'}
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="admin"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Admin Account'}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthModal;
