import { fakeTeacher } from '@/constants/mock-api';
import { AnnouncementsView } from '@/features/teacher/components/announcements-view';
import PageContainer from '@/components/layout/page-container';

interface AnnouncementsPageProps {
  params: Promise<{ classId: string }>;
}

export default async function AnnouncementsPage({
  params
}: AnnouncementsPageProps) {
  const { classId } = await params;
  const announcementsData = await fakeTeacher.getTeacherAnnouncements(
    'teacher-1',
    {
      class_id: classId
    }
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Class Announcements</h2>
      </div>

      <AnnouncementsView
        announcements={announcementsData.announcements}
        classId={classId}
      />
    </div>
  );
}
