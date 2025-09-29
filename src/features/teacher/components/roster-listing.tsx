'use client';

import { useClassStudents } from '@/features/class/hooks/use-class.query';
import { createColumns } from './roster-table/columns';
import { RosterTable } from './roster-table';

interface RosterListingProps {
  classId: string;
}

export default function RosterListing({ classId }: RosterListingProps) {
  const {
    data: studentsData,
    isLoading,
    error
  } = useClassStudents({
    classId,
    academicYearId: '5a45bd68-561e-4bbf-b594-b7636684ee4b'
  });

  console.log('studentsData', studentsData);

  // Extract students array from API response
  const students = studentsData || [];
  const columns = createColumns({ students });

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Student Roster</h2>
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='bg-muted h-16 w-full animate-pulse rounded'
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Student Roster</h2>
        </div>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <p className='text-red-800'>
            Failed to load student roster: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Student Roster</h2>
      </div>

      <RosterTable
        data={students}
        totalItems={students.length}
        columns={columns}
      />
    </div>
  );
}
