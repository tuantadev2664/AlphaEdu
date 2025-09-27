// Gradebook Table for a Class
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import type { GradebookEntry } from '@/features/teacher/types';
import { columns } from './gradebook-table/columns';

export default function GradebookTable({
  data,
  classId,
  subjectId
}: {
  data: GradebookEntry[];
  classId: string;
  subjectId: string;
}) {
  const { table } = useDataTable<GradebookEntry>({
    data,
    columns,
    pageCount: Math.ceil(data.length / 10)
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
