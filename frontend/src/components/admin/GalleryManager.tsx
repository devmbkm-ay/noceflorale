import React, { useState } from "react";
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 ${
        isDragging ? "shadow-lg bg-white z-10" : "bg-gray-50"
      } ${!image.isActive ? "opacity-60" : ""}`}
    >
      {editingImage?.id === image.id ? (
        // Edit Mode
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div>
                <Label>URL de l&apos;image</Label>
                <Input
                  value={editingImage.src}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      src: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Texte alternatif</Label>
                <Input
                  value={editingImage.alt}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      alt: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Légende</Label>
                <Textarea
                  value={editingImage.caption || ""}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      caption: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label>Ordre</Label>
                <Input
                  type='number'
                  value={editingImage.order}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className='relative h-48'>
              <Image
                src={editingImage.src}
                alt={editingImage.alt}
                fill
                className='object-cover rounded'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </div>

          <div className='flex gap-2'>
            <Button onClick={handleUpdateImage} disabled={updating} size='sm'>
              <Save className='h-4 w-4 mr-2' />
              {updating ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button
              variant='outline'
              onClick={() => setEditingImage(null)}
              size='sm'
            >
              <X className='h-4 w-4 mr-2' />
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className='flex items-center gap-4'>
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing'
          >
            <GripVertical className='h-5 w-5 text-gray-400' />
          </div>

          <div className='relative w-20 h-20 flex-shrink-0'>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className='object-cover rounded'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.jpg";
              }}
            />
          </div>

          <div className='flex-1 min-w-0'>
            <h4 className='font-medium truncate'>{image.alt}</h4>
            {image.caption && (
              <p className='text-sm text-gray-600 truncate'>{image.caption}</p>
            )}
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-xs text-gray-500'>
                Ordre: {image.order}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  image.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {image.isActive ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleToggleActive(image)}
              className='p-2'
            >
              {image.isActive ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => setEditingImage(image)}
              className='p-2'
            >
              <Edit className='h-4 w-4' />
            </Button>

            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDeleteImage(image.id)}
              disabled={deleting}
              className='p-2'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const GalleryManager: React.FC = () => {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [newImage, setNewImage] = useState({
    src: "",
    alt: "",
    caption: "",
    order: 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data, loading, refetch } = useQuery(GET_GALLERY_IMAGES, {
    fetchPolicy: "cache-and-network",
  });

  const [createImage, { loading: creating }] =
    useMutation(CREATE_GALLERY_IMAGE);
  const [updateImage, { loading: updating }] =
    useMutation(UPDATE_GALLERY_IMAGE);
  const [deleteImage, { loading: deleting }] =
    useMutation(DELETE_GALLERY_IMAGE);
  const [reorderImages] = useMutation(REORDER_GALLERY_IMAGES);

  const images: GalleryImage[] = data?.galleryImages || [];
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCreateImage = async () => {
    if (!newImage.src || !newImage.alt) {
      toast.error("Veuillez remplir au moins l'URL et le texte alternatif");
      return;
    }

    try {
      const maxOrder = Math.max(...images.map((img) => img.order), 0);
      await createImage({
        variables: {
          input: {
            ...newImage,
            order: newImage.order || maxOrder + 1,
          },
        },
      });
      toast.success("Image ajoutée avec succès!");
      setNewImage({ src: "", alt: "", caption: "", order: 0 });
      setPreviewUrl("");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Erreur lors de l'ajout: ${errorMessage}`);
      console.error(error);
    }
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      await updateImage({
        variables: {
          id: editingImage.id,
          input: {
            src: editingImage.src,
            alt: editingImage.alt,
            caption: editingImage.caption,
            order: editingImage.order,
            isActive: editingImage.isActive,
          },
        },
      });
      toast.success("Image mise à jour avec succès!");
      setEditingImage(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
      console.error(error);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image?")) return;

    try {
      await deleteImage({ variables: { id } });
      toast.success("Image supprimée avec succès!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Erreur lors de la suppression: ${errorMessage}`);
      console.error(error);
    }
  };

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      await updateImage({
        variables: {
          id: image.id,
          input: {
            isActive: !image.isActive,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Erreur: ${errorMessage}`);
      console.error(error);
    }
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedImages.findIndex((item) => item.id === active.id);
      const newIndex = sortedImages.findIndex((item) => item.id === over?.id);

      const reorderedImages = arrayMove(sortedImages, oldIndex, newIndex);

      // Update order values
      const updatedImages = reorderedImages.map((item, index) => ({
        ...item,
        order: index,
      }));

      // Update state to reflect new order
      try {
        await reorderImages({
          variables: {
            imageIds: updatedImages.map((item) => item.id),
          },
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error(`Erreur lors du réordonnancement: ${errorMessage}`);
        console.error(error);
      }
    }
  };

  const validateImageUrl = (url: string) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isValidUrl = /^https?:\/\/.+/.test(url);
    return (
      isValidUrl &&
      (imageExtensions.test(url) ||
        url.includes("cloudinary") ||
        url.includes("imgur"))
    );
  };

  if (loading)
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p>Chargement des images...</p>
        </div>
      </div>
    );

  return (
    <div className='space-y-6'>
      {/* Add New Image Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Upload className='h-5 w-5' />
            Ajouter une nouvelle image
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='new-src'>URL de l&apos;image *</Label>
                <Input
                  id='new-src'
                  value={newImage.src}
                  onChange={(e) => {
                    setNewImage({ ...newImage, src: e.target.value });
                    if (validateImageUrl(e.target.value)) {
                      // Optionally, you can set previewUrl here if needed
                      setPreviewUrl(e.target.value);
                    }
                  }}
                  placeholder='https://example.com/image.jpg'
                  className={
                    !validateImageUrl(newImage.src) && newImage.src
                      ? "border-red-300"
                      : ""
                  }
                />
                {newImage.src && !validateImageUrl(newImage.src) && (
                  <p className='text-sm text-red-600 mt-1'>
                    URL d&apos;image invalide
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor='new-alt'>Texte alternatif *</Label>
                <Input
                  id='new-alt'
                  value={newImage.alt}
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
                  value={newImage.caption}
                  onChange={(e) =>
                    setNewImage({ ...newImage, caption: e.target.value })
                  }
                  placeholder='Légende optionnelle'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor='new-order'>Ordre d&apos;affichage</Label>
                <Input
                  id='new-order'
                  type='number'
                  value={newImage.order}
                  onChange={(e) =>
                    setNewImage({
                      ...newImage,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder='0'
                />
              </div>
            </div>

            {/* Preview */}
            <div className='space-y-4'>
              <Label>Aperçu</Label>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center'>
                {previewUrl && validateImageUrl(previewUrl) ? (
                  <div className='relative w-full h-full'>
                    <Image
                      src={previewUrl}
                      alt='Aperçu'
                      fill
                      className='object-contain rounded'
                      onError={() => setPreviewUrl("")}
                    />
                  </div>
                ) : (
                  <div className='text-center text-gray-500'>
                    <Upload className='h-12 w-12 mx-auto mb-2' />
                    <p>Aperçu de l&apos;image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateImage}
            disabled={creating || !newImage.src || !newImage.alt}
            className='w-full'
          >
            {creating ? "Ajout en cours..." : "Ajouter l'image"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images existantes ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <Upload className='h-12 w-12 mx-auto mb-4' />
              <p>Aucune image dans la galerie</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedImages}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-4'>
                  {sortedImages.map((image) => (
                    <SortableImageItem
                      key={image.id}
                      image={image}
                      editingImage={editingImage}
                      setEditingImage={setEditingImage}
                      handleUpdateImage={handleUpdateImage}
                      handleToggleActive={handleToggleActive}
                      handleDeleteImage={handleDeleteImage}
                      updating={updating}
                      deleting={deleting}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {images.length}
              </div>
              <div className='text-sm text-gray-600'>Total</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {images.filter((img) => img.isActive).length}
              </div>
              <div className='text-sm text-gray-600'>Actives</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {images.filter((img) => !img.isActive).length}
              </div>
              <div className='text-sm text-gray-600'>Inactives</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {new Date().toLocaleDateString("fr-FR")}
              </div>
              <div className='text-sm text-gray-600'>Dernière MAJ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryManager;
