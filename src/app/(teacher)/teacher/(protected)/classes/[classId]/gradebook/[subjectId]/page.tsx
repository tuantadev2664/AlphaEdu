import PageContainer from '@/components/layout/page-container';
import GradebookSubject from '@/features/teacher/components/gradebook-subject';

interface GradebookSubjectPageProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export default async function Page({ params }: GradebookSubjectPageProps) {
  const { classId, subjectId } = await params;

  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-6'>
        <GradebookSubject classId={classId} subjectId={subjectId} />
      </div>
    </PageContainer>
  );
}
