"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilePlus,
  File,
  FileText,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { PageItem } from "./PageTypes";

interface PageListViewProps {
  pages: PageItem[];
  onNewPage: () => void;
  onEditPage: (page: PageItem) => void;
  onViewPage: (page: PageItem) => void;
  onDeletePage: (page: PageItem) => void;
}

export const PageListView: React.FC<PageListViewProps> = ({
  pages,
  onNewPage,
  onEditPage,
  onViewPage,
  onDeletePage,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-playfair font-bold">Website Pages</h1>
        <Button onClick={onNewPage} className="gap-2">
          <FilePlus size={16} />
          Create New Page
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <Input placeholder="Search pages..." className="max-w-xs" />
            <div className="flex-grow"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileText size={16} />
                  All Pages
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Pages</DropdownMenuItem>
                <DropdownMenuItem>Published</DropdownMenuItem>
                <DropdownMenuItem>Drafts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <File size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {page.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{page.slug}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      page.status === "published" ? "default" : "secondary"
                    }
                  >
                    {page.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {formatDate(page.updatedAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 capitalize">
                    {page.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPage(page)}
                    className="gap-1"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPage(page)}
                    className="gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePage(page)}
                    className="gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No pages found</p>
            <Button onClick={onNewPage} className="gap-2">
              <FilePlus size={16} />
              Create Your First Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
