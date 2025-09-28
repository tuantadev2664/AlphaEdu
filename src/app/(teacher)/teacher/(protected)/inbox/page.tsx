import { fakeTeacher } from '@/constants/mock-api';
import { InboxView } from '@/features/teacher/components/inbox-view';
import PageContainer from '@/components/layout/page-container';

export default async function InboxPage() {
  const messagesData = await fakeTeacher.getTeacherMessages('teacher-1');

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Inbox</h1>
        </div>

        <InboxView messages={messagesData.messages} />
      </div>
    </PageContainer>
  );
}
