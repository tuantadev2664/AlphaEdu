'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { GradebookEntry } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User, Calculator, BookOpen } from 'lucide-react';
import { CellAction } from './cell-action';

// Mock assessments for display
const assessments = [
  { name: 'Quiz 1', type: 'quiz' },
  { name: 'Test 1', type: 'test' },
  { name: 'Quiz 2', type: 'quiz' },
  { name: 'Midterm', type: 'test' },
  { name: 'Project', type: 'project' }
];

export const columns: ColumnDef<GradebookEntry>[] = [
  {
    accessorKey: 'student',
    header: ({ column }: { column: Column<GradebookEntry, unknown> }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original.student;
      const initials = student.full_name
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
            <div className='font-medium'>{student.full_name}</div>
            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
              <User className='h-3 w-3' />
              ID: {student.id}
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
  ...assessments.map((assessment, index) => ({
    id: `assessment_${index}`,
    header: assessment.name,
    cell: ({ row }: { row: any }) => {
      const entry = row.original as GradebookEntry;
      const score = entry.scores[index];

      if (!score) {
        return <span className='text-muted-foreground'>-</span>;
      }

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (score.score >= 90) variant = 'default';
      else if (score.score >= 80) variant = 'secondary';
      else if (score.score >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{score.score}</Badge>
          {score.is_absent && (
            <Badge variant='destructive' className='text-xs'>
              Absent
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true
  })),
  {
    accessorKey: 'average_score',
    header: ({ column }: { column: Column<GradebookEntry, unknown> }) => (
      <DataTableColumnHeader column={column} title='Average Score' />
    ),
    cell: ({ row }) => {
      const average = row.original.average_score || 0;
      if (!average) return <span className='text-muted-foreground'>N/A</span>;

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (average >= 90) variant = 'default';
      else if (average >= 80) variant = 'secondary';
      else if (average >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{average}%</Badge>
          <Calculator className='text-muted-foreground h-3 w-3' />
        </div>
      );
    },
    enableSorting: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
