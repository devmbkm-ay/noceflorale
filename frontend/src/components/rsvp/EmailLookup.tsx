import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email) {
      exists
      guestName
      lastModified
    }
  }
`;

interface EmailLookupProps {
  onEmailChecked: (email: string, exists: boolean) => void;
}

export const EmailLookup: React.FC<EmailLookupProps> = ({ onEmailChecked }) => {
  const [email, setEmail] = useState('');
  const [checkEmail, { loading, data, error }] = useLazyQuery(CHECK_EMAIL_EXISTS);

  const handleCheck = async () => {
    if (!email.trim()) return;
    
    try {
      const result = await checkEmail({ variables: { email: email.toLowerCase() } });
      const exists = result.data?.checkEmailExists?.exists || false;
      onEmailChecked(email, exists);
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
          <Search className="h-5 w-5" />
          Vérifier une réponse existante
        </h3>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Entrez votre email pour vérifier..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleCheck} 
            disabled={loading || !email.trim()}
            variant="outline"
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </Button>
        </div>

        {data?.checkEmailExists && (
          <div className="mt-4">
            {data.checkEmailExists.exists ? (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">
                    RSVP existant trouvé pour {data.checkEmailExists.guestName}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Pour modifier votre réponse, contactez-nous à:{' '}
                    <a 
                      href={`mailto:floralenoce@gmail.com?subject=Modification RSVP&body=Email: ${email}`}
                      className="underline hover:text-amber-800"
                    >
                      floralenoce@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">
                  Aucun RSVP trouvé. Vous pouvez continuer avec le formulaire.
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              Erreur lors de la vérification. Veuillez réessayer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
