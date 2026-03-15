import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Form} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRsvpForm, formSchema } from '@/contexts/RsvpFormContext';
const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
};

const ChildrenInfoStep: React.FC = () => {
  const { 
    formValues, 
    children, 
    addChild, 
    removeChild, 
    updateChild, 
    nextStep, 
    prevStep 
  } = useRsvpForm();
  
  // Create a form instance even if we're not using all its features
  // This is needed to provide the FormContext
  const form = useForm({
    resolver: zodResolver(formSchema.pick({
      hasKids: true,
    })),
    defaultValues: {
      hasKids: formValues.hasKids,
    },
  });
  
  const handleNextStep = () => {
    // If user has kids but no children added, add at least one child form
    if (formValues.hasKids === "oui" && children.length === 0) {
      addChild();
    }
    nextStep();
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Form {...form}>
        <form className="space-y-6 p-8">
          <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-6 text-center">
            Informations des enfants
          </h3>
          
          <AnimatePresence>
            {formValues.hasKids === "oui" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {children.map((child, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-blue-50 p-6 rounded-lg border border-blue-100 relative"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => removeChild(index)}
                        aria-label="Supprimer cet enfant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <h4 className="text-md font-medium text-gray-700 mb-4">
                        Enfant {index + 1}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-foreground font-medium text-gray-700">Nom et prénom</label>
                          <Input 
                            placeholder="Jean Dupont" 
                            className="input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                            value={child.fullName}
                            onChange={(e) => updateChild(index, 'fullName', e.target.value)}
                            aria-required="true"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-foreground font-medium text-gray-700">Âge</label>
                          <Input 
                            placeholder="10" 
                            type="number"
                            min="0"
                            max="18"
                            className="input-royal focus:ring-gold-500/50 focus:border-gold-500" 
                            value={child.age}
                            onChange={(e) => updateChild(index, 'age', e.target.value)}
                            aria-required="true"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={addChild}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un enfant
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {formValues.hasKids === "non" && (
            <div className="text-center py-6 text-gray-500">
              Vous avez indiqué ne pas venir avec des enfants.
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <Button 
              type="button" 
              onClick={prevStep}
              className="btn-secondary bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-full transition-all"
              variant="outline"
            >
              Retour
            </Button>
            
            <Button 
              type="button"
              onClick={handleNextStep}
              className="bg-royal-600 text-white px-8 md:px-10 py-2.5 font-medium tracking-wide transition-all duration-300 shadow-md rounded-full hover:bg-royal-700 focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2"
            >
              Suivant
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ChildrenInfoStep;
