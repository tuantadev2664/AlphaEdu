import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // Redirect to overview page
  redirect('/dashboard/overview');
}
