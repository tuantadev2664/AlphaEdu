import KBar from '@/components/kbar';
// import ParentSidebar from '@/components/layout/parent-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ParentOnlyGuard } from '@/features/auth/components/route-guard';

export const metadata: Metadata = {
  title: 'Parent Portal - School Management System',
  description:
    'Parent dashboard for monitoring children academic progress and school communication'
};

export default async function ParentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ParentOnlyGuard>
      <div className='overflow-hidden overscroll-none'>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            {/* <ParentSidebar /> */}
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </div>
    </ParentOnlyGuard>
  );
}
