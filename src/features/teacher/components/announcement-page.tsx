import { AnnouncementsView } from './announcements-view';

interface AnnouncementPageProps {
  classId: string;
}

export default function AnnouncementPage({ classId }: AnnouncementPageProps) {
  return (
    <div className='flex flex-1 flex-col space-y-6'>
      <h2 className='text-lg font-semibold'>Class Announcements</h2>
      <AnnouncementsView classId={classId} />
    </div>
  );
}
