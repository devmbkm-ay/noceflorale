"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  CheckCircle,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { PageSection } from "./PageTypes";

interface PageSectionEditorProps {
  section: PageSection;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onUpdate: (updates: Partial<PageSection>) => void;
  onToggleEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const PageSectionEditor: React.FC<PageSectionEditorProps> = ({
  section,
  isEditing,
  canMoveUp,
  canMoveDown,
  onUpdate,
  onToggleEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => {
  const handleSettingUpdate = (key: string, value: string | number | boolean) => {
    onUpdate({
      settings: {
        ...section.settings,
        [key]: value,
      },
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-700 capitalize">
            {section.type} Section
          </div>
          {section.title && (
            <div className="text-sm text-gray-500">- {section.title}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleEdit}>
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="p-4 bg-gray-50 space-y-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
            <Input
              id={`section-title-${section.id}`}
              value={section.title || ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>

          {/* Text Section Fields */}
          {section.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor={`section-content-${section.id}`}>Content</Label>
              <Textarea
                id={`section-content-${section.id}`}
                value={section.content || ""}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Enter your content here..."
                rows={6}
              />
            </div>
          )}

          {/* Image/Hero Section Fields */}
          {(section.type === "image" || section.type === "hero") && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`section-image-${section.id}`}>Image URL</Label>
                <Input
                  id={`section-image-${section.id}`}
                  value={section.imageUrl || ""}
                  onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              
              {section.type === "hero" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`section-hero-content-${section.id}`}>
                      Hero Text
                    </Label>
                    <Textarea
                      id={`section-hero-content-${section.id}`}
                      value={section.content || ""}
                      onChange={(e) => onUpdate({ content: e.target.value })}
                      placeholder="Enter hero text"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`section-button-text-${section.id}`}>
                        Button Text
                      </Label>
                      <Input
                        id={`section-button-text-${section.id}`}
                        value={
                          typeof section.settings?.buttonText === "string"
                            ? section.settings.buttonText
                            : ""
                        }
                        onChange={(e) =>
                          handleSettingUpdate("buttonText", e.target.value)
                        }
                        placeholder="Enter button text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`section-button-link-${section.id}`}>
                        Button Link
                      </Label>
                      <Input
                        id={`section-button-link-${section.id}`}
                        value={
                          typeof section.settings?.buttonLink === "string"
                            ? section.settings.buttonLink
                            : ""
                        }
                        onChange={(e) =>
                          handleSettingUpdate("buttonLink", e.target.value)
                        }
                        placeholder="Enter button link"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Gallery Section Fields */}
          {section.type === "gallery" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`section-gallery-columns-${section.id}`}>
                  Gallery Columns
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id={`section-gallery-columns-${section.id}`}
                    type="number"
                    min={1}
                    max={4}
                    value={section.settings?.columns?.toString() || "3"}
                    onChange={(e) =>
                      handleSettingUpdate("columns", parseInt(e.target.value))
                    }
                    className="w-24"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`section-gallery-captions-${section.id}`}
                      checked={Boolean(section.settings?.showCaption)}
                      onCheckedChange={(checked) =>
                        handleSettingUpdate("showCaption", checked)
                      }
                    />
                    <Label htmlFor={`section-gallery-captions-${section.id}`}>
                      Show Captions
                    </Label>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border rounded-md">
                <p className="text-sm text-gray-500">
                  Gallery images are managed in the Gallery Manager section.
                  This section will display images from the gallery you select.
                </p>
                <Button variant="outline" className="mt-2 gap-2">
                  <LinkIcon size={16} />
                  Link to Gallery
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={onToggleEdit} className="gap-2">
              <CheckCircle size={16} />
              Done Editing
            </Button>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {!isEditing && (
        <div className="p-4 bg-white">
          {section.type === "text" && (
            <div className="prose max-w-none">
              <p className="text-sm text-gray-600 line-clamp-3">
                {section.content || "No content added yet."}
              </p>
            </div>
          )}
          
          {(section.type === "image" || section.type === "hero") &&
            section.imageUrl && (
              <div className="aspect-video w-full max-w-md mx-auto relative rounded-md overflow-hidden">
                <Image
                  src={section.imageUrl}
                  alt={section.title || "Section image"}
                  className="object-cover w-full h-full"
                  width={400}
                  height={200}
                />
                {section.type === "hero" && section.content && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white">
                    <div className="text-center p-4">
                      <p className="text-lg font-medium">{section.content}</p>
                      {section.settings?.buttonText && (
                        <div className="inline-block mt-2 px-4 py-2 bg-white text-black rounded-md">
                          {section.settings.buttonText}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          
          {section.type === "gallery" && (
            <div className="p-4 bg-gray-100 rounded-md text-center">
              <p className="text-sm text-gray-600">
                Gallery Preview - {section.settings?.columns || 3} columns
                {section.settings?.showCaption ? " with captions" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
