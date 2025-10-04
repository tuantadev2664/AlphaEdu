import PageContainer from '@/components/layout/page-container';
import { StudentDashboardView } from '@/features/student/components/student-dashboard-view';

export default function StudentDashboardPage() {
  return (
    <PageContainer scrollable>
      <StudentDashboardView />
    </PageContainer>
  );
}
