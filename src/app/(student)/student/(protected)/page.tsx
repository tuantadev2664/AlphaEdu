import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { fakeStudent } from '@/constants/mock-api';
import { StudentDashboardView } from '@/features/student/components/student-dashboard-view';

export const metadata = {
  title: 'Student Dashboard'
};

export default async function StudentDashboardPage() {
  const dashboardData = await fakeStudent.getStudentDashboard('student-1');

  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Welcome back, ${dashboardData.student.full_name}!`}
            description='Here is your academic overview and recent updates.'
          />
        </div>
        <Separator />

        <StudentDashboardView data={dashboardData} />
      </div>
    </PageContainer>
  );
}
