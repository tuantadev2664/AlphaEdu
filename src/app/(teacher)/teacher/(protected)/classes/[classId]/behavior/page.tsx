import { BehaviorTableWrapper } from '@/features/teacher/components/behavior-table/behavior-table-wrapper';

interface BehaviorPageProps {
  params: Promise<{ classId: string }>;
}

export default async function BehaviorPage({ params }: BehaviorPageProps) {
  const { classId } = await params;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Behavior Management</h2>
      </div>

      <BehaviorTableWrapper classId={classId} />
    </div>
  );
}
