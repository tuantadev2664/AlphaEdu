'use client';

import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { useClassDetails } from '@/features/class/hooks/use-class.query';
import { use } from 'react';

// Note: metadata removed due to client component

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ classId: string }>;
}

export default function ClassLayout({ children, params }: ClassLayoutProps) {
  const { classId } = use(params);

  // Fetch class details using the hook
  const {
    data: classDetails,
    isLoading,
    error
  } = useClassDetails({
    classId,
    academicYearId: '22222222-2222-2222-2222-222222222222'
  });

  if (isLoading) {
    return (
      <div className='bg-muted/40 border-b p-6'>
        <div className='flex items-center gap-6'>
          <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl'>
            <GraduationCap className='text-primary h-6 w-6' />
          </div>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-3'>
              <div className='bg-muted h-8 w-32 animate-pulse rounded' />
            </div>
            <div className='flex items-center gap-4'>
              <div className='bg-muted h-4 w-16 animate-pulse rounded' />
              <div className='bg-muted h-4 w-20 animate-pulse rounded' />
              <div className='bg-muted h-4 w-24 animate-pulse rounded' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classDetails) {
    notFound();
  }

  // Map API data to match original UI expectations
  const totalStudents = classDetails.studentCount || 0;
  const gradeLevel = classDetails.gradeName || 'unknown';
  const isMyClass = true; // All classes returned by API are teacher's classes

  return (
    <>
      {/* Class Information Header */}
      <div className='bg-muted/40 border-b p-6'>
        <div className='flex items-center gap-6'>
          <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl'>
            <GraduationCap className='text-primary h-6 w-6' />
          </div>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-3'>
              <h1 className='text-2xl font-bold tracking-tight'>
                {classDetails.className}
              </h1>
              {isMyClass && <Badge variant='secondary'>Lớp Của Tôi</Badge>}
            </div>
            <div className='text-muted-foreground flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <TrendingUp className='h-4 w-4' />
                <span>Khối {gradeLevel}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-4 w-4' />
                <span>{totalStudents} học sinh</span>
              </div>
              <div className='flex items-center gap-1'>
                <BookOpen className='h-4 w-4' />
                <span>{gradeLevel.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='p-6'>{children}</div>
    </>
  );
}
