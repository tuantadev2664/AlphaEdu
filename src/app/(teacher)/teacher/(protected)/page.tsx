import { fakeTeacher } from '@/constants/mock-api';
import { TeacherDashboard } from '@/features/teacher/components/teacher-dashboard';
import PageContainer from '@/components/layout/page-container';

export default async function TeacherHomePage() {
  const stats = await fakeTeacher.getTeacherDashboardStats();

  return (
    <PageContainer scrollable>
      <TeacherDashboard stats={stats} />
    </PageContainer>
  );
}
