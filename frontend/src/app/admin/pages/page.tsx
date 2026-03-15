"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { toast } from "@/utils/safeToast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import our new modular components
import {
  PageItem,
  PageSection,
  PageHandlers,
} from "@/components/admin/pages/PageTypes";
import { PageListView } from "@/components/admin/pages/PageListView";
import { PageEditor } from "@/components/admin/pages/PageEditor";
const PagesAdminPage: React.FC = () => {
  // Mock pages data - in a real app, this would come from an API
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: "1",
      title: "Homepage",
      slug: "/",
      status: "published",
      createdAt: "2023-10-15T10:30:00Z",
      updatedAt: "2023-11-20T14:45:00Z",
      type: "custom",
      template: "homepage",
      sections: [
        {
          id: "section-1",
          type: "hero",
          title: "Welcome to Our Wedding",
          content: "Join us for our special day",
          imageUrl: "/images/hero-image.jpg",
          order: 0,
          settings: {
            buttonText: "RSVP Now",
            buttonLink: "/rsvp",
          },
        },
        {
          id: "section-2",
          type: "text",
          title: "Our Story",
          content: "This is how we met and fell in love...",
          order: 1,
        },
      ],
    },
    {
      id: "2",
      title: "About Us",
      slug: "/about",
      status: "published",
      createdAt: "2023-10-16T11:20:00Z",
      updatedAt: "2023-11-18T09:30:00Z",
      type: "regular",
      sections: [
        {
          id: "section-1",
          type: "text",
          title: "About the Couple",
          content: "Learn more about us and our journey together.",
          order: 0,
        },
        {
          id: "section-2",
          type: "gallery",
          title: "Our Photos",
          order: 1,
          settings: {
            showCaption: true,
            columns: 3,
          },
        },
      ],
    },
    {
      id: "3",
      title: "Travel Information",
      slug: "/travel",
      status: "draft",
      createdAt: "2023-11-05T16:45:00Z",
      updatedAt: "2023-11-05T16:45:00Z",
      type: "regular",
      sections: [
        {
          id: "section-1",
          type: "text",
          title: "How to Get There",
          content: "Information about the venue location and travel options.",
          order: 0,
        },
      ],
    },
  ]);

  // State for handling the current view
  const [activeView, setActiveView] = useState<"list" | "edit" | "new">("list");
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // State for handling section operations
  const [sectionBeingEdited, setSectionBeingEdited] = useState<string | null>(
    null
  );
  const [newSectionType, setNewSectionType] = useState<
    PageSection["type"] | null
  >(null);

  // Function to create a new page
  const handleNewPage = () => {
    const newPage: PageItem = {
      id: `page-${Date.now()}`,
      title: "New Page",
      slug: `/new-page-${Date.now()}`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: "regular",
      sections: [],
    };
    setEditingPage(newPage);
    setActiveView("new");
  };

  // Function to edit an existing page
  const handleEditPage = (page: PageItem) => {
    setSelectedPage(page);
    setEditingPage({ ...page });
    setActiveView("edit");
  };

  // Function to save a page (new or edited)
  const handleSavePage = () => {
    if (!editingPage) return;

    if (activeView === "new") {
      setPages([...pages, editingPage]);
      toast.success("Page created successfully");
    } else {
      setPages(pages.map((p) => (p.id === editingPage.id ? editingPage : p)));
      toast.success("Page updated successfully");
    }
    setActiveView("list");
    setSelectedPage(null);
    setEditingPage(null);
  };

  // Function to delete a page
  const handleDeletePage = () => {
    if (selectedPage) {
      setPages(pages.filter((p) => p.id !== selectedPage.id));
      setDeleteDialogOpen(false);
      setSelectedPage(null);
      toast.success("Page deleted successfully");
    }
  };

  // Function to add a new section to a page
  const handleAddSection = (type: PageSection["type"]) => {
    if (!editingPage) return;

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: type === "text" ? "Enter your content here..." : undefined,
      imageUrl:
        type === "image" || type === "hero"
          ? "/images/placeholder.jpg"
          : undefined,
      order: editingPage.sections ? editingPage.sections.length : 0,
      settings: {},
    };

    setEditingPage({
      ...editingPage,
      sections: [...(editingPage.sections || []), newSection],
    });

    setSectionBeingEdited(newSection.id);
    setNewSectionType(null);
    toast.success(`Added new ${type} section`);
  };

  // Function to update a section
  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<PageSection>
  ) => {
    if (!editingPage || !editingPage.sections) return;

    setEditingPage({
      ...editingPage,
      sections: editingPage.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  // Function to remove a section
  const handleRemoveSection = (sectionId: string) => {
    if (!editingPage || !editingPage.sections) return;

    setEditingPage({
      ...editingPage,
      sections: editingPage.sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({
          ...section,
          order: index,
        })),
    });

    toast.success("Section removed");
  };

  // Function to move a section up or down
  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    if (!editingPage || !editingPage.sections) return;

    const sectionIndex = editingPage.sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) return;

    const newIndex =
      direction === "up"
        ? Math.max(0, sectionIndex - 1)
        : Math.min(editingPage.sections.length - 1, sectionIndex + 1);
    if (newIndex === sectionIndex) return;

    const updatedSections = [...editingPage.sections];
    const [movedSection] = updatedSections.splice(sectionIndex, 1);
    updatedSections.splice(newIndex, 0, movedSection);

    // Update order property for all sections
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setEditingPage({
      ...editingPage,
      sections: reorderedSections,
    });
  };

  // Function to toggle edit mode for a section
  const toggleSectionEdit = (sectionId: string | null) => {
    setSectionBeingEdited(sectionId);
  };

  // Create handlers object for the PageEditor
  const pageHandlers: PageHandlers = {
    onSavePage: handleSavePage,
    onDeletePage: handleDeletePage,
    onUpdateSection: handleUpdateSection,
    onAddSection: handleAddSection,
    onRemoveSection: handleRemoveSection,
    onMoveSection: handleMoveSection,
    onToggleSectionEdit: toggleSectionEdit,
  };

  // Handle page view
  const handleViewPage = (page: PageItem) => {
    window.open(`/${page.slug}`, "_blank");
  };

  // Handle delete confirmation
  const handleDeletePageConfirm = (page: PageItem) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const updateEditingPage = (updates: Partial<PageItem>) => {
    if (!editingPage) return;
    setEditingPage({ ...editingPage, ...updates });
  };

  const handleBackToList = () => {
    setActiveView("list");
    setEditingPage(null);
    setSelectedPage(null);
  };

  return (
    <div className='flex min-h-screen'>
      <AdminSidebar />
      <div className='flex-1 p-6 overflow-auto'>
        {activeView === "list" && (
          <PageListView
            pages={pages}
            onNewPage={handleNewPage}
            onEditPage={handleEditPage}
            onViewPage={handleViewPage}
            onDeletePage={handleDeletePageConfirm}
          />
        )}

        {(activeView === "edit" || activeView === "new") && editingPage && (
          <PageEditor
            page={editingPage}
            isNew={activeView === "new"}
            sectionBeingEdited={sectionBeingEdited}
            newSectionType={newSectionType}
            handlers={pageHandlers}
            onBack={handleBackToList}
            onUpdatePage={updateEditingPage}
            onSetNewSectionType={setNewSectionType}
          />
        )}

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                page &quot;{selectedPage?.title}&quot; and remove it from your
                website.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='bg-red-600 hover:bg-red-700'
                onClick={handleDeletePage}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PagesAdminPage;
