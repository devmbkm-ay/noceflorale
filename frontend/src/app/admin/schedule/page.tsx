"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Loader2, Plus, Trash2, Calendar, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Select components are not used in this file, but might be needed in the future
import { toast } from "react-toastify";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

// GraphQL queries and mutations
const GET_SCHEDULE_ITEMS = gql`
  query GetScheduleItems {
    scheduleItems {
      id
      title
      description
      startTime
      endTime
      location
      order
      important
    }
  }
`;

const CREATE_SCHEDULE_ITEM = gql`
  mutation CreateScheduleItem($item: ScheduleItemInput!) {
    createScheduleItem(item: $item) {
      id
      title
      description
      startTime
      endTime
      location
      order
      important
    }
  }
`;

const UPDATE_SCHEDULE_ITEM = gql`
  mutation UpdateScheduleItem($id: ID!, $item: ScheduleItemInput!) {
    updateScheduleItem(id: $id, item: $item) {
      id
      title
      description
      startTime
      endTime
      location
      order
      important
    }
  }
`;

const DELETE_SCHEDULE_ITEM = gql`
  mutation DeleteScheduleItem($id: ID!) {
    deleteScheduleItem(id: $id) {
      id
    }
  }
`;

// Types
interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  order: number;
  important?: boolean;
}

interface ScheduleItemInput {
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  location: string;
  order?: number;
  important?: boolean;
}

const SchedulePage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<ScheduleItemInput>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Query to get schedule items
  const { loading, error, data, refetch } = useQuery(GET_SCHEDULE_ITEMS);

  // Mutations
  const [createScheduleItem, { loading: createLoading }] = useMutation(CREATE_SCHEDULE_ITEM, {
    onCompleted: () => {
      toast.success("Event added to schedule!");
      refetch();
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to add event: ${error.message}`);
    },
  });

  const [updateScheduleItem, { loading: updateLoading }] = useMutation(UPDATE_SCHEDULE_ITEM, {
    onCompleted: () => {
      toast.success("Event updated successfully!");
      refetch();
      setIsEditDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const [deleteScheduleItem, { loading: deleteLoading }] = useMutation(DELETE_SCHEDULE_ITEM, {
    onCompleted: () => {
      toast.success("Event removed from schedule");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  // Reset form
  const resetForm = () => {
    setNewItem({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
    });
  };

  // Handle adding a new schedule item
  const handleAddItem = () => {
    if (!newItem.title || !newItem.startTime) {
      toast.error("Title and start time are required");
      return;
    }

    createScheduleItem({
      variables: {
        item: {
          ...newItem,
          order: data?.scheduleItems ? data.scheduleItems.length : 0,
        },
      },
    });
  };

  // Handle editing a schedule item
  const handleEditItem = () => {
    if (!editingItem) return;

    updateScheduleItem({
      variables: {
        id: editingItem.id,
        item: {
          title: editingItem.title,
          description: editingItem.description,
          startTime: editingItem.startTime,
          endTime: editingItem.endTime,
          location: editingItem.location,
          order: editingItem.order,
          important: editingItem.important,
        },
      },
    });
  };

  // Handle deleting a schedule item
  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteScheduleItem({
        variables: { id },
      });
    }
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Group schedule items by date
  // Extract date from startTime for grouping
  const getDateFromStartTime = (startTime: string) => {
    // If startTime contains a date part (ISO format), extract it
    if (startTime.includes('T')) {
      return startTime.split('T')[0];
    }
    // If it's just a time string, use today's date
    return new Date().toISOString().split('T')[0];
  };

  const groupedScheduleItems = React.useMemo(() => {
    if (!data?.scheduleItems) return {};
    
    return data.scheduleItems.reduce((groups: Record<string, ScheduleItem[]>, item: ScheduleItem) => {
      const date = getDateFromStartTime(item.startTime);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  }, [data?.scheduleItems]);

  // Sort dates chronologically
  const sortedDates = React.useMemo(() => {
    return Object.keys(groupedScheduleItems).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [groupedScheduleItems]);

  return (
    <AdminAuthGuard>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Wedding Schedule Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Schedule Event</DialogTitle>
                <DialogDescription>
                  Create a new event for your wedding day schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Event Title*
                  </label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Ceremony, Reception, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="startTime" className="text-sm font-medium">
                      Start Time*
                    </label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newItem.startTime}
                      onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="endTime" className="text-sm font-medium">
                      End Time
                    </label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newItem.endTime}
                      onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="Venue name or address"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Details about this event"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} disabled={createLoading}>
                  {createLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding
                    </>
                  ) : (
                    "Add Event"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Error loading schedule: {error.message}</p>
          </div>
        ) : data?.scheduleItems?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No events scheduled yet</h3>
            <p className="text-gray-500 mb-6">Add your first event to start building your wedding schedule</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Event
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <Card key={date} className="overflow-hidden border border-gray-200">
                <CardHeader className="bg-gray-50 py-4">
                  <CardTitle className="flex items-center text-xl">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    {formatDate(date)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {groupedScheduleItems[date]
                    .sort((a: any, b: any) => {
                      // Sort by startTime within each date
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map((item: ScheduleItem) => (
                      <div key={item.id} className="py-4 first:pt-6 last:pb-6">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">
                                {item.startTime}
                                {item.endTime && ` - ${item.endTime}`}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            {item.location && (
                              <p className="text-sm text-gray-600 mt-1">{item.location}</p>
                            )}
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-start space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Schedule Event</DialogTitle>
              <DialogDescription>
                Update the details of this event.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Event Title*
                  </label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-startTime" className="text-sm font-medium">
                      Start Time*
                    </label>
                    <Input
                      id="edit-startTime"
                      type="time"
                      value={editingItem.startTime}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-endTime" className="text-sm font-medium">
                      End Time
                    </label>
                    <Input
                      id="edit-endTime"
                      type="time"
                      value={editingItem.endTime}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="edit-location"
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, location: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditItem} disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuthGuard>
  );
};

export default SchedulePage;

