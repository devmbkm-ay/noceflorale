// Types for page management components

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  type: "regular" | "custom";
  template?: string;
  sections?: PageSection[];
}

export interface PageSection {
  id: string;
  type: "text" | "image" | "hero" | "cards" | "gallery" | "custom";
  title?: string;
  content?: string;
  imageUrl?: string;
  order: number;
  settings?: Record<string, string | number | boolean>;
}

export interface PageHandlers {
  onSavePage: () => void;
  onDeletePage: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<PageSection>) => void;
  onAddSection: (type: PageSection["type"]) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
  onToggleSectionEdit: (sectionId: string | null) => void;
}
