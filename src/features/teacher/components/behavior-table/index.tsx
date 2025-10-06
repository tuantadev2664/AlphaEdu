'use client';

import { Fragment } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface BehaviorTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  classId: string;
  termId?: string;
  expandedContent?: React.ComponentType<{
    notes: any[];
    classId: string;
    termId?: string;
  }>;
  isLoading?: boolean;
  error?: any;
}

export function BehaviorTable<TData, TValue>({
  data,
  totalItems,
  columns,
  classId,
  termId,
  expandedContent: ExpandedContent,
  isLoading,
  error
}: BehaviorTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
    enableExpanding: !!ExpandedContent
  });

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Loading behavior notes...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-destructive'>Failed to load behavior notes</div>
        </div>
      </div>
    );
  }

  // If we have expandedContent, render custom table with expandable rows
  if (ExpandedContent) {
    return (
      <div className='space-y-4'>
        <DataTableToolbar table={table} />
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      className='hover:bg-muted/50 cursor-pointer'
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <ExpandedContent
                            notes={(row.original as any).notes}
                            classId={classId}
                            termId={termId}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Default table without expansion
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
