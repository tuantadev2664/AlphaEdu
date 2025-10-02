'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { RosterStudent } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Mail, Phone, User, TrendingUp } from 'lucide-react';
import { CellAction } from './cell-action';
import { ClassStudent } from '@/features/class/types';

interface CreateColumnsOptions {
  students: ClassStudent[];
}

export const createColumns = (
  options: CreateColumnsOptions
): ColumnDef<ClassStudent>[] => [
  {
    accessorKey: 'fullName',
    header: ({ column }: { column: Column<ClassStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original;
      const initials = student.fullName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{student.fullName}</div>
            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
              <Mail className='h-3 w-3' />
              {student.email}
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
    enableColumnFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'Contact',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className='flex items-center gap-1 text-sm'>
          <Phone className='h-3 w-3' />
          {student.phone}
        </div>
      );
    }
  },
  {
    id: 'averageScore',
    header: ({ column }: { column: Column<ClassStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Average Score' />
    ),
    cell: ({ row }) => {
      // Calculate average from scoreStudents array
      const scores = row.original.scoreStudents || [];
      if (scores.length === 0)
        return <span className='text-muted-foreground'>N/A</span>;

      const average =
        scores.reduce((sum, score) => sum + (score.score || 0), 0) /
        scores.length;
      const roundedScore = Math.round(average);

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (roundedScore >= 90) variant = 'default';
      else if (roundedScore >= 80) variant = 'secondary';
      else if (roundedScore >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{roundedScore}%</Badge>
          <TrendingUp className='text-muted-foreground h-3 w-3' />
        </div>
      );
    }
  },
  {
    id: 'behaviorNotes',
    header: 'Behavior Notes',
    cell: ({ row }) => {
      const count = row.original.behaviorNoteStudents?.length || 0;
      return (
        <Badge variant={count > 0 ? 'outline' : 'secondary'}>
          {count} {count === 1 ? 'note' : 'notes'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<ClassStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Enrolled' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div className='text-sm'>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
