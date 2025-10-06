'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassStudent } from '@/features/class/types';
import {
  useStudentBehaviorNotes,
  useCreateBehaviorNote,
  useUpdateBehaviorNote,
  useDeleteBehaviorNote
} from '@/features/teacher/hooks/use-behavior.query';
import type {
  CreateBehaviorNoteRequest,
  UpdateBehaviorNoteRequest
} from '@/features/teacher/types';
import {
  FileText,
  Plus,
  Calendar,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BehaviorNotesDialogProps {
  student: ClassStudent;
  children: React.ReactNode;
  classId?: string;
  termId?: string;
}

const behaviorLevels = [
  {
    value: 'Excellent',
    label: 'Excellent',
    icon: Star,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: 'Good',
    label: 'Good',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    value: 'Fair',
    label: 'Fair',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    value: 'Needs improvement',
    label: 'Needs Improvement',
    icon: AlertTriangle,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    value: 'Poor',
    label: 'Poor',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

export function BehaviorNotesDialog({
  student,
  children,
  classId,
  termId
}: BehaviorNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<
    'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor'
  >('Good');
  const [isLoading, setIsLoading] = useState(false);

  // Edit state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editLevel, setEditLevel] = useState<
    'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor'
  >('Good');

  // Fetch behavior notes from API using custom hook
  const {
    data: behaviorData,
    isLoading: isLoadingNotes,
    error
  } = useStudentBehaviorNotes(student.id, {
    enabled: open // Only fetch when dialog is open
  });

  // Mutations for creating, updating and deleting behavior notes
  const createBehaviorNoteMutation = useCreateBehaviorNote();
  const updateBehaviorNoteMutation = useUpdateBehaviorNote();
  const deleteBehaviorNoteMutation = useDeleteBehaviorNote();

  const initials = student.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getLevelConfig = (level: string) => {
    return behaviorLevels.find((l) => l.value === level) || behaviorLevels[1];
  };

  const behaviorNotes = behaviorData?.notes || [];
  const behaviorSummary = behaviorData?.summary;

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter a behavior note.',
        duration: 3000
      });
      return;
    }

    if (!classId || !termId) {
      toast.error('Missing Information', {
        description:
          'Class ID and Term ID are required to create behavior notes.',
        duration: 3000
      });
      return;
    }

    const behaviorNoteData: CreateBehaviorNoteRequest = {
      studentId: student.id,
      classId,
      termId,
      note: newNote.trim(),
      level: selectedLevel
    };

    try {
      await createBehaviorNoteMutation.mutateAsync(behaviorNoteData);

      setShowAddForm(false);
      setNewNote('');
      setSelectedLevel('Good');

      toast.success('Note Added', {
        description: 'Behavior note has been added successfully.',
        duration: 3000
      });
    } catch (error: any) {
      toast.error('Failed to Add Note', {
        description: error.message || 'Something went wrong. Please try again.',
        duration: 3000
      });
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setEditNote(note.note);
    setEditLevel(note.level);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditNote('');
    setEditLevel('Good');
  };

  const handleUpdateNote = async () => {
    if (!editNote.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter a behavior note.',
        duration: 3000
      });
      return;
    }

    if (!editingNoteId) return;

    const updateData: UpdateBehaviorNoteRequest = {
      id: editingNoteId,
      note: editNote.trim(),
      level: editLevel
    };

    try {
      await updateBehaviorNoteMutation.mutateAsync(updateData);

      setEditingNoteId(null);
      setEditNote('');
      setEditLevel('Good');

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

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteBehaviorNoteMutation.mutateAsync(noteId);

      toast.success('Note Deleted', {
        description: 'Behavior note has been deleted.',
        duration: 3000
      });
    } catch (error: any) {
      toast.error('Failed to Delete Note', {
        description: error.message || 'Something went wrong. Please try again.',
        duration: 3000
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <FileText className='h-5 w-5' />
            <div>
              <div className='text-lg font-semibold'>{student.fullName}</div>
              <div className='text-muted-foreground text-sm'>
                Behavior Notes & Tracking
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {isLoadingNotes ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>
                Loading behavior notes...
              </div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-destructive'>
                Failed to load behavior notes
              </div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      <FileText className='h-5 w-5' />
                      Behavior Summary
                    </span>
                    <Badge variant='outline'>
                      {behaviorNotes.length} total notes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                    {behaviorLevels.map((level) => {
                      const count =
                        behaviorSummary?.[
                          level.value === 'Excellent'
                            ? 'excellent_count'
                            : level.value === 'Good'
                              ? 'good_count'
                              : level.value === 'Fair'
                                ? 'fair_count'
                                : level.value === 'Needs improvement'
                                  ? 'needs_improvement_count'
                                  : 'poor_count'
                        ] || 0;
                      const Icon = level.icon;
                      return (
                        <div key={level.value} className='text-center'>
                          <div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg'>
                            <Icon className='text-primary h-4 w-4' />
                          </div>
                          <div className='text-xl font-bold'>{count}</div>
                          <div className='text-muted-foreground text-xs'>
                            {level.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Note */}
              {showAddForm ? (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      Add New Behavior Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>Behavior Level</Label>
                      <div className='flex flex-wrap gap-2'>
                        {behaviorLevels.map((level) => {
                          const Icon = level.icon;
                          return (
                            <Button
                              key={level.value}
                              type='button'
                              variant={
                                selectedLevel === level.value
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              onClick={() =>
                                setSelectedLevel(level.value as any)
                              }
                              className='flex items-center gap-2'
                            >
                              <Icon className='h-3 w-3' />
                              {level.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='note'>Note</Label>
                      <Textarea
                        id='note'
                        placeholder='Enter behavior note...'
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={handleAddNote}
                        disabled={createBehaviorNoteMutation.isPending}
                      >
                        {createBehaviorNoteMutation.isPending
                          ? 'Adding...'
                          : 'Add Note'}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>
                    Recent Behavior Notes
                  </h3>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Note
                  </Button>
                </div>
              )}

              {/* Behavior Notes List */}
              <div className='space-y-4'>
                {behaviorNotes.map((note) => {
                  const levelConfig = getLevelConfig(note.level);
                  const Icon = levelConfig.icon;
                  const isEditing = editingNoteId === note.id;

                  return (
                    <Card
                      key={note.id}
                      className='transition-shadow hover:shadow-md'
                    >
                      <CardContent className='p-4'>
                        {isEditing ? (
                          // Edit Mode
                          <div className='space-y-4'>
                            <div className='space-y-2'>
                              <Label>Behavior Level</Label>
                              <div className='flex flex-wrap gap-2'>
                                {behaviorLevels.map((level) => {
                                  const LevelIcon = level.icon;
                                  return (
                                    <Button
                                      key={level.value}
                                      type='button'
                                      variant={
                                        editLevel === level.value
                                          ? 'default'
                                          : 'outline'
                                      }
                                      size='sm'
                                      onClick={() =>
                                        setEditLevel(level.value as any)
                                      }
                                      className='flex items-center gap-2'
                                    >
                                      <LevelIcon className='h-3 w-3' />
                                      {level.label}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='edit-note'>Note</Label>
                              <Textarea
                                id='edit-note'
                                placeholder='Enter behavior note...'
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className='flex gap-2'>
                              <Button
                                onClick={handleUpdateNote}
                                disabled={updateBehaviorNoteMutation.isPending}
                                size='sm'
                              >
                                <Save className='mr-2 h-3 w-3' />
                                {updateBehaviorNoteMutation.isPending
                                  ? 'Updating...'
                                  : 'Update'}
                              </Button>
                              <Button
                                variant='outline'
                                onClick={handleCancelEdit}
                                size='sm'
                              >
                                <X className='mr-2 h-3 w-3' />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1'>
                              <div className='mb-2 flex items-center gap-3'>
                                <Badge
                                  variant='outline'
                                  className='flex items-center gap-1'
                                >
                                  <Icon className='h-3 w-3' />
                                  {levelConfig.label}
                                </Badge>
                                <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                                  <Calendar className='h-3 w-3' />
                                  {format(
                                    new Date(note.created_at),
                                    'MMM dd, yyyy • h:mm a'
                                  )}
                                </div>
                              </div>
                              <p className='mb-2 text-sm'>{note.note}</p>
                              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                                <User className='h-3 w-3' />
                                Added by{' '}
                                {note.created_by_user?.full_name ||
                                  'Unknown Teacher'}
                              </div>
                            </div>
                            <div className='flex gap-1'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEditNote(note)}
                                className='text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteNote(note.id)}
                                disabled={deleteBehaviorNoteMutation.isPending}
                                className='text-red-600 hover:bg-red-50 hover:text-red-700'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {behaviorNotes.length === 0 && (
                  <div className='text-muted-foreground py-8 text-center'>
                    <FileText className='mx-auto mb-4 h-12 w-12 opacity-50' />
                    <p>No behavior notes recorded yet.</p>
                    <p className='text-sm'>
                      Click &quot;Add Note&quot; to start tracking behavior.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
