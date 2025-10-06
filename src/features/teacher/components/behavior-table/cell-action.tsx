'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { BehaviorNote } from '@/features/teacher/types';
import {
  useUpdateBehaviorNote,
  useDeleteBehaviorNote
} from '@/features/teacher/hooks/use-behavior.query';
import type { UpdateBehaviorNoteRequest } from '@/features/teacher/types';
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface CellActionProps {
  data: BehaviorNote;
  classId: string;
  termId?: string;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  classId,
  termId
}) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editNote, setEditNote] = useState(data.note);
  const [editLevel, setEditLevel] = useState<
    'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor'
  >(data.level as any);

  // Mutations
  const updateBehaviorNoteMutation = useUpdateBehaviorNote();
  const deleteBehaviorNoteMutation = useDeleteBehaviorNote();

  const handleView = () => {
    setViewOpen(true);
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBehaviorNoteMutation.mutateAsync(data.id);
      setDeleteOpen(false);
      toast.success('Note Deleted', {
        description: 'Behavior note has been deleted successfully.',
        duration: 3000
      });
    } catch (error: any) {
      toast.error('Failed to Delete Note', {
        description: error.message || 'Something went wrong. Please try again.',
        duration: 3000
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const updateData: UpdateBehaviorNoteRequest = {
      id: data.id,
      note: editNote.trim(),
      level: editLevel
    };

    try {
      await updateBehaviorNoteMutation.mutateAsync(updateData);
      setEditOpen(false);
      toast.success('Note Updated', {
        description: 'Behavior note has been updated successfully.',
        duration: 3000
      });
    } catch (error: any) {
      toast.error('Failed to Update Note', {
        description: error.message || 'Something went wrong. Please try again.',
        duration: 3000
      });
    }
  };

  return (
    <>
      {/* View Note Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Eye className='h-5 w-5' />
              Behavior Note Details
            </DialogTitle>
            <DialogDescription>
              Note for {data.student?.full_name || 'Unknown Student'} on{' '}
              {new Date(data.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <div className='space-y-4'>
              <div>
                <Label>Student</Label>
                <p className='text-sm font-medium'>
                  {data.student?.full_name || 'Unknown Student'}
                </p>
              </div>
              <div>
                <Label>Behavior Level</Label>
                <p className='text-sm font-medium capitalize'>
                  {data.level.replace('_', ' ')}
                </p>
              </div>
              <div>
                <Label>Note</Label>
                <p className='text-sm'>{data.note}</p>
              </div>
              <div>
                <Label>Teacher</Label>
                <p className='text-sm'>
                  {data.created_by_user?.full_name || 'Unknown Teacher'}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Edit3 className='h-5 w-5' />
              Edit Behavior Note
            </DialogTitle>
            <DialogDescription>
              Edit the behavior note for{' '}
              {data.student?.full_name || 'Unknown Student'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='behavior-level'>Behavior Level</Label>
              <Select
                value={editLevel}
                onValueChange={(value: any) => setEditLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select behavior level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Excellent'>Excellent</SelectItem>
                  <SelectItem value='Good'>Good</SelectItem>
                  <SelectItem value='Fair'>Fair</SelectItem>
                  <SelectItem value='Needs improvement'>
                    Needs Improvement
                  </SelectItem>
                  <SelectItem value='Poor'>Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='note'>Note</Label>
              <Textarea
                id='note'
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={4}
                placeholder='Enter behavior note...'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateBehaviorNoteMutation.isPending}
            >
              {updateBehaviorNoteMutation.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Trash2 className='h-5 w-5' />
              Delete Behavior Note
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this behavior note for{' '}
              {data.student?.full_name || 'Unknown Student'}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteBehaviorNoteMutation.isPending}
            >
              {deleteBehaviorNoteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleView}>
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit}>
            <Edit3 className='mr-2 h-4 w-4' />
            Edit Note
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className='text-red-600 focus:text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
