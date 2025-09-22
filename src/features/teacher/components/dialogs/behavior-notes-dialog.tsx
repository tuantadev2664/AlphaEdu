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
import { RosterStudent } from '@/features/teacher/types';
import {
  FileText,
  Plus,
  Calendar,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BehaviorNotesDialogProps {
  student: RosterStudent;
  children: React.ReactNode;
}

// Mock behavior notes data
const mockBehaviorNotes = [
  {
    id: '1',
    note: 'Excellent participation in group discussions today. Showed great leadership skills.',
    level: 'excellent' as const,
    date: '2024-01-25T10:30:00Z',
    teacher: 'Ms. Johnson'
  },
  {
    id: '2',
    note: 'Had some difficulty focusing during math lesson. Recommend additional support.',
    level: 'needs_improvement' as const,
    date: '2024-01-22T14:15:00Z',
    teacher: 'Mr. Smith'
  },
  {
    id: '3',
    note: 'Helped a classmate with their assignment. Very kind and supportive behavior.',
    level: 'good' as const,
    date: '2024-01-20T09:45:00Z',
    teacher: 'Ms. Johnson'
  },
  {
    id: '4',
    note: 'Disrupted class by talking during instruction. Needs to work on listening skills.',
    level: 'poor' as const,
    date: '2024-01-18T11:20:00Z',
    teacher: 'Mr. Brown'
  }
];

const behaviorLevels = [
  {
    value: 'excellent',
    label: 'Excellent',
    icon: Star,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: 'good',
    label: 'Good',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    value: 'fair',
    label: 'Fair',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    value: 'needs_improvement',
    label: 'Needs Improvement',
    icon: AlertTriangle,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    value: 'poor',
    label: 'Poor',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

export function BehaviorNotesDialog({
  student,
  children
}: BehaviorNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<
    'excellent' | 'good' | 'fair' | 'needs_improvement' | 'poor'
  >('good');
  const [isLoading, setIsLoading] = useState(false);

  const initials = student.full_name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getLevelConfig = (level: string) => {
    return behaviorLevels.find((l) => l.value === level) || behaviorLevels[1];
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter a behavior note.',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setShowAddForm(false);
    setNewNote('');
    setSelectedLevel('good');

    toast.success('Note Added', {
      description: 'Behavior note has been added successfully.',
      duration: 3000
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success('Note Deleted', {
      description: 'Behavior note has been deleted.',
      duration: 3000
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <Avatar className='h-12 w-12'>
              <AvatarFallback className='bg-gradient-to-br from-orange-500 to-red-600 text-white'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='text-xl font-bold'>{student.full_name}</div>
              <div className='text-muted-foreground text-sm font-normal'>
                Behavior Notes & Tracking
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Behavior Summary
                </span>
                <Badge variant='outline'>
                  {mockBehaviorNotes.length} total notes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                {behaviorLevels.map((level) => {
                  const count = mockBehaviorNotes.filter(
                    (note) => note.level === level.value
                  ).length;
                  const Icon = level.icon;
                  return (
                    <div key={level.value} className='text-center'>
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${level.color} mb-2`}
                      >
                        <Icon className='h-5 w-5' />
                      </div>
                      <div className='text-2xl font-bold'>{count}</div>
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
                <CardTitle className='text-lg'>Add New Behavior Note</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Behavior Level</Label>
                  <div className='flex flex-wrap gap-2'>
                    {behaviorLevels.map((level) => {
                      const Icon = level.icon;
                      return (
                        <button
                          key={level.value}
                          type='button'
                          onClick={() => setSelectedLevel(level.value as any)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            selectedLevel === level.value
                              ? level.color
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className='h-3 w-3' />
                          {level.label}
                        </button>
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
                  <Button onClick={handleAddNote} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Note'}
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
              <h3 className='text-lg font-semibold'>Recent Behavior Notes</h3>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Add Note
              </Button>
            </div>
          )}

          {/* Behavior Notes List */}
          <div className='space-y-4'>
            {mockBehaviorNotes.map((note) => {
              const levelConfig = getLevelConfig(note.level);
              const Icon = levelConfig.icon;

              return (
                <Card
                  key={note.id}
                  className='transition-shadow hover:shadow-md'
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center gap-3'>
                          <div
                            className={`flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium ${levelConfig.color}`}
                          >
                            <Icon className='h-3 w-3' />
                            {levelConfig.label}
                          </div>
                          <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                            <Calendar className='h-3 w-3' />
                            {format(
                              new Date(note.date),
                              'MMM dd, yyyy • h:mm a'
                            )}
                          </div>
                        </div>
                        <p className='mb-2 text-sm'>{note.note}</p>
                        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                          <User className='h-3 w-3' />
                          Added by {note.teacher}
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteNote(note.id)}
                        className='text-red-600 hover:bg-red-50 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {mockBehaviorNotes.length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                <FileText className='mx-auto mb-4 h-12 w-12 opacity-50' />
                <p>No behavior notes recorded yet.</p>
                <p className='text-sm'>
                  Click &quot;Add Note&quot; to start tracking behavior.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
