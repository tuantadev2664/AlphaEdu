import RosterListing from '@/features/teacher/components/roster-listing';

interface RosterPageProps {
  params: Promise<{ classId: string }>;
}

export default async function RosterPage({ params }: RosterPageProps) {
  const { classId } = await params;

  return <RosterListing classId={classId} />;
}
