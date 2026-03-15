import React, { useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/utils/safeToast";
import {
  GET_GALLERY_IMAGES,
  CREATE_GALLERY_IMAGE,
  UPDATE_GALLERY_IMAGE,
  DELETE_GALLERY_IMAGE,
  REORDER_GALLERY_IMAGES,
} from "@/lib/graphql/gallery";
import {
  Upload,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

// @dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// Sortable Item Component
const SortableImageItem: React.FC<{
  image: GalleryImage;
  editingImage: GalleryImage | null;
  setEditingImage: (image: GalleryImage | null) => void;
  handleUpdateImage: () => void;
  handleToggleActive: (image: GalleryImage) => void;
  handleDeleteImage: (id: string) => void;
  updating: boolean;
  deleting: boolean;
}> = ({
  image,
  editingImage,
  setEditingImage,
  handleUpdateImage,
  handleToggleActive,
  handleDeleteImage,
  updating,
  deleting,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingImage?.id === image.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative border rounded-lg mb-4 p-4 ${
        isDragging ? "shadow-lg bg-white z-10" : "bg-gray-50"
      }`}
    >
      <div className='flex justify-between items-start mb-3'>
        <div className='flex items-center'>
          <div
            {...listeners}
            className='cursor-grab mr-2 text-gray-400 hover:text-gray-600'
          >
            <GripVertical size={18} />
          </div>
          <div className='text-sm text-gray-600'>#{image.order}</div>
        </div>

        {/* Action buttons */}
        <div className='flex space-x-1'>
          {!isEditing ? (
            <>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setEditingImage(image)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleToggleActive(image)}
              >
                {image.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => {
                  const confirm = window.confirm(
                    "Êtes-vous sûr de vouloir supprimer cette image ?"
                  );
                  if (confirm) handleDeleteImage(image.id);
                }}
                disabled={deleting}
              >
                <Trash2 size={16} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                size='icon'
                onClick={handleUpdateImage}
                disabled={updating}
              >
                <Save size={16} />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setEditingImage(null)}
              >
                <X size={16} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Image preview and details */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-1'>
          <div
            className={`border rounded-lg p-4 h-64 flex items-center justify-center ${
              !image.isActive ? "opacity-50" : ""
            }`}
          >
            <Image
              src={isEditing && editingImage ? editingImage.src : image.src}
              alt={isEditing && editingImage ? editingImage.alt : image.alt}
              width={200}
              height={200}
              className='max-h-full w-auto object-contain'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/placeholder.jpg";
              }}
              unoptimized={true}
            />
          </div>
        </div>
        <div className='md:col-span-2'>
          {isEditing && editingImage ? (
            <div className='space-y-3'>
              <div>
                <Label htmlFor={`src-${image.id}`}>URL de l&#39;image</Label>
                <Input
                  id={`src-${image.id}`}
                  value={editingImage.src}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, src: e.target.value })
                  }
                  placeholder='https://example.com/image.jpg'
                />
              </div>
              <div>
                <Label htmlFor={`alt-${image.id}`}>Texte alternatif</Label>
                <Input
                  id={`alt-${image.id}`}
                  value={editingImage.alt}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, alt: e.target.value })
                  }
                  placeholder="Description de l'image"
                />
              </div>
              <div>
                <Label htmlFor={`caption-${image.id}`}>Légende</Label>
                <Textarea
                  id={`caption-${image.id}`}
                  value={editingImage.caption || ""}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      caption: e.target.value,
                    })
                  }
                  placeholder='Légende optionnelle'
                  rows={2}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`active-${image.id}`}
                  checked={editingImage.isActive}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      isActive: e.target.checked,
                    })
                  }
                  className='h-4 w-4'
                />
                <Label htmlFor={`active-${image.id}`}>Image active</Label>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <h3 className='font-medium'>{image.alt}</h3>
              {image.caption && (
                <p className='text-sm text-gray-600'>{image.caption}</p>
              )}
              <div className='flex items-center space-x-2 text-sm'>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    image.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {image.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className='text-sm text-gray-600'>
                Dernière MAJ: {new Date(image.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GalleryManager: React.FC = () => {
  // State for images
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [newImage, setNewImage] = useState<Partial<GalleryImage>>({
    src: "",
    alt: "",
    caption: "",
    isActive: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Mock data for demonstration when backend is not ready
  const mockGalleryImages: GalleryImage[] = [
    {
      id: "mock-1",
      src: "/images/eclat.jpg",
      alt: "Étincelle des futures mariés",
      caption: "L'éclat des moments qui resterons gravés à jamais",
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "mock-2",
      src: "/images/bague.jpg",
      alt: "La bague un symbole plein de sens",
      caption: "Amour, engagement, promesse, union, éternité",
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "mock-3",
      src: "/images/oints.jpg",
      alt: "Consécration",
      caption: "La bénédiction divine au coeur de toute chose",
      order: 3,
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ];

  // State to track if we're in demo mode
  const [demoMode, setDemoMode] = useState(false);

  // Query to fetch gallery images
  const { loading, error, refetch } = useQuery(GET_GALLERY_IMAGES, {
    onCompleted: (data) => {
      if (data?.galleryImages) {
        const sortedImages = [...data.galleryImages].sort(
          (a, b) => a.order - b.order
        );
        setImages(sortedImages);
        setDemoMode(false);
      }
    },
    onError: (err) => {
      // Check if this is the specific error about galleryImages not being in the schema
      const isSchemaError = err.message.includes(
        'Cannot query field "galleryImages" on type "Query"'
      );
      if (isSchemaError) {
        // Activate demo mode with mock data
        setImages(mockGalleryImages);
        setDemoMode(true);
      }
    },
    fetchPolicy: "network-only",
  });

  // Mutations with demo mode awareness
  const [createGalleryImage, { loading: creating }] = useMutation(
    CREATE_GALLERY_IMAGE,
    {
      onCompleted: () => {
        toast.success("Image ajoutée avec succès");
        resetNewImageForm();
        refetch();
      },
      onError: (err) => {
        if (demoMode) {
          // In demo mode, simulate successful addition
          const newMockImage = {
            id: `mock-${Date.now()}`,
            src: newImage.src || "",
            alt: newImage.alt || "",
            caption: newImage.caption || "",
            order: images.length + 1,
            isActive: newImage.isActive || true,
            createdAt: new Date().toISOString(),
          };

          setImages((prev) => [...prev, newMockImage]);
          toast.success("Image ajoutée avec succès (mode démo)");
          resetNewImageForm();
        } else {
          toast.error(`Erreur lors de l'ajout: ${err.message}`);
        }
      },
    }
  );

  const [updateGalleryImage, { loading: updating }] = useMutation(
    UPDATE_GALLERY_IMAGE,
    {
      onCompleted: () => {
        toast.success("Image mise à jour avec succès");
        setEditingImage(null);
        refetch();
      },
      onError: (err) => {
        if (demoMode && editingImage) {
          // In demo mode, simulate successful update
          setImages((prev) =>
            prev.map((img) => (img.id === editingImage.id ? editingImage : img))
          );
          toast.success("Image mise à jour avec succès (mode démo)");
          setEditingImage(null);
        } else {
          toast.error(`Erreur lors de la mise à jour: ${err.message}`);
        }
      },
    }
  );

  const [deleteGalleryImage, { loading: deleting }] = useMutation(
    DELETE_GALLERY_IMAGE,
    {
      onCompleted: () => {
        toast.success("Image supprimée avec succès");
        refetch();
      },
      onError: (err) => {
        if (demoMode) {
          // In demo mode, simulate successful deletion
          setImages((prev) =>
            prev.filter((img) => img.id !== editingImage?.id)
          );
          toast.success("Image supprimée avec succès (mode démo)");
        } else {
          toast.error(`Erreur lors de la suppression: ${err.message}`);
        }
      },
    }
  );

  const [reorderGalleryImages, { loading: reordering }] = useMutation(
    REORDER_GALLERY_IMAGES,
    {
      onCompleted: () => {
        toast.success("Ordre mis à jour avec succès");
      },
      onError: (err) => {
        if (demoMode) {
          // In demo mode, the UI state is already updated by the drag handler
          toast.success("Ordre mis à jour avec succès (mode démo)");
        } else {
          toast.error(`Erreur lors de la réorganisation: ${err.message}`);
          // Revert to previous order by refetching
          refetch();
        }
      },
    }
  );

  // Reset new image form
  const resetNewImageForm = () => {
    setNewImage({
      src: "",
      alt: "",
      caption: "",
      isActive: true,
    });
    setPreviewUrl("");
    setShowAddForm(false);
  };

  // Handle form submissions
  const handleAddImage = () => {
    // Validation
    if (!validateImageUrl(newImage.src)) {
      toast.error("Veuillez entrer une URL d'image valide");
      return;
    }

    if (!newImage.alt) {
      toast.error("Le texte alternatif est requis");
      return;
    }

    createGalleryImage({
      variables: {
        input: {
          src: newImage.src,
          alt: newImage.alt,
          caption: newImage.caption || "",
          isActive: newImage.isActive,
        },
      },
    });
  };

  const handleUpdateImage = () => {
    if (!editingImage) return;

    // Validation
    if (!validateImageUrl(editingImage.src)) {
      toast.error("Veuillez entrer une URL d'image valide");
      return;
    }

    if (!editingImage.alt) {
      toast.error("Le texte alternatif est requis");
      return;
    }

    updateGalleryImage({
      variables: {
        id: editingImage.id,
        input: {
          src: editingImage.src,
          alt: editingImage.alt,
          caption: editingImage.caption || "",
          isActive: editingImage.isActive,
        },
      },
    });
  };

  const handleDeleteImage = (id: string) => {
    deleteGalleryImage({
      variables: { id },
    });
  };

  const handleToggleActive = (image: GalleryImage) => {
    if (demoMode) {
      // In demo mode, directly update the state
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, isActive: !img.isActive } : img
        )
      );
      toast.success(
        `Image ${
          !image.isActive ? "activée" : "désactivée"
        } avec succès (mode démo)`
      );
    } else {
      // Normal API call
      updateGalleryImage({
        variables: {
          id: image.id,
          input: {
            isActive: !image.isActive,
          },
        },
      });
    }
  };

  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setImages((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          const newItems = arrayMove(items, oldIndex, newIndex);

          // Update the order property of each item
          const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index + 1,
          }));

          // Call the reorder mutation (unless in demo mode)
          if (!demoMode) {
            reorderGalleryImages({
              variables: {
                imageIds: updatedItems.map((item) => item.id),
              },
            });
          } else {
            // In demo mode, just display a success toast
            toast.success("Ordre mis à jour avec succès (mode démo)");
          }

          return updatedItems;
        });
      }
    },
    [reorderGalleryImages, demoMode]
  );

  // Utility function to validate image URL
  const validateImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null ||
      url.startsWith("data:image/")
    );
  };

  // Preview image in add form
  const handlePreviewImage = () => {
    if (validateImageUrl(newImage.src)) {
      setPreviewUrl(newImage.src || "");
    } else {
      toast.error("Veuillez entrer une URL d'image valide");
      setPreviewUrl("");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galerie - Chargement...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='h-24 bg-gray-200 rounded mb-4'></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !demoMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galerie - Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-red-500'>
            Une erreur est survenue lors du chargement des images:{" "}
            {error.message}
          </div>
          <Button onClick={() => refetch()} className='mt-4'>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (demoMode) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Gestion de la Galerie (Mode Démonstration)</CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "default"}
          >
            {showAddForm ? (
              <>
                <X size={16} className='mr-1' /> Annuler
              </>
            ) : (
              <>
                <Upload size={16} className='mr-1' /> Ajouter une image
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className='bg-amber-50 border-l-4 border-amber-500 p-4 mb-6'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-amber-500'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-amber-800'>
                  Mode démonstration activé
                </h3>
                <div className='mt-2 text-sm text-amber-700'>
                  <p>
                    La fonctionnalité backend de la galerie n&#39;est pas encore
                    configurée. Vous utilisez actuellement un mode démo avec des
                    données fictives.
                  </p>
                  <p className='mt-1'>
                    Pour activer la fonctionnalité complète :
                  </p>
                  <ol className='list-decimal pl-5 mt-1 space-y-1'>
                    <li>
                      Assurez-vous que les fichiers backend ont été créés
                      correctement dans{" "}
                      <code className='bg-amber-100 px-1 rounded'>
                        backend/graphql/schema/gallery.js
                      </code>{" "}
                      et{" "}
                      <code className='bg-amber-100 px-1 rounded'>
                        backend/graphql/resolvers/gallery.js
                      </code>
                      .
                    </li>
                    <li>
                      Vérifiez que le modèle{" "}
                      <code className='bg-amber-100 px-1 rounded'>
                        backend/models/GalleryImage.js
                      </code>{" "}
                      existe.
                    </li>
                    <li>
                      Redémarrez le serveur backend pour prendre en compte les
                      nouveaux schémas.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the component stays the same */}
          {showAddForm && (
            <Card className='mb-6 border-dashed'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Ajouter une nouvelle image (Démo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Same add form as before */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='md:col-span-1'>
                    <div className='border rounded-lg p-4 h-64 flex items-center justify-center'>
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt='Aperçu'
                          width={200}
                          height={200}
                          className='max-h-full w-auto object-contain'
                          onError={() => {
                            toast.error("Impossible de charger l'image");
                            setPreviewUrl("");
                          }}
                          unoptimized={true}
                        />
                      ) : (
                        <div className='text-center text-gray-400'>
                          <Upload size={36} className='mx-auto mb-2' />
                          <p>Aperçu de l&#39;image</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full mt-2'
                      onClick={handlePreviewImage}
                      disabled={!newImage.src}
                    >
                      Prévisualiser
                    </Button>
                  </div>
                  <div className='md:col-span-2'>
                    <div className='space-y-3'>
                      <div>
                        <Label htmlFor='new-src'>URL de l&#39;image</Label>
                        <Input
                          id='new-src'
                          value={newImage.src || ""}
                          onChange={(e) =>
                            setNewImage({ ...newImage, src: e.target.value })
                          }
                          placeholder='https://example.com/image.jpg'
                        />
                      </div>
                      <div>
                        <Label htmlFor='new-alt'>Texte alternatif</Label>
                        <Input
                          id='new-alt'
                          value={newImage.alt || ""}
                          onChange={(e) =>
                            setNewImage({ ...newImage, alt: e.target.value })
                          }
                          placeholder="Description de l'image"
                        />
                      </div>
                      <div>
                        <Label htmlFor='new-caption'>Légende</Label>
                        <Textarea
                          id='new-caption'
                          value={newImage.caption || ""}
                          onChange={(e) =>
                            setNewImage({
                              ...newImage,
                              caption: e.target.value,
                            })
                          }
                          placeholder='Légende optionnelle'
                          rows={2}
                        />
                      </div>
                      <div className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          id='new-active'
                          checked={newImage.isActive}
                          onChange={(e) =>
                            setNewImage({
                              ...newImage,
                              isActive: e.target.checked,
                            })
                          }
                          className='h-4 w-4'
                        />
                        <Label htmlFor='new-active'>Image active</Label>
                      </div>
                      <div className='flex justify-end space-x-2 mt-4'>
                        <Button variant='outline' onClick={resetNewImageForm}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddImage} disabled={creating}>
                          {creating
                            ? "Ajout en cours..."
                            : "Ajouter l'image (Démo)"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image list with drag and drop */}
          {images.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <Upload size={40} className='mx-auto mb-2 opacity-20' />
              <p>Aucune image dans la galerie</p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setShowAddForm(true)}
              >
                Ajouter votre première image
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                {images.map((img) => (
                  <SortableImageItem
                    key={img.id}
                    image={img}
                    editingImage={editingImage}
                    setEditingImage={setEditingImage}
                    handleUpdateImage={handleUpdateImage}
                    handleToggleActive={handleToggleActive}
                    handleDeleteImage={handleDeleteImage}
                    updating={updating}
                    deleting={deleting}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {/* Status information */}
          <div className='mt-6 text-sm text-gray-500 flex justify-between items-center'>
            <div>
              {images.length} image{images.length !== 1 ? "s" : ""} au total •{" "}
              {images.filter((img) => img.isActive).length} active
              {images.filter((img) => img.isActive).length !== 1 ? "s" : ""}
              {demoMode && " (Démo)"}
            </div>
            {(reordering || updating || deleting || creating) && (
              <div className='text-blue-500'>Opération en cours...</div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Gestion de la Galerie</CardTitle>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "default"}
        >
          {showAddForm ? (
            <>
              <X size={16} className='mr-1' /> Annuler
            </>
          ) : (
            <>
              <Upload size={16} className='mr-1' /> Ajouter une image
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Add new image form */}
        {showAddForm && (
          <Card className='mb-6 border-dashed'>
            <CardHeader>
              <CardTitle className='text-lg'>
                Ajouter une nouvelle image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='md:col-span-1'>
                  <div className='border rounded-lg p-4 h-64 flex items-center justify-center'>
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt='Aperçu'
                        width={200}
                        height={200}
                        className='max-h-full w-auto object-contain'
                        onError={() => {
                          toast.error("Impossible de charger l'image");
                          setPreviewUrl("");
                        }}
                        unoptimized={true}
                      />
                    ) : (
                      <div className='text-center text-gray-400'>
                        <Upload size={36} className='mx-auto mb-2' />
                        <p>Aperçu de l&#39;image</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full mt-2'
                    onClick={handlePreviewImage}
                    disabled={!newImage.src}
                  >
                    Prévisualiser
                  </Button>
                </div>
                <div className='md:col-span-2'>
                  <div className='space-y-3'>
                    <div>
                      <Label htmlFor='new-src'>URL de l&#39;image</Label>
                      <Input
                        id='new-src'
                        value={newImage.src || ""}
                        onChange={(e) =>
                          setNewImage({ ...newImage, src: e.target.value })
                        }
                        placeholder='https://example.com/image.jpg'
                      />
                    </div>
                    <div>
                      <Label htmlFor='new-alt'>Texte alternatif</Label>
                      <Input
                        id='new-alt'
                        value={newImage.alt || ""}
                        onChange={(e) =>
                          setNewImage({ ...newImage, alt: e.target.value })
                        }
                        placeholder="Description de l'image"
                      />
                    </div>
                    <div>
                      <Label htmlFor='new-caption'>Légende</Label>
                      <Textarea
                        id='new-caption'
                        value={newImage.caption || ""}
                        onChange={(e) =>
                          setNewImage({ ...newImage, caption: e.target.value })
                        }
                        placeholder='Légende optionnelle'
                        rows={2}
                      />
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        id='new-active'
                        checked={newImage.isActive}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            isActive: e.target.checked,
                          })
                        }
                        className='h-4 w-4'
                      />
                      <Label htmlFor='new-active'>Image active</Label>
                    </div>
                    <div className='flex justify-end space-x-2 mt-4'>
                      <Button variant='outline' onClick={resetNewImageForm}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddImage} disabled={creating}>
                        {creating ? "Ajout en cours..." : "Ajouter l'image"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image list with drag and drop */}
        {images.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <Upload size={40} className='mx-auto mb-2 opacity-20' />
            <p>Aucune image dans la galerie</p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => setShowAddForm(true)}
            >
              Ajouter votre première image
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              {images.map((img) => (
                <SortableImageItem
                  key={img.id}
                  image={img}
                  editingImage={editingImage}
                  setEditingImage={setEditingImage}
                  handleUpdateImage={handleUpdateImage}
                  handleToggleActive={handleToggleActive}
                  handleDeleteImage={handleDeleteImage}
                  updating={updating}
                  deleting={deleting}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {/* Status information */}
        <div className='mt-6 text-sm text-gray-500 flex justify-between items-center'>
          <div>
            {images.length} image{images.length !== 1 ? "s" : ""} au total •{" "}
            {images.filter((img) => img.isActive).length} active
            {images.filter((img) => img.isActive).length !== 1 ? "s" : ""}
          </div>
          {(reordering || updating || deleting || creating) && (
            <div className='text-blue-500'>Opération en cours...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryManager;
