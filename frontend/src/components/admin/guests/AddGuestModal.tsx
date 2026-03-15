import React from "react";
import { X, Save } from "lucide-react";
import { Rsvp } from "@/graphql/rsvp";

interface AddGuestModalProps {
  isOpen: boolean;
  newGuest: Partial<Rsvp>;
  isCreateLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: string, value: unknown) => void;
}

export function AddGuestModal({
  isOpen,
  newGuest,
  isCreateLoading,
  onClose,
  onSave,
  onFieldChange,
}: AddGuestModalProps) {
  if (!isOpen) return null;

  const handleChildUpdate = (index: number, field: string, value: unknown) => {
    const updatedChildren = [...(newGuest.children || [])];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    onFieldChange("children", updatedChildren);
  };

  const addChild = () => {
    const updatedChildren = [...(newGuest.children || [])];
    updatedChildren.push({
      id: `temp-${Date.now()}`,
      name: "",
      age: 0,
    });
    onFieldChange("children", updatedChildren);
    onFieldChange("childrenCount", (newGuest.childrenCount || 0) + 1);
  };

  const removeChild = (index: number) => {
    const updatedChildren = [...(newGuest.children || [])];
    updatedChildren.splice(index, 1);
    onFieldChange("children", updatedChildren);
    onFieldChange("childrenCount", Math.max((newGuest.childrenCount || 0) - 1, 0));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-playfair font-bold text-royal-600'>
              Ajouter un nouvel invité
            </h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <X size={24} />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Basic Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Prénom *
                </label>
                <input
                  type='text'
                  value={newGuest.firstName || ""}
                  onChange={(e) => onFieldChange("firstName", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                  required
                  placeholder='Prénom'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nom *
                </label>
                <input
                  type='text'
                  value={newGuest.lastName || ""}
                  onChange={(e) => onFieldChange("lastName", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                  required
                  placeholder='Nom'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <input
                  type='email'
                  value={newGuest.email || ""}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                  required
                  placeholder='Email'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Téléphone
                </label>
                <input
                  type='tel'
                  value={newGuest.telephone || ""}
                  onChange={(e) => onFieldChange("telephone", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                  placeholder='Téléphone'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Statut de présence
                </label>
                <select
                  value={newGuest.attending || "attending"}
                  onChange={(e) => onFieldChange("attending", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                >
                  <option value='attending'>Présent</option>
                  <option value='not_attending'>Absent</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Type d'invité
                </label>
                <select
                  value={newGuest.guestType || "single"}
                  onChange={(e) => onFieldChange("guestType", e.target.value)}
                  className='border rounded-md px-3 py-2 w-full'
                  disabled={newGuest.attending === "not_attending"}
                >
                  <option value='single'>Seul</option>
                  <option value='couple'>Couple</option>
                </select>
              </div>
            </div>

            {/* Event Participation */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Participation aux événements
              </label>
              <select
                value={newGuest.eventParticipation || "both"}
                onChange={(e) => onFieldChange("eventParticipation", e.target.value)}
                className='border rounded-md px-3 py-2 w-full'
                disabled={newGuest.attending === "not_attending"}
              >
                <option value='both'>Les deux événements</option>
                <option value='blessing_only'>Cérémonie uniquement</option>
                <option value='evening_only'>Réception uniquement</option>
              </select>
            </div>

            {/* Partner Information (if couple) */}
            {newGuest.guestType === "couple" && newGuest.attending === "attending" && (
              <div className='border-t pt-4'>
                <h3 className='text-lg font-medium mb-4'>Informations du partenaire</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Nom du partenaire
                    </label>
                    <input
                      type='text'
                      value={newGuest.partnerName || ""}
                      onChange={(e) => onFieldChange("partnerName", e.target.value)}
                      className='border rounded-md px-3 py-2 w-full'
                      placeholder='Nom du partenaire'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email du partenaire
                    </label>
                    <input
                      type='email'
                      value={newGuest.partnerEmail || ""}
                      onChange={(e) => onFieldChange("partnerEmail", e.target.value)}
                      className='border rounded-md px-3 py-2 w-full'
                      placeholder='Email du partenaire'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Téléphone du partenaire
                    </label>
                    <input
                      type='tel'
                      value={newGuest.partnerTelephone || ""}
                      onChange={(e) => onFieldChange("partnerTelephone", e.target.value)}
                      className='border rounded-md px-3 py-2 w-full'
                      placeholder='Téléphone du partenaire'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Participation du partenaire
                    </label>
                    <select
                      value={newGuest.partnerEventParticipation || "both"}
                      onChange={(e) => onFieldChange("partnerEventParticipation", e.target.value)}
                      className='border rounded-md px-3 py-2 w-full'
                    >
                      <option value='both'>Les deux événements</option>
                      <option value='blessing_only'>Cérémonie uniquement</option>
                      <option value='evening_only'>Réception uniquement</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Children Information */}
            <div className='border-t pt-4'>
              <div className='flex items-center mb-4'>
                <h3 className='text-lg font-medium'>Informations des enfants</h3>
                <label className='ml-4 inline-flex items-center'>
                  <input
                    type='checkbox'
                    checked={newGuest.hasChildren || false}
                    onChange={(e) => onFieldChange("hasChildren", e.target.checked)}
                    className='mr-2'
                    disabled={newGuest.attending === "not_attending"}
                  />
                  <span>Avec enfants</span>
                </label>
              </div>

              {newGuest.hasChildren && newGuest.attending === "attending" && (
                <div className='space-y-4'>
                  {newGuest.children?.map((child, index) => (
                    <div key={child.id || index} className='flex items-center gap-4'>
                      <div className='flex-grow'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Nom de l'enfant
                        </label>
                        <input
                          type='text'
                          value={child.name}
                          onChange={(e) => handleChildUpdate(index, "name", e.target.value)}
                          className='border rounded-md px-3 py-2 w-full'
                          placeholder="Nom de l'enfant"
                        />
                      </div>
                      <div className='w-24'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Âge
                        </label>
                        <input
                          type='number'
                          min='0'
                          max='17'
                          value={child.age}
                          onChange={(e) => handleChildUpdate(index, "age", parseInt(e.target.value))}
                          className='border rounded-md px-3 py-2 w-full'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => removeChild(index)}
                        className='bg-red-100 p-2 rounded-md text-red-600 hover:bg-red-200 mt-6'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type='button'
                    onClick={addChild}
                    className='bg-blue-100 px-4 py-2 rounded-md text-blue-600 hover:bg-blue-200'
                  >
                    Ajouter un enfant
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 mt-6 border-t pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Annuler
              </button>
              <button
                type='button'
                onClick={onSave}
                disabled={isCreateLoading}
                className='bg-royal-600 text-white px-4 py-2 rounded-md hover:bg-royal-700 flex items-center gap-2'
              >
                {isCreateLoading ? (
                  <>
                    <div className='animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent' />
                    Création...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Créer l&apos;invité
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
