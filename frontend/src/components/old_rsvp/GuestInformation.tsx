import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from 'lucide-react';

interface GuestInformationProps {
  form: UseFormReturn<{
    guests: {
      isAttending: boolean;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      dietaryRestrictions?: string;
    }[];
  }>;
  isCoupleInvitation: boolean;
}
export const GuestInformation: React.FC<GuestInformationProps> = ({ form, isCoupleInvitation }) => {
  const guests = form.watch('guests');
  
  const toggleGuestAttendance = (index: number, isAttending: boolean) => {
    form.setValue(`guests.${index}.isAttending`, isAttending);
  };

  return (
    <div className="space-y-6">
      {isCoupleInvitation && (
        <Alert className="bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>This is a couple invitation</AlertTitle>
          <AlertDescription>
            Please provide information for both guests. If one person cannot attend, 
            you can indicate that below but we still need their information.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="guest0" className="w-full">
        <TabsList className="w-full justify-start">
          {guests.map((_, index) => (
            <TabsTrigger key={index} value={`guest${index}`}>
              Guest {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {guests.map((guest, index) => (
          <TabsContent key={index} value={`guest${index}`} className="space-y-4 pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Guest {index + 1} Information</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`attending-${index}`}
                        checked={guest.isAttending}
                        onCheckedChange={(checked) => toggleGuestAttendance(index, !!checked)}
                      />
                      <Label htmlFor={`attending-${index}`}>Will attend</Label>
                    </div>
                  </div>
                  
                  {/* Guest details form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`firstName-${index}`}>First Name*</Label>
                      <input
                        id={`firstName-${index}`}
                        {...form.register(`guests.${index}.firstName`)}
                        className="w-full p-2 border rounded-md"
                        placeholder="First name"
                      />
                      {form.formState.errors.guests?.[index]?.firstName && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.guests[index].firstName?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`lastName-${index}`}>Last Name*</Label>
                      <input
                        id={`lastName-${index}`}
                        {...form.register(`guests.${index}.lastName`)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Last name"
                      />
                      {form.formState.errors.guests?.[index]?.lastName && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.guests[index].lastName?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>Email</Label>
                      <input
                        id={`email-${index}`}
                        type="email"
                        {...form.register(`guests.${index}.email`)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Email address"
                      />
                      {form.formState.errors.guests?.[index]?.email && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.guests[index].email?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>Phone Number*</Label>
                      <input
                        id={`phone-${index}`}
                        {...form.register(`guests.${index}.phone`)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Phone number"
                        required
                      />
                      {form.formState.errors.guests?.[index]?.phone && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.guests[index].phone?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`dietaryRestrictions-${index}`}>Dietary Restrictions</Label>
                      <textarea
                        id={`dietaryRestrictions-${index}`}
                        {...form.register(`guests.${index}.dietaryRestrictions`)}
                        className="w-full p-2 border rounded-md"
                        rows={2}
                        placeholder="Please list any dietary restrictions or allergies"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};