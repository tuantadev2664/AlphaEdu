// Class Overview Page - Shows welcome message centered
import { fakeTeacher } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import { GraduationCap, Users, Award, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ClassOverviewPage({
  params
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const classData = fakeTeacher.classes.find((c) => c.id === classId);

  if (!classData) return notFound();

  // Tab configurations for quick navigation
  const tabConfigs = [
    {
      value: 'roster',
      label: 'Roster',
      icon: Users,
      description: 'Student list & info',
      url: `/teacher/classes/${classId}/roster`
    },
    {
      value: 'gradebook',
      label: 'Gradebook',
      icon: Award,
      description: 'Grades & assessments',
      url: `/teacher/classes/${classId}/gradebook`
    },
    {
      value: 'behavior',
      label: 'Behavior',
      icon: Star,
      description: 'Behavior tracking',
      url: `/teacher/classes/${classId}/behavior`
    },
    {
      value: 'announcements',
      label: 'Announcements',
      icon: Calendar,
      description: 'Class announcements',
      url: `/teacher/classes/${classId}/announcements`
    }
  ];

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='space-y-4 py-8 text-center'>
        <div className='bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
          <GraduationCap className='text-primary h-8 w-8' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-xl font-semibold'>Welcome to {classData.name}</h3>
          <p className='text-muted-foreground mx-auto max-w-md'>
            Choose a section below to manage your class effectively.
          </p>
        </div>
        <div className='text-muted-foreground text-sm'>
          <p>
            Grade {classData.grade?.grade_number} • {classData.student_count}{' '}
            students
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {tabConfigs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.value}
              href={tab.url}
              className='group bg-card hover:bg-accent flex flex-col items-center gap-3 rounded-lg border p-6 transition-colors'
            >
              <div className='bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-md transition-colors'>
                <Icon className='text-primary h-6 w-6' />
              </div>
              <div className='space-y-1 text-center'>
                <div className='font-medium'>{tab.label}</div>
                <div className='text-muted-foreground text-sm'>
                  {tab.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
