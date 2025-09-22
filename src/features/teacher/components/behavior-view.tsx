'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BehaviorNote,
  RosterStudent,
  BehaviorLevel
} from '@/features/teacher/types';
import {
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { BehaviorNoteForm } from './behavior-note-form';

interface BehaviorViewProps {
  notes: BehaviorNote[];
  students: RosterStudent[];
  classId: string;
}

export function BehaviorView({ notes, students, classId }: BehaviorViewProps) {
  const [showForm, setShowForm] = useState(false);

  const getBehaviorIcon = (level: BehaviorLevel) => {
    switch (level) {
      case 'excellent':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'good':
        return <CheckCircle className='h-4 w-4 text-blue-600' />;
      case 'fair':
        return <Minus className='h-4 w-4 text-yellow-600' />;
      case 'needs_improvement':
        return <AlertTriangle className='h-4 w-4 text-orange-600' />;
      case 'poor':
        return <XCircle className='h-4 w-4 text-red-600' />;
      default:
        return <Minus className='h-4 w-4 text-gray-600' />;
    }
  };

  const getBehaviorVariant = (
    level: BehaviorLevel
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (level) {
      case 'excellent':
      case 'good':
        return 'default';
      case 'fair':
        return 'secondary';
      case 'needs_improvement':
        return 'outline';
      case 'poor':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Group notes by student
  const notesByStudent = notes.reduce(
    (acc, note) => {
      if (!acc[note.student_id]) {
        acc[note.student_id] = [];
      }
      acc[note.student_id].push(note);
      return acc;
    },
    {} as Record<string, BehaviorNote[]>
  );

  return (
    <div className='space-y-6'>
      {/* Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Badge variant='outline' className='text-sm'>
            {notes.length} total notes
          </Badge>
          <Badge variant='outline' className='text-sm'>
            {Object.keys(notesByStudent).length} students with notes
          </Badge>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add Behavior Note
        </Button>
      </div>

      {/* Behavior Note Form Modal */}
      {showForm && (
        <BehaviorNoteForm
          students={students}
          classId={classId}
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            console.log('Behavior note submitted:', data);
            setShowForm(false);
          }}
        />
      )}

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Recent Behavior Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {notes.slice(0, 10).map((note) => {
              const student = students.find((s) => s.id === note.student_id);
              if (!student) return null;

              const initials = student.full_name
                .split(' ')
                .map((name) => name[0])
                .join('')
                .toUpperCase();

              return (
                <div
                  key={note.id}
                  className='flex items-start gap-4 rounded-lg border p-4'
                >
                  <Avatar className='h-10 w-10'>
                    <AvatarFallback className='text-sm'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <h4 className='font-medium'>{student.full_name}</h4>
                        <Badge
                          variant={getBehaviorVariant(note.level)}
                          className='flex items-center gap-1'
                        >
                          {getBehaviorIcon(note.level)}
                          {note.level.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className='text-muted-foreground text-sm'>
                        {format(new Date(note.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <p className='text-muted-foreground text-sm'>{note.note}</p>
                  </div>
                </div>
              );
            })}

            {notes.length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                No behavior notes recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Student Behavior Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {students.map((student) => {
              const studentNotes = notesByStudent[student.id] || [];
              const recentNote = studentNotes[0];

              const initials = student.full_name
                .split(' ')
                .map((name) => name[0])
                .join('')
                .toUpperCase();

              return (
                <div key={student.id} className='rounded-lg border p-4'>
                  <div className='mb-3 flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='text-xs'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h5 className='text-sm font-medium'>
                        {student.full_name}
                      </h5>
                      <p className='text-muted-foreground text-xs'>
                        {studentNotes.length}{' '}
                        {studentNotes.length === 1 ? 'note' : 'notes'}
                      </p>
                    </div>
                  </div>

                  {recentNote ? (
                    <div className='space-y-2'>
                      <Badge
                        variant={getBehaviorVariant(recentNote.level)}
                        className='flex w-fit items-center gap-1'
                      >
                        {getBehaviorIcon(recentNote.level)}
                        {recentNote.level.replace('_', ' ')}
                      </Badge>
                      <p className='text-muted-foreground line-clamp-2 text-xs'>
                        {recentNote.note}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {format(new Date(recentNote.created_at), 'MMM dd')}
                      </p>
                    </div>
                  ) : (
                    <div className='py-4 text-center'>
                      <Badge variant='secondary'>No notes</Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
