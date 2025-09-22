// Gradebook Table for a Class
import { fakeGradebook } from '@/constants/mock-api-teacher';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { GradebookEntry } from '@/features/teacher/types';

const columns: ColumnDef<GradebookEntry>[] = [
  { accessorKey: 'student_name', header: 'Student' },
  { accessorKey: 'subject_name', header: 'Subject' },
  {
    accessorKey: 'scores',
    header: 'Scores',
    cell: ({ row }) => (
      <ul>
        {row.original.scores.map((s) => (
          <li key={s.assessment_id}>
            {s.assessment_title}: {s.score}/{s.max_score}
          </li>
        ))}
      </ul>
    )
  }
];

export default function GradebookTable({ classId }: { classId: string }) {
  const data = fakeGradebook.filter((g) => g.class_id === classId);
  const { table } = useDataTable<GradebookEntry>({
    data,
    columns,
    pageCount: 1
  });
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
