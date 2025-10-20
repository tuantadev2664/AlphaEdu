import { CTASection, Footer, LandingHeader } from '@/components/ui/landing';

export default function CTAPage() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      <main className='pt-0'>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
