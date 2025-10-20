'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { StudentScore } from '@/features/score/type';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User, Calculator, BookOpen } from 'lucide-react';
import { CellAction } from './cell-action';
import { EditableScoreCell } from './editable-score-cell';
import { EditableCommentCell } from './editable-comment-cell';

interface CreateColumnsOptions {
  studentScores: StudentScore[];
  onViewDetails?: (student: StudentScore) => void;
  onEditDetails?: (student: StudentScore) => void;
  onUpdateScore?: (
    scoreId: string,
    newScore: number,
    isAbsent: boolean
  ) => Promise<void>;
  onUpdateComment?: (scoreId: string, comment: string) => Promise<void>;
  isUpdating?: boolean;
  canEdit?: boolean;
}

export const createColumns = (
  options: CreateColumnsOptions
): ColumnDef<StudentScore>[] => [
  {
    accessorKey: 'student',
    header: ({ column }: { column: Column<StudentScore, unknown> }) => (
      <DataTableColumnHeader column={column} title='Học Sinh' />
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
              <User className='h-3 w-3' />
              ID: {student.fullName}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: 'Tên Học Sinh',
      placeholder: 'Tìm kiếm học sinh...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: false
  },
  // Generate assessment columns from the first student's scores
  ...(options.studentScores[0]?.scores || []).map((_, assessmentIndex) => ({
    id: `assessment_${assessmentIndex}`,
    header:
      options.studentScores[0]?.scores[assessmentIndex]?.gradeComponentName ||
      `Đánh Giá ${assessmentIndex + 1}`,
    cell: ({ row }: { row: any }) => {
      const entry = row.original as StudentScore;
      const score = entry.scores[assessmentIndex];

      if (!score) {
        return <span className='text-muted-foreground'>-</span>;
      }

      // Use editable cell if editing is enabled and user can edit
      if (options.canEdit && options.onUpdateScore) {
        return (
          <EditableScoreCell
            score={score}
            onUpdate={options.onUpdateScore}
            isUpdating={options.isUpdating || false}
            disabled={!options.canEdit}
          />
        );
      }

      // Fallback to read-only display
      const percentage = (score.score / score.maxScore) * 100;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (percentage >= 90) variant = 'default';
      else if (percentage >= 80) variant = 'secondary';
      else if (percentage >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>
            {score.score}/{score.maxScore}
          </Badge>
          {score.isAbsent && (
            <Badge variant='destructive' className='text-xs'>
              Vắng
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true
  })),
  {
    accessorKey: 'average_score',
    header: ({ column }: { column: Column<StudentScore, unknown> }) => (
      <DataTableColumnHeader column={column} title='Điểm Trung Bình' />
    ),
    cell: ({ row }) => {
      const average =
        row.original.scores.reduce(
          (sum, score) => sum + score.score * score.weight,
          0
        ) / row.original.scores.reduce((sum, score) => sum + score.weight, 0);
      if (!average)
        return <span className='text-muted-foreground'>Không Có Điểm</span>;

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (average >= 9) variant = 'default';
      else if (average >= 8) variant = 'secondary';
      else if (average >= 7) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex items-center gap-2'>
          <Badge variant={variant}>{average.toFixed(2)}%</Badge>
          <Calculator className='text-muted-foreground h-3 w-3' />
        </div>
      );
    },
    enableSorting: true
  },
  // Comments column - only show if editing is enabled
  // ...(options.canEdit ? [{
  //   id: 'comments',
  //   header: 'Comments',
  //   cell: ({ row }: { row: any }) => {
  //     const entry = row.original as StudentScore;
  //     const firstScore = entry.scores[0];

  //     if (!firstScore || !options.onUpdateComment) {
  //       return <span className='text-muted-foreground'>-</span>;
  //     }

  //     return (
  //       <EditableCommentCell
  //         scoreId={firstScore.scoreId}
  //         comment={firstScore.comment}
  //         onUpdate={options.onUpdateComment}
  //         isUpdating={options.isUpdating || false}
  //         disabled={!options.canEdit}
  //       />
  //     );
  //   },
  //   enableSorting: false
  // }] : []),
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction
        data={row.original}
        onViewDetails={options.onViewDetails}
        onEditDetails={options.onEditDetails}
      />
    )
  }
];
