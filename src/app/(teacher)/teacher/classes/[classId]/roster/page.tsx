import { fakeTeacher } from '@/constants/mock-api';
import { RosterTable } from '@/features/teacher/components/roster-table/index';
import { columns } from '@/features/teacher/components/roster-table/columns';

interface RosterPageProps {
  params: { classId: string };
}

export default async function RosterPage({ params }: RosterPageProps) {
  const { classId } = await params;
  const studentsData = await fakeTeacher.getClassStudents(classId);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Student Roster</h2>
      </div>

      <RosterTable
        data={studentsData.students}
        totalItems={studentsData.total}
        columns={columns}
        classId={classId}
      />
    </div>
  );
}
