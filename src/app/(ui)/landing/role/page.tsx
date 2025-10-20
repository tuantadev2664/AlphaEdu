import { Footer, LandingHeader, RoleSection } from '@/components/ui/landing';

export default function RolePage() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      <main className='pt-0'>
        <RoleSection />
      </main>
      <Footer />
    </div>
  );
}
