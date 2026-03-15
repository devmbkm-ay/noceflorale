import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AdditionalInfoStep: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground mb-4">
        Additional Information
      </h3>

      <FormField
        control={control}
        name="primaryGuest.dietaryRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="dietary-requirements"
              className="text-foreground font-medium"
            >
              Dietary Requirements
            </FormLabel>
            <FormControl>
              <Input
                id="dietary-requirements"
                placeholder="Vegetarian, vegan, allergies, etc."
                className="input-royal"
                {...field}
                value={field.value || ''}
                name="dietary-requirements"
              />
            </FormControl>
            <FormDescription className="text-muted-foreground">
              Please let us know if you have any special dietary needs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="primaryGuest.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="additional-notes"
              className="text-foreground font-medium"
            >
              Additional Notes
            </FormLabel>
            <FormControl>
              <Textarea
                id="additional-notes"
                placeholder="Any additional information we should know..."
                className="input-royal resize-none"
                {...field}
                value={field.value || ''}
                name="additional-notes"
              />
            </FormControl>
            <FormDescription className="text-muted-foreground">
              Feel free to add any other information you&apos;d like us to know.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalInfoStep;
