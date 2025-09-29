import PageContainer from '@/components/layout/page-container';
import GradebookListingSubject from '@/features/teacher/components/gradebook-listing-subject';

interface GradebookPageProps {
  params: Promise<{ classId: string }>;
}

export default async function GradebookPage({ params }: GradebookPageProps) {
  const { classId } = await params;

  return (
    <PageContainer scrollable>
      <GradebookListingSubject classId={classId} />
    </PageContainer>
  );
}
