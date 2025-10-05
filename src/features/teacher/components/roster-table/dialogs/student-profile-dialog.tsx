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
import { ClassStudent } from '@/features/class/types';
import { useStudentDetail } from '@/features/teacher/hooks/use-teacher.query';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  TrendingUp,
  FileText,
  Award,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface StudentProfileDialogProps {
  student: ClassStudent;
  children: React.ReactNode;
}

export function StudentProfileDialog({
  student,
  children
}: StudentProfileDialogProps) {
  const [open, setOpen] = useState(false);

  // Fetch detailed student data from API
  const {
    data: studentDetail,
    isLoading,
    error
  } = useStudentDetail(student.id, {
    enabled: open // Only fetch when dialog is open
  });

  const initials = student.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 7) return 'text-blue-600 bg-blue-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Average';
    return 'Needs Improvement';
  };

  // Calculate average score from API data
  const calculateAverageScore = () => {
    if (!studentDetail?.scores || studentDetail.scores.length === 0)
      return null;

    const totalWeightedScore = studentDetail.scores.reduce(
      (sum, score) => sum + score.score * score.weight,
      0
    );
    const totalWeight = studentDetail.scores.reduce(
      (sum, score) => sum + score.weight,
      0
    );

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const averageScore = calculateAverageScore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='text-sm'>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className='text-lg font-semibold'>{student.fullName}</div>
              <DialogDescription>Student Profile</DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>
                Loading student details...
              </div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-destructive'>
                Failed to load student details
              </div>
            </div>
          ) : (
            <>
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <User className='h-5 w-5' />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Email</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Phone className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Phone</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.parents?.[0]?.phone || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <User className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>School</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.schoolName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <GraduationCap className='h-5 w-5' />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                        <span className='text-primary text-lg font-bold'>
                          {averageScore ? averageScore.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <div className='text-sm font-medium'>Average Score</div>
                        <div className='text-muted-foreground text-xs'>
                          {averageScore
                            ? getScoreStatus(averageScore)
                            : 'No data'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <TrendingUp className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Total Scores</div>
                        <Badge variant='outline' className='text-xs'>
                          {studentDetail?.scores?.length || 0} assessments
                        </Badge>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Award className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Class</div>
                        <Badge variant='secondary' className='text-xs'>
                          {studentDetail?.classes?.[0]?.className || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Behavior & Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <FileText className='h-5 w-5' />
                    Behavior & Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex items-center gap-3'>
                      <FileText className='text-muted-foreground h-4 w-4' />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Behavior Notes
                          </span>
                          <Badge
                            variant={
                              studentDetail?.behaviorNotes &&
                              studentDetail.behaviorNotes.length > 0
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {studentDetail?.behaviorNotes?.length || 0}
                          </Badge>
                        </div>
                        <div className='text-muted-foreground text-xs'>
                          {studentDetail?.behaviorNotes &&
                          studentDetail.behaviorNotes.length > 0
                            ? 'Some behavioral concerns noted'
                            : 'Good behavior record'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Clock className='text-muted-foreground h-4 w-4' />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Parent Contact
                          </span>
                          <Badge variant='default'>
                            {studentDetail?.parents?.[0]?.fullName || 'N/A'}
                          </Badge>
                        </div>
                        <div className='text-muted-foreground text-xs'>
                          {studentDetail?.parents?.[0]?.phone ||
                            'No contact info'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enrollment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <Clock className='h-5 w-5' />
                    Enrollment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Academic Year</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.classes?.[0]?.academicYearName ||
                            'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <GraduationCap className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Grade Level</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.classes?.[0]?.gradeName || 'N/A'}
                        </div>
                      </div>
                    </div>
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
