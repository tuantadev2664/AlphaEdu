'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { StudentScore, Score } from '@/features/score/type';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User, Calculator, BookOpen } from 'lucide-react';

// Helper function to get unique assessments from all students
function getUniqueAssessments(data: StudentScore[]): Score[] {
  const assessmentMap = new Map<string, Score>();

  data.forEach((student) => {
    student.scores.forEach((score) => {
      if (!assessmentMap.has(score.gradeComponentId)) {
        assessmentMap.set(score.gradeComponentId, score);
      }
    });
  });

  return Array.from(assessmentMap.values()).sort((a, b) => {
    // Sort by position if available, otherwise by name
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    return a.gradeComponentName.localeCompare(b.gradeComponentName);
  });
}

export function createScoreColumns(
  data: StudentScore[]
): ColumnDef<StudentScore>[] {
  const uniqueAssessments = getUniqueAssessments(data);

  const baseColumns: ColumnDef<StudentScore>[] = [
    {
      accessorKey: 'fullName',
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
                ID: {student.studentId.substring(0, 8)}...
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
    }
  ];

  // Create columns for each assessment
  const assessmentColumns: ColumnDef<StudentScore>[] = uniqueAssessments.map(
    (assessment) => ({
      id: `assessment_${assessment.gradeComponentId}`,
      header: () => (
        <div className='text-center'>
          <div className='font-medium'>{assessment.gradeComponentName}</div>
          <div className='text-muted-foreground text-xs'>
            {assessment.kind} • Tối Đa: {assessment.maxScore}
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const student = row.original;
        const score = student.scores.find(
          (s) => s.gradeComponentId === assessment.gradeComponentId
        );

        if (!score) {
          return <div className='text-muted-foreground text-center'>-</div>;
        }

        if (score.isAbsent) {
          return (
            <div className='flex flex-col items-center gap-1'>
              <Badge variant='destructive' className='text-xs'>
                Vắng
              </Badge>
            </div>
          );
        }

        // Calculate percentage
        const percentage = (score.score / score.maxScore) * 100;

        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'default';
        if (percentage >= 90) variant = 'default';
        else if (percentage >= 80) variant = 'secondary';
        else if (percentage >= 70) variant = 'outline';
        else variant = 'destructive';

        return (
          <div className='flex flex-col items-center gap-1'>
            <Badge variant={variant}>
              {score.score}/{score.maxScore}
            </Badge>
            <div className='text-muted-foreground text-xs'>
              {percentage.toFixed(0)}%
            </div>
            {score.comment && (
              <div
                className='text-muted-foreground max-w-20 truncate text-xs'
                title={score.comment}
              >
                {score.comment}
              </div>
            )}
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const studentA = rowA.original;
        const studentB = rowB.original;
        const scoreA = studentA.scores.find(
          (s) => s.gradeComponentId === assessment.gradeComponentId
        );
        const scoreB = studentB.scores.find(
          (s) => s.gradeComponentId === assessment.gradeComponentId
        );

        if (!scoreA && !scoreB) return 0;
        if (!scoreA) return 1;
        if (!scoreB) return -1;
        if (scoreA.isAbsent && scoreB.isAbsent) return 0;
        if (scoreA.isAbsent) return 1;
        if (scoreB.isAbsent) return -1;

        return scoreA.score - scoreB.score;
      }
    })
  );

  // Average column
  const averageColumn: ColumnDef<StudentScore> = {
    id: 'average',
    header: ({ column }: { column: Column<StudentScore, unknown> }) => (
      <DataTableColumnHeader column={column} title='Điểm Trung Bình' />
    ),
    cell: ({ row }) => {
      const student = row.original;
      const completedScores = student.scores.filter((score) => !score.isAbsent);

      if (completedScores.length === 0) {
        return <div className='text-muted-foreground text-center'>N/A</div>;
      }

      // Calculate weighted average
      const totalWeightedScore = completedScores.reduce((sum, score) => {
        return sum + (score.score / score.maxScore) * 100 * score.weight;
      }, 0);

      const totalWeight = completedScores.reduce((sum, score) => {
        return sum + score.weight;
      }, 0);

      const average = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'default';
      if (average >= 90) variant = 'default';
      else if (average >= 80) variant = 'secondary';
      else if (average >= 70) variant = 'outline';
      else variant = 'destructive';

      return (
        <div className='flex flex-col items-center gap-1'>
          <Badge variant={variant} className='font-medium'>
            {average.toFixed(1)}%
          </Badge>
          <div className='flex items-center gap-1'>
            <Calculator className='text-muted-foreground h-3 w-3' />
            <span className='text-muted-foreground text-xs'>
              {completedScores.length}/{student.scores.length}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const calculateAverage = (student: StudentScore) => {
        const completedScores = student.scores.filter(
          (score) => !score.isAbsent
        );
        if (completedScores.length === 0) return 0;

        const totalWeightedScore = completedScores.reduce((sum, score) => {
          return sum + (score.score / score.maxScore) * 100 * score.weight;
        }, 0);

        const totalWeight = completedScores.reduce((sum, score) => {
          return sum + score.weight;
        }, 0);

        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
      };

      return calculateAverage(rowA.original) - calculateAverage(rowB.original);
    }
  };

  return [...baseColumns, ...assessmentColumns, averageColumn];
}
