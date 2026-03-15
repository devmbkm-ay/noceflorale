import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  UserRound,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";

const PrimaryGuestInfoStep: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-primary'>Your Details</h2>
        <p className='text-muted-foreground mt-1'>
          Please provide your personal information
        </p>
      </div>

      <Card>
        <CardContent className='pt-6 pb-6'>
          <div className='grid gap-6'>
            <FormField
              control={control}
              name='primaryGuest.firstName'
              rules={{ required: "Your first name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your First Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <UserRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        className='pl-10'
                        placeholder='Enter your first name'
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='primaryGuest.lastName'
              rules={{ required: "Your last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Last Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <UserRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        className='pl-10'
                        placeholder='Enter your last name'
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='primaryGuest.email'
              rules={{
                required: "Your email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        className='pl-10'
                        placeholder='Enter your email'
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='primaryGuest.telephone'
              rules={{ required: "Le numéro de téléphone est obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone *</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        className='pl-10'
                        placeholder='Entrez votre numéro de téléphone'
                        {...field}
                        value={field.value || ""}
                        required
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimaryGuestInfoStep;
