// Roster Table for a Class
import { fakeRoster } from '@/constants/mock-api-teacher';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { RosterStudent } from '@/features/teacher/types';

const columns: ColumnDef<RosterStudent>[] = [
  { accessorKey: 'full_name', header: 'Student Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' }
];

export default function RosterTable({ classId }: { classId: string }) {
  const data = fakeRoster.filter((s) => s.class_id === classId);
  const { table } = useDataTable<RosterStudent>({
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
