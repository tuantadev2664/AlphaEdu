import { Footer, LandingHeader, NewsSection } from '@/components/ui/landing';

export default function NewsPage() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      <main className='pt-0'>
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
