'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { RosterStudent } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User, TrendingUp } from 'lucide-react';
import { CellAction } from './cell-action';
import { ClassStudentWithStats } from '@/features/class/types';

interface CreateColumnsOptions {
  students: ClassStudentWithStats[];
}

export const createColumns = (
  options: CreateColumnsOptions
): ColumnDef<ClassStudentWithStats>[] => [
  {
    accessorKey: 'studentName',
    header: ({
      column
    }: {
      column: Column<ClassStudentWithStats, unknown>;
    }) => <DataTableColumnHeader column={column} title='Student' />,
    cell: ({ row }) => {
      const student = row.original;
      const initials = student.studentName
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
            <div className='font-medium'>{student.studentName}</div>
            <div className='text-muted-foreground text-sm'>
              ID: {student.studentId}
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
    accessorKey: 'ranking',
    header: ({
      column
    }: {
      column: Column<ClassStudentWithStats, unknown>;
    }) => <DataTableColumnHeader column={column} title='Ranking' />,
    cell: ({ row }) => {
      const ranking = row.original.ranking;
      return (
        <div className='flex items-center gap-1 text-sm'>
          <TrendingUp className='h-3 w-3' />#{ranking}
        </div>
      );
    }
  },
  {
    accessorKey: 'averageScore',
    header: ({
      column
    }: {
      column: Column<ClassStudentWithStats, unknown>;
    }) => <DataTableColumnHeader column={column} title='Average Score' />,
    cell: ({ row }) => {
      const averageScore = row.original.averageScore;

      if (averageScore === null || averageScore === undefined)
        return <span className='text-muted-foreground'>N/A</span>;

      const roundedScore = Math.round(averageScore);

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (roundedScore >= 8) variant = 'default';
      else if (roundedScore >= 7) variant = 'secondary';
      else if (roundedScore >= 6) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{roundedScore.toFixed(1)}</Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'behaviorNotes',
    header: 'Behavior Notes',
    cell: ({ row }) => {
      const count = row.original.behaviorNotes?.length || 0;
      return (
        <Badge variant={count > 0 ? 'outline' : 'secondary'}>
          {count} {count === 1 ? 'note' : 'notes'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
