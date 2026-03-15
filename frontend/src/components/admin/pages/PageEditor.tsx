"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Save,
  Settings,
  Layout,
  Plus,
  FileText,
  Image as ImageIcon,
  Bookmark,
  AlignLeft,
} from "lucide-react";
import { PageItem, PageSection, PageHandlers } from "./PageTypes";
import { PageSectionEditor } from "./PageSectionEditor";

interface PageEditorProps {
  page: PageItem;
  isNew: boolean;
  sectionBeingEdited: string | null;
  newSectionType: PageSection["type"] | null;
  handlers: PageHandlers;
  onBack: () => void;
  onUpdatePage: (updates: Partial<PageItem>) => void;
  onSetNewSectionType: (type: PageSection["type"] | null) => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  isNew,
  sectionBeingEdited,
  newSectionType,
  handlers,
  onBack,
  onUpdatePage,
  onSetNewSectionType,
}) => {
  const sectionTypes: Array<{
    type: PageSection["type"];
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      type: "text",
      label: "Text Section",
      icon: <FileText size={20} />,
      description: "Add paragraphs, headings, and formatted text",
    },
    {
      type: "image",
      label: "Image Section",
      icon: <ImageIcon size={20} />,
      description: "Display a single image with optional caption",
    },
    {
      type: "hero",
      label: "Hero Section",
      icon: <Layout size={20} />,
      description: "Large banner with background image and call-to-action",
    },
    {
      type: "gallery",
      label: "Gallery Section",
      icon: <Bookmark size={20} />,
      description: "Display multiple images in a grid layout",
    },
    {
      type: "cards",
      label: "Cards Section",
      icon: <AlignLeft size={20} />,
      description: "Organized content in card format",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-2xl font-playfair font-bold">
              {isNew ? "Create New Page" : "Edit Page"}
            </h1>
            {page.title && (
              <p className="text-gray-500">{page.title}</p>
            )}
          </div>
        </div>
        <Button onClick={handlers.onSavePage} className="gap-2">
          <Save size={16} />
          {isNew ? "Create Page" : "Save Changes"}
        </Button>
      </div>

      {/* Main Editor */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Content Editor */}
            <div className="lg:col-span-3 space-y-6">
              {/* Page Title */}
              <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input
                    id="page-title"
                    value={page.title}
                    onChange={(e) => onUpdatePage({ title: e.target.value })}
                    placeholder="Enter page title"
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Page Sections</h3>
                  <Popover
                    open={newSectionType !== null}
                    onOpenChange={(open) => {
                      if (!open) onSetNewSectionType(null);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        onClick={() => onSetNewSectionType("text")}
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Add Section
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <h4 className="font-medium">Choose Section Type</h4>
                        <div className="grid gap-2">
                          {sectionTypes.map((sectionType) => (
                            <Button
                              key={sectionType.type}
                              variant="ghost"
                              className="justify-start h-auto p-3"
                              onClick={() => {
                                handlers.onAddSection(sectionType.type);
                                onSetNewSectionType(null);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-blue-600 mt-0.5">
                                  {sectionType.icon}
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">
                                    {sectionType.label}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {sectionType.description}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Section List */}
                {page.sections && page.sections.length > 0 ? (
                  <div className="space-y-4">
                    {page.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <PageSectionEditor
                          key={section.id}
                          section={section}
                          isEditing={sectionBeingEdited === section.id}
                          canMoveUp={index > 0}
                          canMoveDown={index < page.sections!.length - 1}
                          onUpdate={(updates) =>
                            handlers.onUpdateSection(section.id, updates)
                          }
                          onToggleEdit={() =>
                            handlers.onToggleSectionEdit(
                              sectionBeingEdited === section.id
                                ? null
                                : section.id
                            )
                          }
                          onMoveUp={() =>
                            handlers.onMoveSection(section.id, "up")
                          }
                          onMoveDown={() =>
                            handlers.onMoveSection(section.id, "down")
                          }
                          onRemove={() =>
                            handlers.onRemoveSection(section.id)
                          }
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      No sections added to this page yet
                    </p>
                    <Button
                      onClick={() => handlers.onAddSection("text")}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add Your First Section
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Settings size={16} />
                  Quick Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="page-status">Published</Label>
                    <Switch
                      id="page-status"
                      checked={page.status === "published"}
                      onCheckedChange={(checked) =>
                        onUpdatePage({
                          status: checked ? "published" : "draft",
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-slug">Page URL</Label>
                <Input
                  id="page-slug"
                  value={page.slug}
                  onChange={(e) => onUpdatePage({ slug: e.target.value })}
                  placeholder="/page-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-type">Page Type</Label>
                <select
                  id="page-type"
                  value={page.type}
                  onChange={(e) =>
                    onUpdatePage({
                      type: e.target.value as "regular" | "custom",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="regular">Regular Page</option>
                  <option value="custom">Custom Page</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-template">Template</Label>
                <Input
                  id="page-template"
                  value={page.template || ""}
                  onChange={(e) => onUpdatePage({ template: e.target.value })}
                  placeholder="default"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="page-published">Published Status</Label>
                <Switch
                  id="page-published"
                  checked={page.status === "published"}
                  onCheckedChange={(checked) =>
                    onUpdatePage({
                      status: checked ? "published" : "draft",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
