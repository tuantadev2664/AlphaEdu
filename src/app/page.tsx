// import { redirect } from 'next/navigation';
import LandingPage from './(ui)/landing/page';

export default async function Page() {
  // Always redirect to sign-in for now
  // Later can add logic to redirect authenticated users to their dashboard
  // return redirect('/landing');
  return <LandingPage />;
}
