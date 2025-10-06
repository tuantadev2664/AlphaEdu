import PageContainer from '@/components/layout/page-container';
import AnnouncementPage from '@/features/teacher/components/announcement-page';

interface AnnouncementsPageProps {
  params: Promise<{ classId: string }>;
}

export default async function AnnouncementsPage({
  params
}: AnnouncementsPageProps) {
  const { classId } = await params;
  return (
    <PageContainer scrollable>
      <AnnouncementPage classId={classId} />
    </PageContainer>
  );
}
