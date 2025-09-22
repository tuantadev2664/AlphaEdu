'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { RosterStudent } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Mail, Phone, User, TrendingUp } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<RosterStudent>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column }: { column: Column<RosterStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original;
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
    accessorKey: 'average_score',
    header: ({ column }: { column: Column<RosterStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Average Score' />
    ),
    cell: ({ row }) => {
      const score = row.original.average_score;
      if (!score) return <span className='text-muted-foreground'>N/A</span>;

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (score >= 90) variant = 'default';
      else if (score >= 80) variant = 'secondary';
      else if (score >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{score}%</Badge>
          <TrendingUp className='text-muted-foreground h-3 w-3' />
        </div>
      );
    }
  },
  {
    accessorKey: 'behavior_notes_count',
    header: 'Behavior Notes',
    cell: ({ row }) => {
      const count = row.original.behavior_notes_count || 0;
      return (
        <Badge variant={count > 0 ? 'outline' : 'secondary'}>
          {count} {count === 1 ? 'note' : 'notes'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<RosterStudent, unknown> }) => (
      <DataTableColumnHeader column={column} title='Enrolled' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <div className='text-sm'>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
