import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Login from './login';
import Register from './register';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-gold-300/20 to-royal-500/20 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-royal-500/20 to-gold-300/20 blur-3xl"></div>
              
              <div className="bg-background/95 backdrop-blur-sm rounded-xl overflow-hidden border border-gold-200/30">
                <div className="relative p-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 hover:bg-gold-100 hover:text-gold-700 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="py-4">
                    <AnimatePresence mode="wait">
                      {isLogin ? (
                        <Login key="login" onToggleForm={toggleForm} />
                      ) : (
                        <Register key="register" onToggleForm={toggleForm} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className={cn(
                  "p-6 relative overflow-hidden",
                  isLogin ? "bg-gradient-to-r from-blue-50 to-blue-100" : "bg-gradient-to-r from-gold-50 to-gold-100"
                )}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-300 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-royal-300 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center mb-2">
                      <Sparkles className="h-4 w-4 text-gold-500 mr-2" />
                      <p className="text-sm font-medium text-gold-700">
                        {isLogin ? "Wedding Guest Portal" : "Join Our Celebration"}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
