import {
  LandingHeader,
  HeroSection,
  RoleSection,
  FeaturesSection,
  NewsSection,
  CTASection,
  Footer
} from '@/components/ui/landing';

export default function LandingPage() {
  return (
    <div className='min-h-screen'>
      <LandingHeader />
      <main className='pt-0'>
        <HeroSection />
        <RoleSection />
        <FeaturesSection />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
