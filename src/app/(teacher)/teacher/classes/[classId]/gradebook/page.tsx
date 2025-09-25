import { fakeTeacher } from '@/constants/mock-api';
import { GradebookView } from '@/features/teacher/components/gradebook-view';
import PageContainer from '@/components/layout/page-container';

interface GradebookPageProps {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ subject?: string }>;
}

export default async function GradebookPage({
  params,
  searchParams
}: GradebookPageProps) {
  const subjects = fakeTeacher.subjects;
  const selectedSubject = (await searchParams).subject || subjects[0]?.id;

  // Generate gradebook data for the selected subject
  const gradebookData = fakeTeacher.generateGradebookData(
    (await params).classId,
    selectedSubject
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Gradebook</h2>
      </div>

      <GradebookView
        data={gradebookData}
        subjects={subjects}
        selectedSubject={selectedSubject}
        classId={(await params).classId}
      />
    </div>
  );
}
