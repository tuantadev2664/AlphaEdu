import { fakeTeacher } from '@/constants/mock-api';
import { BehaviorView } from '@/features/teacher/components/behavior-view';
import PageContainer from '@/components/layout/page-container';

interface BehaviorPageProps {
  params: { classId: string };
}

export default async function BehaviorPage({ params }: BehaviorPageProps) {
  const notesData = await fakeTeacher.getBehaviorNotes(params.classId);
  const studentsData = await fakeTeacher.getClassStudents(params.classId);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Behavior Management</h2>
      </div>

      <BehaviorView
        notes={notesData.notes}
        students={studentsData.students}
        classId={params.classId}
      />
    </div>
  );
}
