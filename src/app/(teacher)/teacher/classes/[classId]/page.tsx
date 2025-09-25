// Classes Detail Page with Tabs (Roster, Gradebook, Behavior, Announcements)
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import { fakeClasses } from '@/constants/mock-api-teacher';
import RosterTable from '@/features/teacher/components/roster-table';
// import GradebookTable from '@/features/teacher/components/gradebook-table';
// import BehaviorView from '@/features/teacher/components/behavior-list';
import AnnouncementList from '@/features/teacher/components/announcement-list';
import { BehaviorView } from '@/features/teacher/components';

export default async function ClassDetailPage({
  params
}: {
  params: Promise<{ classId: string }>;
}) {
  // Await params.classId for Next.js dynamic route compliance
  const { classId } = await params;
  const classData = fakeClasses.find((c) => c.id === classId);
  if (!classData) return notFound();

  return (
    <div className='mx-auto max-w-5xl py-8'>
      <h1 className='mb-4 text-2xl font-bold'>Class: {classData.name}</h1>
      <Tabs defaultValue='roster'>
        <TabsList>
          <TabsTrigger value='roster'>Roster</TabsTrigger>
          <TabsTrigger value='gradebook'>Gradebook</TabsTrigger>
          <TabsTrigger value='behavior'>Behavior</TabsTrigger>
          <TabsTrigger value='announcements'>Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value='roster'>
          <RosterTable classId={classData.id} />
        </TabsContent>
        <TabsContent value='gradebook'>
          {/* <GradebookTable classId={classData.id} /> */}
        </TabsContent>
        <TabsContent value='behavior'>
          {/* <BehaviorView classId={classData.id} /> */}
        </TabsContent>
        <TabsContent value='announcements'>
          <AnnouncementList classId={classData.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
