'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// This component uses useSearchParams and will be wrapped in Suspense
function LoginContent() {
  // Login/Register state
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Form fields for register
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Auth context
  const { login, register, isLoading, user, isAuthInitialized } = useAuth();
  
  // Router and navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/';
  const isAdminLogin = returnUrl.startsWith('/admin');
  
  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  // Redirect if already logged in and auth is initialized
  useEffect(() => {
    if (isAuthInitialized && user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl, isAuthInitialized]);

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      // Show initial feedback
      const loadingToast = toast.loading(
        isAdminLogin 
          ? 'Connexion au tableau de bord admin...' 
          : 'Connexion en cours...'
      );
      
      await login(email, password);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success message with different content for admin
      if (isAdminLogin) {
        toast.success('🎉 Connexion admin réussie!', {
          description: 'Redirection vers le tableau de bord...',
          duration: 2000
        });
      } else {
        toast.success('👋 Bon retour!', {
          description: 'Vous êtes maintenant connecté(e)',
          duration: 2000
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      toast.error(
        isAdminLogin 
          ? '❌ Échec de la connexion admin' 
          : '❌ Échec de la connexion',
        {
          description: isAdminLogin 
            ? 'Vérifiez vos identifiants administrateur et réessayez.'
            : 'Vérifiez vos identifiants et réessayez.',
          duration: 4000
        }
      );
      
      console.error('Login error:', errorMessage);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  // Show loading if still checking authentication
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-royal-600 hover:text-royal-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-gold-300/20 to-royal-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-royal-500/20 to-gold-300/20 blur-3xl"></div>
            
            <div className="bg-background/95 backdrop-blur-sm rounded-xl overflow-hidden border border-gold-200/30">
              <div className="p-6">
                <div className="py-4">
                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full mx-auto"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
                            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
                          </h2>
                          <p className="text-muted-foreground">
                            {isAdminLogin 
                              ? 'Sign in to access the admin dashboard' 
                              : 'Sign in to access your wedding details'}
                          </p>
                        </div>
                        
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="password">Password</Label>
                              {!isAdminLogin && (
                                <Button variant="link" size="sm" className="text-xs text-gold-500 p-0 h-auto">
                                  Forgot password?
                                </Button>
                              )}
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className={`w-full ${isAdminLogin 
                              ? 'bg-royal-600 hover:bg-royal-700' 
                              : 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700'} text-white`}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              isAdminLogin ? 'Sign In to Admin' : 'Sign In'
                            )}
                          </Button>
                        </form>
                        
                        {!isAdminLogin && (
                          <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                              Don&apos;t have an account?{' '}
                              <Button variant="link" onClick={toggleForm} className="text-gold-500 p-0">
                                Register
                              </Button>
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full mx-auto"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold gradient-text mb-2">Join Us</h2>
                          <p className="text-muted-foreground">Create an account to RSVP and access wedding details</p>
                        </div>
                        
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="register-email">Email</Label>
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="register-password">Password</Label>
                            <Input
                              id="register-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-gold-500 to-gold-700 text-white hover:from-gold-600 hover:to-gold-800"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </Button>
                        </form>
                        
                        <div className="mt-6 text-center">
                          <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Button variant="link" onClick={toggleForm} className="text-blue-500 p-0">
                              Sign In
                            </Button>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className={`p-6 relative overflow-hidden ${
                isLogin ? "bg-gradient-to-r from-blue-50 to-blue-100" : "bg-gradient-to-r from-gold-50 to-gold-100"
              }`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gold-300 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-royal-300 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center mb-2">
                    <p className="text-sm font-medium text-gold-700">
                      {returnUrl.includes('admin') ? 'Admin Access Portal' : 'Wedding Guest Portal'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? 
                      "Sign in to access your wedding details and RSVP" : 
                      "Join us to stay updated on our special day"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the LoginContent in a Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

