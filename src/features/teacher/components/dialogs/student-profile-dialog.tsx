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

  const initials = student.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
  };

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
                      {student.email}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                  <div>
                    <div className='text-sm font-medium'>Phone</div>
                    <div className='text-muted-foreground text-sm'>
                      {student.phone}
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
                      {student.scoreStudents.reduce(
                        (sum, score) => sum + score.score,
                        0
                      ) / student.scoreStudents.length || 'N/A'}
                      {student.scoreStudents.reduce(
                        (sum, score) => sum + score.score,
                        0
                      ) / student.scoreStudents.length && '%'}
                    </span>
                  </div>
                  <div>
                    <div className='text-sm font-medium'>Average Score</div>
                    <div className='text-muted-foreground text-xs'>
                      {student.scoreStudents.reduce(
                        (sum, score) => sum + score.score,
                        0
                      ) / student.scoreStudents.length
                        ? getScoreStatus(
                            student.scoreStudents.reduce(
                              (sum, score) => sum + score.score,
                              0
                            ) / student.scoreStudents.length
                          )
                        : 'No data'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <TrendingUp className='text-muted-foreground h-4 w-4' />
                  <div>
                    <div className='text-sm font-medium'>Trend</div>
                    <Badge variant='outline' className='text-xs'>
                      Improving
                    </Badge>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <Award className='text-muted-foreground h-4 w-4' />
                  <div>
                    <div className='text-sm font-medium'>Class Rank</div>
                    <Badge variant='secondary' className='text-xs'>
                      Top 25%
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
                          student.behaviorNoteStudents &&
                          student.behaviorNoteStudents.length > 0
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {student.behaviorNoteStudents.length || 0}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {student.behaviorNoteStudents &&
                      student.behaviorNoteStudents.length > 0
                        ? 'Some behavioral concerns noted'
                        : 'Good behavior record'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <Clock className='text-muted-foreground h-4 w-4' />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Attendance</span>
                      <Badge variant='default'>95%</Badge>
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      Excellent attendance record
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
              <div className='flex items-center gap-3'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <div className='text-sm font-medium'>Enrolled Since</div>
                  <div className='text-muted-foreground text-sm'>
                    {format(new Date(student.createdAt), 'MMMM dd, yyyy')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
