import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Heart, Calendar } from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
  };

  if (!user) return null;

  return (
    <section id='profile' className={`py-20 px-4 ${className}`}>
      <div className='container mx-auto'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-12'>
            <motion.h2
              className='text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Votre Profile
            </motion.h2>
            <div className='w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4' />
            <span className='text-xl text-muted-foreground'>
              Bienvenue, {user.name} & Marie-Nella
            </span>
          </div>

          <div className='card-royal p-8 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
              <div className='w-24 h-24 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center'>
                <User className='w-12 h-12 text-white' />
              </div>

              <div className='flex-1 text-center md:text-left'>
                <h3 className='text-2xl font-semibold mb-2'>{user.name}</h3>
                <p className='text-muted-foreground mb-6'>{user.email}</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                  <div className='flex flex-col items-center md:items-start p-4 bg-background/50 rounded-lg'>
                    <Heart className='w-5 h-5 text-gold-500 mb-2' />
                    <span className='text-sm font-medium'>RSVP Statut</span>
                    <span className='text-sm text-muted-foreground'>
                      Confirmé
                    </span>
                  </div>

                  <div className='flex flex-col items-center md:items-start p-4 bg-background/50 rounded-lg'>
                    <Calendar className='w-5 h-5 text-gold-500 mb-2' />
                    <span className='text-sm font-medium'>Date du Mariage</span>
                    <span className='text-sm text-muted-foreground'>
                      le 29 aout 2025
                    </span>
                  </div>

                  {/* <div className="flex flex-col items-center md:items-start p-4 bg-background/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gold-500 mb-2" />
                    <span className="text-sm font-medium">Venue</span>
                    <span className="text-sm text-muted-foreground">St. Mary&apos;s Cathedral</span>
                  </div> */}
                </div>

                <Button
                  onClick={handleLogout}
                  variant='outline'
                  className='border-gold-500 text-gold-500 hover:bg-gold-500/10'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
