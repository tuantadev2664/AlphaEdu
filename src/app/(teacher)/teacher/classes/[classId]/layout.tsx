import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { fakeTeacher } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import {
  Users,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Home,
  Settings,
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClassLayoutProps {
  children: React.ReactNode;
  params: { classId: string };
}

export default async function ClassLayout({
  children,
  params
}: ClassLayoutProps) {
  const classData = fakeTeacher.classes.find((c) => c.id === params.classId);

  if (!classData) {
    notFound();
  }

  // Get class stats
  const totalStudents = classData.student_count || 0;
  const gradeLevel = classData.grade?.grade_number || 0;
  const isMyClass = classData.homeroom_teacher_id === 'teacher-1';

  // Tab configurations with colors and icons
  const tabConfigs = [
    {
      value: 'roster',
      label: 'Roster',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Student list & info'
    },
    {
      value: 'gradebook',
      label: 'Gradebook',
      icon: Award,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Grades & assessments'
    },
    {
      value: 'behavior',
      label: 'Behavior',
      icon: Star,
      gradient: 'from-purple-500 to-violet-600',
      description: 'Behavior tracking'
    },
    {
      value: 'announcements',
      label: 'Announcements',
      icon: Calendar,
      gradient: 'from-orange-500 to-red-500',
      description: 'Class announcements'
    }
  ];

  return (
    <ScrollArea className='h-[calc(100dvh)]'>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900'>
        {/* Enhanced Hero Header */}
        <div className='relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10'></div>
          <div className='absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5'></div>

          <div className='relative mx-auto max-w-7xl px-6 py-12'>
            {/* Navigation Buttons */}
            <div className='mb-6 flex items-center gap-4'>
              <Button
                asChild
                variant='ghost'
                className='text-white transition-colors hover:bg-white/20'
              >
                <Link
                  href='/teacher/classes'
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to Classes
                </Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='text-white transition-colors hover:bg-white/20'
              >
                <Link href='/teacher' className='flex items-center gap-2'>
                  <Home className='h-4 w-4' />
                  Dashboard
                </Link>
              </Button>
            </div>

            {/* Class Information */}
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20'>
                  <GraduationCap className='h-8 w-8' />
                </div>
                <div>
                  <div className='mb-2 flex items-center gap-3'>
                    <h1 className='text-4xl font-bold tracking-tight'>
                      {classData.name}
                    </h1>
                    {isMyClass && (
                      <Badge className='border-white/30 bg-white/20 text-white'>
                        My Class
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-4 text-indigo-100'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4' />
                      <span>Grade {gradeLevel}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      <span>{totalStudents} students</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <BookOpen className='h-4 w-4' />
                      <span>{classData.grade?.level?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='hidden items-center gap-3 md:flex'>
                <Button
                  variant='outline'
                  className='border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  Class Settings
                </Button>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {tabConfigs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.value}
                    href={`/teacher/classes/${params.classId}/${tab.value}`}
                    className='group'
                  >
                    <div className='relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20'>
                      <div className='absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
                      <div className='relative'>
                        <div className='mb-2 flex items-center gap-3'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/20'>
                            <Icon className='h-4 w-4' />
                          </div>
                          <span className='font-semibold'>{tab.label}</span>
                        </div>
                        <p className='text-xs text-indigo-100'>
                          {tab.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <div className='min-h-[60vh]'>{children}</div>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className='fixed right-6 bottom-6 z-50 md:hidden'>
          <Button
            asChild
            size='lg'
            className='h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
          >
            <Link href='/teacher'>
              <Home className='h-6 w-6' />
            </Link>
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
