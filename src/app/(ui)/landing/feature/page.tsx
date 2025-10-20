import {
  FeaturesSection,
  Footer,
  LandingHeader
} from '@/components/ui/landing';

export default function FeaturePage() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      <main className='pt-0'>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
