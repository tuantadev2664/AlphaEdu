import PageContainer from '@/components/layout/page-container';
import { ParentDashboardView } from '@/features/parent/components/parent-dashboard-view';

export default async function ParentDashboardPage() {
  return (
    <PageContainer scrollable>
      <ParentDashboardView />
    </PageContainer>
  );
}
