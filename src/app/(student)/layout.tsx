import KBar from '@/components/kbar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/components/layout/auth-provider';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Student Portal - School Management System',
  description:
    'Student dashboard for academic progress tracking and school updates'
};

export default async function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <AuthProvider>
      <div className='overflow-hidden overscroll-none'>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            {/* <StudentSidebar /> */}
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </div>
    </AuthProvider>
  );
}
