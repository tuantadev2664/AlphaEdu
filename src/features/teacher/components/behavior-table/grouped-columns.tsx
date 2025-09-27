'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { BehaviorNote } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { CellAction } from './cell-action';
import type { GroupedBehaviorNote } from '@/features/teacher/utils/group-behavior-notes';

const getBehaviorIcon = (level: string) => {
  switch (level) {
    case 'excellent':
      return <CheckCircle className='h-3 w-3' />;
    case 'good':
      return <CheckCircle className='h-3 w-3' />;
    case 'fair':
      return <Minus className='h-3 w-3' />;
    case 'needs_improvement':
      return <AlertTriangle className='h-3 w-3' />;
    case 'poor':
      return <XCircle className='h-3 w-3' />;
    default:
      return <Minus className='h-3 w-3' />;
  }
};

const getBehaviorVariant = (level: string) => {
  switch (level) {
    case 'excellent':
      return 'default';
    case 'good':
      return 'secondary';
    case 'fair':
      return 'outline';
    case 'needs_improvement':
      return 'destructive';
    case 'poor':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Component for expandable row content
const ExpandedNotes = ({ notes }: { notes: BehaviorNote[] }) => {
  return (
    <div className='bg-muted/30 space-y-3 p-4'>
      <h4 className='text-sm font-medium'>All Behavior Notes:</h4>
      {notes.map((note) => (
        <div
          key={note.id}
          className='bg-background flex items-start gap-3 rounded-lg border p-3'
        >
          <div className='flex items-center gap-2'>
            <Badge
              variant={
                getBehaviorVariant(note.level) as
                  | 'default'
                  | 'secondary'
                  | 'destructive'
                  | 'outline'
              }
              className='flex items-center gap-1'
            >
              {getBehaviorIcon(note.level)}
              {note.level.charAt(0).toUpperCase() +
                note.level.slice(1).replace('_', ' ')}
            </Badge>
          </div>
          <div className='flex-1'>
            <p className='text-sm'>{note.note}</p>
            <div className='text-muted-foreground mt-2 flex items-center gap-4 text-xs'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3' />
                {format(new Date(note.created_at), 'MMM dd, yyyy')}
              </div>
              <div>
                By: {note.created_by_user?.full_name || 'Unknown Teacher'}
              </div>
            </div>
          </div>
          <CellAction data={note} />
        </div>
      ))}
    </div>
  );
};

export const groupedColumns: ColumnDef<GroupedBehaviorNote>[] = [
  {
    id: 'expander',
    header: '',
    cell: ({ row }) => {
      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => row.toggleExpanded()}
          className='h-6 w-6 p-0'
        >
          {row.getIsExpanded() ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'student_name',
    header: ({ column }: { column: Column<GroupedBehaviorNote, unknown> }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original.student;
      const studentName = row.original.student_name;
      const initials = studentName
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase();

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{studentName}</div>
            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
              <User className='h-3 w-3' />
              {row.original.note_count}{' '}
              {row.original.note_count === 1 ? 'note' : 'notes'}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: 'Student Name',
      placeholder: 'Search students...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'behavior_summary',
    header: 'Behavior Summary',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className='flex flex-wrap gap-1'>
          {data.excellent_count > 0 && (
            <Badge variant='default' className='text-xs'>
              {data.excellent_count} Excellent
            </Badge>
          )}
          {data.good_count > 0 && (
            <Badge variant='secondary' className='text-xs'>
              {data.good_count} Good
            </Badge>
          )}
          {data.fair_count > 0 && (
            <Badge variant='outline' className='text-xs'>
              {data.fair_count} Fair
            </Badge>
          )}
          {data.needs_improvement_count > 0 && (
            <Badge variant='destructive' className='text-xs'>
              {data.needs_improvement_count} Needs Improvement
            </Badge>
          )}
          {data.poor_count > 0 && (
            <Badge variant='destructive' className='text-xs'>
              {data.poor_count} Poor
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'latest_note',
    header: 'Latest Note',
    cell: ({ row }) => {
      const latestNote = row.original.latest_note;
      const variant = getBehaviorVariant(latestNote.level) as
        | 'default'
        | 'secondary'
        | 'destructive'
        | 'outline';

      return (
        <div className='space-y-2'>
          <Badge variant={variant} className='flex w-fit items-center gap-1'>
            {getBehaviorIcon(latestNote.level)}
            {latestNote.level.charAt(0).toUpperCase() +
              latestNote.level.slice(1).replace('_', ' ')}
          </Badge>
          <p className='line-clamp-2 max-w-md text-sm'>{latestNote.note}</p>
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'latest_date',
    header: ({ column }: { column: Column<GroupedBehaviorNote, unknown> }) => (
      <DataTableColumnHeader column={column} title='Latest Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.latest_note.created_at);
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground h-3 w-3' />
          <div className='text-sm'>{format(date, 'MMM dd, yyyy')}</div>
        </div>
      );
    },
    enableSorting: true
  }
];

// Export the ExpandedNotes component for use in the table
export { ExpandedNotes };
