import { Badge } from '@/components/ui/badge';
import { fakeTeacher } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teacher Dashboard - Class Management',
  description: 'Manage your class with ease'
};

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ classId: string }>;
}

export default async function ClassLayout({
  children,
  params
}: ClassLayoutProps) {
  const classData = fakeTeacher.classes.find(
    async (c) => c.id === (await params).classId
  );

  if (!classData) {
    notFound();
  }

  // Get class stats
  const totalStudents = classData.student_count || 0;
  const gradeLevel = classData.grade?.grade_number || 0;
  const isMyClass = classData.homeroom_teacher_id === 'teacher-1';

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
                {classData.name}
              </h1>
              {isMyClass && <Badge variant='secondary'>My Class</Badge>}
            </div>
            <div className='text-muted-foreground flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <TrendingUp className='h-4 w-4' />
                <span>Grade {gradeLevel}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-4 w-4' />
                <span>{totalStudents} students</span>
              </div>
              <div className='flex items-center gap-1'>
                <BookOpen className='h-4 w-4' />
                <span>{classData.grade?.level?.replace('_', ' ')}</span>
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
