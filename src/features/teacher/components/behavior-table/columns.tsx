'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { BehaviorNote } from '@/features/teacher/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  User,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { CellAction } from './cell-action';

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

export const columns: ColumnDef<BehaviorNote>[] = [
  {
    accessorKey: 'student',
    header: ({ column }: { column: Column<BehaviorNote, unknown> }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original.student;
      const studentName = student?.full_name || 'Unknown Student';
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
              ID: {student?.id || 'N/A'}
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
    accessorKey: 'level',
    header: ({ column }: { column: Column<BehaviorNote, unknown> }) => (
      <DataTableColumnHeader column={column} title='Behavior Level' />
    ),
    cell: ({ row }) => {
      const level = row.original.level;
      const variant = getBehaviorVariant(level) as
        | 'default'
        | 'secondary'
        | 'destructive'
        | 'outline';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant} className='flex items-center gap-1'>
            {getBehaviorIcon(level)}
            {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const note = row.original.note;
      return (
        <div className='max-w-md'>
          <p className='line-clamp-2 text-sm'>{note}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<BehaviorNote, unknown> }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground h-3 w-3' />
          <div className='text-sm'>{format(date, 'MMM dd, yyyy')}</div>
        </div>
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'created_by_user',
    header: 'Teacher',
    cell: ({ row }) => {
      const teacher = row.original.created_by_user;
      const teacherName = teacher?.full_name || 'Unknown Teacher';
      return <div className='text-sm font-medium'>{teacherName}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
