import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { fakeParent } from '@/constants/mock-api';
import { ParentDashboardView } from '@/features/parent/components/parent-dashboard-view';

export const metadata = {
  title: 'Parent Dashboard'
};

export default async function ParentDashboardPage() {
  const dashboardData = await fakeParent.getParentDashboard('parent-1');

  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Chào mừng, ${dashboardData.parent.full_name}!`}
            description='Theo dõi tình hình học tập của các con và liên lạc với giáo viên.'
          />
        </div>
        <Separator />

        <ParentDashboardView data={dashboardData} />
      </div>
    </PageContainer>
  );
}
