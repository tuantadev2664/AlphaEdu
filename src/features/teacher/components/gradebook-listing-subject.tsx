'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useClassDetails } from '@/features/class/hooks/use-class.query';

interface GradebookListingSubjectProps {
  classId: string;
}

export default function GradebookListingSubject({
  classId
}: GradebookListingSubjectProps) {
  // Fetch class details including subjects
  const {
    data: classDetails,
    isLoading,
    error
  } = useClassDetails({
    classId,
    academicYearId: '22222222-2222-2222-2222-222222222222'
  });

  const subjects = classDetails?.subjects || [];

  if (isLoading) {
    return (
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Gradebook</h2>
        </div>

        <div className='text-muted-foreground text-sm'>
          Select a subject to view and manage grades
        </div>

        {/* Loading Subject Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-muted h-8 w-8 rounded-lg' />
                  <div>
                    <div className='bg-muted h-4 w-20 rounded' />
                    <div className='bg-muted mt-1 h-3 w-12 rounded' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='bg-muted h-4 w-16 rounded' />
                  <div className='bg-muted h-4 w-12 rounded' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Gradebook</h2>
        </div>
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>Failed to load class subjects</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Gradebook</h2>
      </div>

      <div className='text-muted-foreground text-sm'>
        Select a subject to view and manage grades
      </div>

      {/* Subject Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {subjects.map((subject) => {
          // For now, use placeholder data for gradebook stats
          // In the future, this would come from a separate gradebook API
          const studentCount = classDetails.studentCount || 0;
          const classAverage = Math.floor(Math.random() * 40) + 60; // Placeholder average 60-100

          return (
            <Link
              key={subject.subjectId}
              href={`/teacher/classes/${classId}/gradebook/${subject.subjectId}`}
            >
              <Card className='hover:bg-muted/50 cursor-pointer transition-colors'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                      <BookOpen className='text-primary h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base'>
                        {subject.subjectName}
                      </CardTitle>
                      <Badge variant='outline' className='text-xs'>
                        {subject.teacherName}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                      <Users className='h-3 w-3' />
                      {studentCount} students
                    </div>
                    <div className='flex items-center gap-1 text-sm'>
                      <Calculator className='h-3 w-3' />
                      <span
                        className={`font-medium ${
                          classAverage >= 90
                            ? 'text-green-600'
                            : classAverage >= 80
                              ? 'text-blue-600'
                              : classAverage >= 70
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}
                      >
                        {classAverage}% avg
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>
            No subjects found for this class
          </p>
        </div>
      )}
    </div>
  );
}
