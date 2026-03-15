import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { RsvpFormData } from "../validation";
// import { Child } from "../types";

const ChildrenInfoStep: React.FC = () => {
  const { control, watch, setValue, getValues } =
    useFormContext<RsvpFormData>();
  const hasChildren = watch("primaryGuest.hasChildren");
  const children = watch("primaryGuest.children") || [];

  // Toggle hasChildren
  const toggleHasChildren = (checked: boolean) => {
    setValue("primaryGuest.hasChildren", checked, { shouldValidate: true });

    // Initialize children array if it doesn't exist
    if (checked && (!children || children.length === 0)) {
      setValue("primaryGuest.children", [{ name: "", age: 2 }], {
        shouldValidate: true,
      });
      setValue("primaryGuest.childrenCount", 1, { shouldValidate: true });
    }
  };

  // Add a new child
  const addChild = () => {
    const currentChildren = getValues("primaryGuest.children") || [];
    setValue(
      "primaryGuest.children",
      [...currentChildren, { name: "", age: 2 }],
      { shouldValidate: true }
    );
    setValue("primaryGuest.childrenCount", currentChildren.length + 1, {
      shouldValidate: true,
    });
  };

  // Remove a child
  const removeChild = (index: number) => {
    const currentChildren = [...getValues("primaryGuest.children")];
    currentChildren.splice(index, 1);
    setValue("primaryGuest.children", currentChildren, {
      shouldValidate: true,
    });
    setValue("primaryGuest.childrenCount", currentChildren.length, {
      shouldValidate: true,
    });

    // If no children left, set hasChildren to false
    if (currentChildren.length === 0) {
      setValue("primaryGuest.hasChildren", false, { shouldValidate: true });
    }
  };

  // Update child name
  const updateChildName = (index: number, name: string) => {
    const currentChildren = [...getValues("primaryGuest.children")];
    currentChildren[index] = { ...currentChildren[index], name };
    setValue("primaryGuest.children", currentChildren, {
      shouldValidate: true,
    });
  };

  // Update child age
  const updateChildAge = (index: number, ageStr: string) => {
    const age = parseInt(ageStr, 10);
    if (!isNaN(age)) {
      const currentChildren = [...getValues("primaryGuest.children")];
      currentChildren[index] = { ...currentChildren[index], age };
      setValue("primaryGuest.children", currentChildren, {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-blue-50 p-6 rounded-lg'>
        <h3 className='text-xl font-medium text-gray-800 mb-4'>
          Informations des enfants
        </h3>
        <p className='text-gray-600 mb-6'>
          Veuillez nous indiquer si vous venez avec des enfants (âgés de 2 à 12
          ans).
        </p>

        <FormField
          control={control}
          name='primaryGuest.hasChildren'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 mb-6'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={toggleHasChildren}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='font-medium'>
                  Je viens avec des enfants
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {hasChildren && (
          <div className='space-y-4 mt-6 bg-white p-4 rounded-md'>
            <div className='flex justify-between items-center mb-2'>
              <h4 className='font-medium text-gray-700'>Détails des enfants</h4>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addChild}
                className='flex items-center gap-1 text-royal-600 border-royal-300'
              >
                <Plus className='w-4 h-4' /> Ajouter un enfant
              </Button>
            </div>

            {children.map((child, index) => (
              <div
                key={index}
                className='grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-gray-200 rounded-md'
              >
                <div className='md:col-span-2'>
                  <FormLabel className='text-sm text-gray-600'>
                    Nom de l&apos;enfant
                  </FormLabel>
                  <Input
                    value={child.name || ""}
                    onChange={(e) => updateChildName(index, e.target.value)}
                    placeholder="Nom de l'enfant"
                    className='mt-1'
                  />
                </div>
                <div>
                  <FormLabel className='text-sm text-gray-600'>Âge</FormLabel>
                  <div className='flex items-center mt-1'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => {
                        const newAge = Math.max(2, (child.age || 2) - 1);
                        updateChildAge(index, newAge.toString());
                      }}
                      disabled={(child.age || 2) <= 2}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <Input
                      type='number'
                      min={2}
                      max={12}
                      value={child.age || 2}
                      onChange={(e) => updateChildAge(index, e.target.value)}
                      className='h-8 text-center mx-2 w-14'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => {
                        const newAge = Math.min(12, (child.age || 2) + 1);
                        updateChildAge(index, newAge.toString());
                      }}
                      disabled={(child.age || 2) >= 12}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50'
                      onClick={() => removeChild(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {children.length === 0 && (
              <div className='text-center py-4 text-gray-500 italic'>
                Aucun enfant ajouté. Cliquez sur Ajouter un enfant pour
                commencer.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenInfoStep;
