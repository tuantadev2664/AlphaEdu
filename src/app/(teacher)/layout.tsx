import KBar from '@/components/kbar';
import TeacherSidebar from '@/components/layout/teacher-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TeacherOnlyGuard } from '@/features/auth/components/route-guard';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cổng Giáo Viên - Hệ Thống Quản Lý Trường Học',
  description:
    'Bảng điều khiển giáo viên toàn diện để quản lý lớp học và học sinh'
};

export default async function TeacherLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <TeacherOnlyGuard>
      <div className='overflow-hidden overscroll-none'>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            <TeacherSidebar />
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </div>
    </TeacherOnlyGuard>
  );
}
