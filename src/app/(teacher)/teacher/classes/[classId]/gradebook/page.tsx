import { fakeTeacher } from '@/constants/mock-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calculator } from 'lucide-react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';

interface GradebookPageProps {
  params: Promise<{ classId: string }>;
}

export default async function GradebookPage({ params }: GradebookPageProps) {
  const { classId } = await params;

  // Get class and subjects data
  const classData = fakeTeacher.classes.find((c) => c.id === classId);
  // For now, show all active subjects (in real app, would filter by class/grade)
  const subjects = fakeTeacher.subjects.filter((s) => s.is_active);

  return (
    <PageContainer scrollable>
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
            const gradebookData = fakeTeacher.generateGradebookData(
              classId,
              subject.id
            );
            const classAverage =
              gradebookData.length > 0
                ? Math.round(
                    gradebookData.reduce(
                      (sum, entry) => sum + (entry.average_score || 0),
                      0
                    ) / gradebookData.length
                  )
                : 0;

            return (
              <Link
                key={subject.id}
                href={`/teacher/classes/${classId}/gradebook/${subject.id}`}
              >
                <Card className='hover:bg-muted/50 cursor-pointer transition-colors'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                        <BookOpen className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base'>
                          {subject.name}
                        </CardTitle>
                        <Badge variant='outline' className='text-xs'>
                          {subject.code}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center justify-between'>
                      <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                        <Users className='h-3 w-3' />
                        {gradebookData.length} students
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
      </div>
    </PageContainer>
  );
}
