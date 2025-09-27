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
import { RosterStudent } from '@/features/teacher/types';
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

interface ViewGradesDialogProps {
  student: RosterStudent;
  children: React.ReactNode;
}

// Mock grade data - in real app this would come from API
const mockGrades = [
  {
    id: '1',
    subject: 'Mathematics',
    assessment: 'Quiz 1',
    score: 85,
    maxScore: 100,
    date: '2024-01-15',
    type: 'quiz',
    weight: 10
  },
  {
    id: '2',
    subject: 'Mathematics',
    assessment: 'Midterm Exam',
    score: 92,
    maxScore: 100,
    date: '2024-01-20',
    type: 'exam',
    weight: 30
  },
  {
    id: '3',
    subject: 'English',
    assessment: 'Essay Assignment',
    score: 88,
    maxScore: 100,
    date: '2024-01-18',
    type: 'assignment',
    weight: 20
  },
  {
    id: '4',
    subject: 'Science',
    assessment: 'Lab Report',
    score: 95,
    maxScore: 100,
    date: '2024-01-22',
    type: 'assignment',
    weight: 15
  },
  {
    id: '5',
    subject: 'History',
    assessment: 'Project Presentation',
    score: 78,
    maxScore: 100,
    date: '2024-01-25',
    type: 'project',
    weight: 25
  }
];

const subjectAverages = [
  { subject: 'Mathematics', average: 88.5, trend: 'up', color: 'bg-blue-500' },
  { subject: 'English', average: 86.2, trend: 'up', color: 'bg-green-500' },
  {
    subject: 'Science',
    average: 92.3,
    trend: 'stable',
    color: 'bg-purple-500'
  },
  { subject: 'History', average: 81.7, trend: 'down', color: 'bg-orange-500' }
];

export function ViewGradesDialog({ student, children }: ViewGradesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const initials = student.full_name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <BookOpen className='h-3 w-3' />;
      case 'exam':
        return <GraduationCap className='h-3 w-3' />;
      case 'assignment':
        return <Award className='h-3 w-3' />;
      case 'project':
        return <Target className='h-3 w-3' />;
      default:
        return <BookOpen className='h-3 w-3' />;
    }
  };

  const filteredGrades =
    selectedSubject === 'all'
      ? mockGrades
      : mockGrades.filter((grade) => grade.subject === selectedSubject);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            {student.full_name} - Grades
          </DialogTitle>
          <DialogDescription>Academic Performance Overview</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
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
                    {student.average_score || 87}%
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Overall Average
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600'>A-</div>
                  <div className='text-muted-foreground text-sm'>
                    Letter Grade
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-purple-600'>3.7</div>
                  <div className='text-muted-foreground text-sm'>GPA</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-orange-600'>12th</div>
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
                        <span className='font-medium'>{subject.subject}</span>
                        <div className='flex items-center gap-2'>
                          {subject.trend === 'up' && (
                            <TrendingUp className='h-4 w-4 text-green-500' />
                          )}
                          {subject.trend === 'down' && (
                            <TrendingDown className='h-4 w-4 text-red-500' />
                          )}
                          <span className='font-bold'>{subject.average}%</span>
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
            {Array.from(new Set(mockGrades.map((g) => g.subject))).map(
              (subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
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
                        <div className='font-medium'>{grade.assessment}</div>
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
                      <div
                        className={`rounded-full border px-3 py-1 text-sm font-medium ${getGradeColor(grade.score)}`}
                      >
                        {grade.score}/{grade.maxScore}
                      </div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
