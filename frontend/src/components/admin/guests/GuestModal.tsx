import React from "react";
import { X, Save, Edit, Trash2 } from "lucide-react";
import { Rsvp } from "@/graphql/rsvp";

interface GuestModalProps {
  guest: Rsvp | null;
  editedGuest: Rsvp | null;
  isOpen: boolean;
  isEditing: boolean;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onFieldChange: (field: string, value: unknown) => void;
}

export function GuestModal({
  guest,
  editedGuest,
  isOpen,
  isEditing,
  isUpdateLoading,
  isDeleteLoading,
  onClose,
  onEdit,
  onSave,
  onDelete,
  onFieldChange,
}: GuestModalProps) {
  if (!isOpen || !guest) return null;

  const handleChildUpdate = (index: number, field: string, value: unknown) => {
    const updatedChildren = [...(editedGuest?.children || [])];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    onFieldChange("children", updatedChildren);
  };

  const addChild = () => {
    const updatedChildren = [...(editedGuest?.children || [])];
    updatedChildren.push({
      id: `temp-${Date.now()}`,
      name: "",
      age: 0,
    });
    onFieldChange("children", updatedChildren);
    onFieldChange("childrenCount", (editedGuest?.childrenCount || 0) + 1);
  };

  const removeChild = (index: number) => {
    const updatedChildren = [...(editedGuest?.children || [])];
    updatedChildren.splice(index, 1);
    onFieldChange("children", updatedChildren);
    onFieldChange("childrenCount", Math.max((editedGuest?.childrenCount || 0) - 1, 0));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-playfair font-bold text-royal-600'>
              {isEditing
                ? "Modifier les détails de l'invité"
                : "Détails de l'invité"}
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
                  Prénom
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editedGuest?.firstName || ""}
                    onChange={(e) => onFieldChange("firstName", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                  />
                ) : (
                  <p className='text-lg font-medium'>{guest.firstName}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nom
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editedGuest?.lastName || ""}
                    onChange={(e) => onFieldChange("lastName", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                  />
                ) : (
                  <p className='text-lg font-medium'>{guest.lastName}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                {isEditing ? (
                  <input
                    type='email'
                    value={editedGuest?.email || ""}
                    onChange={(e) => onFieldChange("email", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                  />
                ) : (
                  <p className='text-lg font-medium'>{guest.email}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    value={editedGuest?.telephone || ""}
                    onChange={(e) => onFieldChange("telephone", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                  />
                ) : (
                  <p className='text-lg font-medium'>
                    {guest.telephone || "Non fourni"}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Statut de présence
                </label>
                {isEditing ? (
                  <select
                    value={editedGuest?.attending || "attending"}
                    onChange={(e) => onFieldChange("attending", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                  >
                    <option value='attending'>Présent</option>
                    <option value='not_attending'>Absent</option>
                  </select>
                ) : (
                  <p
                    className={`text-lg font-medium ${
                      guest.attending === "attending"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {guest.attending === "attending" ? "Présent" : "Absent"}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Type d&apos;invité
                </label>
                {isEditing ? (
                  <select
                    value={editedGuest?.guestType || "single"}
                    onChange={(e) => onFieldChange("guestType", e.target.value)}
                    className='border rounded-md px-3 py-2 w-full'
                    disabled={editedGuest?.attending === "not_attending"}
                  >
                    <option value='single'>Seul</option>
                    <option value='couple'>Couple</option>
                  </select>
                ) : (
                  <p className='text-lg font-medium'>
                    {guest.guestType === "single" ? "Seul" : "Couple"}
                  </p>
                )}
              </div>
            </div>

            {/* Event Participation */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Participation aux événements
              </label>
              {isEditing ? (
                <select
                  value={editedGuest?.eventParticipation || "both"}
                  onChange={(e) =>
                    onFieldChange("eventParticipation", e.target.value)
                  }
                  className='border rounded-md px-3 py-2 w-full'
                  disabled={editedGuest?.attending === "not_attending"}
                >
                  <option value='both'>Les deux événements</option>
                  <option value='blessing_only'>Cérémonie uniquement</option>
                  <option value='evening_only'>Réception uniquement</option>
                </select>
              ) : (
                <p className='text-lg font-medium'>
                  {guest.eventParticipation === "both"
                    ? "Les deux événements"
                    : guest.eventParticipation === "blessing_only"
                    ? "Cérémonie uniquement"
                    : guest.eventParticipation === "evening_only"
                    ? "Réception uniquement"
                    : "Aucun"}
                </p>
              )}
            </div>

            {/* Partner Information (if couple) */}
            {(editedGuest?.guestType === "couple" ||
              guest.guestType === "couple") && (
              <div className='border-t pt-4'>
                <h3 className='text-lg font-medium mb-4'>
                  Informations du partenaire
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Prénom du partenaire
                      </label>
                      {isEditing ? (
                        <input
                          type='text'
                          value={editedGuest?.partnerFirstName || ""}
                          onChange={(e) =>
                            onFieldChange("partnerFirstName", e.target.value)
                          }
                          className='border rounded-md px-3 py-2 w-full'
                        />
                      ) : (
                        <p className='text-lg font-medium'>
                          {guest.partnerFirstName || "Non fourni"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Nom du partenaire
                      </label>
                      {isEditing ? (
                        <input
                          type='text'
                          value={editedGuest?.partnerLastName || ""}
                          onChange={(e) =>
                            onFieldChange("partnerLastName", e.target.value)
                          }
                          className='border rounded-md px-3 py-2 w-full'
                        />
                      ) : (
                        <p className='text-lg font-medium'>
                          {guest.partnerLastName || "Non fourni"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email du partenaire
                    </label>
                    {isEditing ? (
                      <input
                        type='email'
                        value={editedGuest?.partnerEmail || ""}
                        onChange={(e) =>
                          onFieldChange("partnerEmail", e.target.value)
                        }
                        className='border rounded-md px-3 py-2 w-full'
                      />
                    ) : (
                      <p className='text-lg font-medium'>
                        {guest.partnerEmail || "Non fourni"}
                      </p>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Participation du partenaire aux événements
                    </label>
                    {isEditing ? (
                      <select
                        value={editedGuest?.partnerEventParticipation || "both"}
                        onChange={(e) =>
                          onFieldChange(
                            "partnerEventParticipation",
                            e.target.value
                          )
                        }
                        className='border rounded-md px-3 py-2 w-full'
                        disabled={editedGuest?.attending === "not_attending"}
                      >
                        <option value='both'>Les deux événements</option>
                        <option value='blessing_only'>
                          Cérémonie uniquement
                        </option>
                        <option value='evening_only'>
                          Réception uniquement
                        </option>
                      </select>
                    ) : (
                      <div>
                        <p className='text-lg font-medium'>
                          {guest.partnerEventParticipation === "both"
                            ? "Les deux événements"
                            : guest.partnerEventParticipation ===
                              "blessing_only"
                            ? "Cérémonie uniquement"
                            : guest.partnerEventParticipation === "evening_only"
                            ? "Réception uniquement"
                            : "Même que l'invité principal"}
                        </p>
                        {guest.eventParticipation !==
                          guest.partnerEventParticipation &&
                          guest.partnerEventParticipation && (
                            <div className='mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md'>
                              <div className='flex items-center gap-2'>
                                <span className='text-orange-500'>⚠️</span>
                                <span className='text-sm font-medium text-orange-700'>
                                  Participations différentes détectées
                                </span>
                              </div>
                              <div className='mt-1 text-sm text-orange-600'>
                                <div>
                                  <strong>{guest.firstName}:</strong>{" "}
                                  {guest.eventParticipation === "both"
                                    ? "Les deux événements"
                                    : guest.eventParticipation ===
                                      "blessing_only"
                                    ? "Cérémonie uniquement"
                                    : "Réception uniquement"}
                                </div>
                                <div>
                                  <strong>
                                    {guest.partnerFirstName || "Partenaire"}:
                                  </strong>{" "}
                                  {guest.partnerEventParticipation === "both"
                                    ? "Les deux événements"
                                    : guest.partnerEventParticipation ===
                                      "blessing_only"
                                    ? "Cérémonie uniquement"
                                    : "Réception uniquement"}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Children Information */}
            <div className='border-t pt-4'>
              <div className='flex items-center mb-4'>
                <h3 className='text-lg font-medium'>
                  Informations des enfants
                </h3>
                {isEditing && (
                  <label className='ml-4 inline-flex items-center'>
                    <input
                      type='checkbox'
                      checked={editedGuest?.hasChildren || false}
                      onChange={(e) =>
                        onFieldChange("hasChildren", e.target.checked)
                      }
                      className='mr-2'
                      disabled={editedGuest?.attending === "not_attending"}
                    />
                    <span>Avec enfants</span>
                  </label>
                )}
              </div>

              {isEditing &&
                editedGuest?.hasChildren &&
                editedGuest?.attending === "attending" && (
                  <div className='space-y-4'>
                    {editedGuest?.children?.map((child, index) => (
                      <div
                        key={child.id || index}
                        className='flex items-center gap-4'
                      >
                        <div className='flex-grow'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Nom de l&apos;enfant
                          </label>
                          <input
                            type='text'
                            value={child.name}
                            onChange={(e) =>
                              handleChildUpdate(index, "name", e.target.value)
                            }
                            className='border rounded-md px-3 py-2 w-full'
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
                            onChange={(e) =>
                              handleChildUpdate(
                                index,
                                "age",
                                parseInt(e.target.value)
                              )
                            }
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

              {!isEditing &&
                guest.hasChildren &&
                guest.children &&
                guest.children.length > 0 && (
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <table className='min-w-full'>
                      <thead>
                        <tr>
                          <th className='text-left text-sm font-medium text-gray-500 pb-2'>
                            Nom
                          </th>
                          <th className='text-left text-sm font-medium text-gray-500 pb-2'>
                            Âge
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {guest.children.map((child, index) => (
                          <tr key={child.id || index}>
                            <td className='py-1 font-medium'>{child.name}</td>
                            <td className='py-1'>{child.age}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {!guest.hasChildren && !isEditing && (
                <p className='text-gray-500 italic'>
                  Aucune information sur les enfants fournie
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 mt-6 border-t pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                {isEditing ? "Annuler" : "Fermer"}
              </button>

              {isEditing ? (
                <button
                  type='button'
                  onClick={onSave}
                  disabled={isUpdateLoading}
                  className='bg-royal-600 text-white px-4 py-2 rounded-md hover:bg-royal-700 flex items-center gap-2'
                >
                  {isUpdateLoading ? (
                    <>
                      <div className='animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent' />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    type='button'
                    onClick={onEdit}
                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2'
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  <button
                    type='button'
                    onClick={onDelete}
                    disabled={isDeleteLoading}
                    className={`${
                      isDeleteLoading
                        ? "bg-red-400"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors`}
                  >
                    {isDeleteLoading ? (
                      <>
                        <div className='animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2' />
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Supprimer
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
