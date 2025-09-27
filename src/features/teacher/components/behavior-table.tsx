// Behavior Table for a Class
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { BehaviorNote } from '@/features/teacher/types';
import { columns } from './behavior-table/columns';

interface BehaviorTableProps {
  data: BehaviorNote[];
  totalItems: number;
  columns: ColumnDef<BehaviorNote, any>[];
  classId: string;
}

export function BehaviorTable({
  data,
  totalItems,
  columns,
  classId
}: BehaviorTableProps) {
  const { table } = useDataTable<BehaviorNote>({
    data,
    columns,
    pageCount: Math.ceil(totalItems / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: 'created_at', desc: true }]
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
