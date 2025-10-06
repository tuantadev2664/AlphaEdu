'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ClassStudent } from '@/features/class/types';
import { useStudentSubjectsQuery } from '@/features/student/hooks/use-student.query';
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { useStudentRank } from '@/features/score/hooks/use-score.query';

interface ViewGradesDialogProps {
  student: ClassStudent;
  children: React.ReactNode;
  ranking: number;
  averageScore: number;
}

// Helper function to calculate subject averages from API data
const calculateSubjectAverages = (subjectsData: any[]) => {
  return subjectsData.map((subject) => {
    // Get all scores from all components
    const allScores =
      subject.components?.flatMap(
        (component: any) =>
          component.assessments?.filter(
            (assessment: any) =>
              !assessment.isAbsent && assessment.score !== null
          ) || []
      ) || [];

    let average = 0;
    if (allScores.length > 0) {
      const totalScore = allScores.reduce(
        (sum: number, assessment: any) => sum + assessment.score,
        0
      );
      average = totalScore / allScores.length;
    }

    return {
      subject: subject.subjectName,
      average: Math.round(average * 10) / 10,
      trend: 'stable' as 'up' | 'down' | 'stable', // Could be calculated based on historical data
      color: getSubjectColor(subject.subjectName)
    };
  });
};

// Helper function to get subject color
const getSubjectColor = (subjectName: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500'
  ];
  const index = subjectName.length % colors.length;
  return colors[index];
};

export function ViewGradesDialog({
  student,
  children,
  ranking,
  averageScore
}: ViewGradesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Fetch student subjects data from API
  const {
    data: subjectsData,
    isLoading,
    error
  } = useStudentSubjectsQuery(student.id);

  const initials = student.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getGradeColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTypeIcon = (kind: string) => {
    switch (kind) {
      case 'quiz':
        return <BookOpen className='h-3 w-3' />;
      case 'test':
      case 'midterm':
      case 'final':
        return <GraduationCap className='h-3 w-3' />;
      case 'project':
        return <Target className='h-3 w-3' />;
      case 'oral':
        return <Award className='h-3 w-3' />;
      default:
        return <BookOpen className='h-3 w-3' />;
    }
  };

  const getLetterGrade = (score: number) => {
    if (score >= 9) return 'A';
    if (score >= 8) return 'B';
    if (score >= 7) return 'C';
    if (score >= 6) return 'D';
    return 'F';
  };

  const letterGrade = getLetterGrade(averageScore);

  // Transform API data to grades format
  const allGrades =
    subjectsData?.flatMap(
      (subject) =>
        subject.components?.flatMap(
          (component) =>
            component.assessments?.map((assessment) => ({
              id: assessment.assessmentId,
              subject: subject.subjectName,
              assessment: assessment.title,
              score: assessment.score,
              maxScore: component.maxScore,
              date: assessment.dueDate,
              type: component.kind,
              weight: component.weight,
              isAbsent: assessment.isAbsent
            })) || []
        ) || []
    ) || [];

  const subjectAverages = subjectsData
    ? calculateSubjectAverages(subjectsData)
    : [];

  const filteredGrades =
    selectedSubject === 'all'
      ? allGrades
      : allGrades.filter((grade) => grade.subject === selectedSubject);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            {student.fullName} - Grades
          </DialogTitle>
          <DialogDescription>Academic Performance Overview</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>
                Loading student grades...
              </div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-destructive'>
                Failed to load student grades
              </div>
            </div>
          ) : (
            <>
              {/* Overall Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                    <div className='text-center'>
                      <div className='text-3xl font-bold text-blue-600'>
                        {averageScore}%
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        Overall Average
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold text-green-600'>
                        {letterGrade}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        Letter Grade
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold text-purple-600'>
                        {letterGrade}
                      </div>
                      <div className='text-muted-foreground text-sm'>GPA</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold text-orange-600'>
                        {ranking}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        Class Rank
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Averages */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5' />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {subjectAverages.map((subject) => (
                      <div
                        key={subject.subject}
                        className='flex items-center gap-4'
                      >
                        <div
                          className={`h-3 w-3 rounded-full ${subject.color}`}
                        ></div>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center justify-between'>
                            <span className='font-medium'>
                              {subject.subject}
                            </span>
                            <div className='flex items-center gap-2'>
                              {subject.trend === 'up' && (
                                <TrendingUp className='h-4 w-4 text-green-500' />
                              )}
                              {subject.trend === 'down' && (
                                <TrendingDown className='h-4 w-4 text-red-500' />
                              )}
                              <span className='font-bold'>
                                {subject.average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <Progress value={subject.average} className='h-2' />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Filter */}
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant={selectedSubject === 'all' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setSelectedSubject('all')}
                >
                  All Subjects
                </Button>
                {Array.from(new Set(allGrades.map((g) => g.subject))).map(
                  (subject) => (
                    <Button
                      key={subject}
                      variant={
                        selectedSubject === subject ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  )
                )}
              </div>

              {/* Recent Grades */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5' />
                    Recent Assessments
                    {selectedSubject !== 'all' && (
                      <Badge variant='outline'>{selectedSubject}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {filteredGrades.map((grade) => (
                      <div
                        key={grade.id}
                        className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='rounded-full bg-gray-100 p-2 dark:bg-gray-800'>
                            {getTypeIcon(grade.type)}
                          </div>
                          <div>
                            <div className='font-medium'>
                              {grade.assessment}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              {grade.subject} •{' '}
                              {format(new Date(grade.date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Badge variant='outline' className='text-xs'>
                            {grade.weight}% weight
                          </Badge>
                          {grade.isAbsent ? (
                            <Badge variant='destructive' className='text-xs'>
                              Absent
                            </Badge>
                          ) : (
                            <div
                              className={`rounded-full border px-3 py-1 text-sm font-medium ${getGradeColor(grade.score)}`}
                            >
                              {grade.score}/{grade.maxScore}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredGrades.length === 0 && (
                      <div className='text-muted-foreground py-8 text-center'>
                        No assessments found for {selectedSubject}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
