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
import { RosterStudent } from '@/features/teacher/types';
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
  student: RosterStudent;
  children: React.ReactNode;
}

export function StudentProfileDialog({
  student,
  children
}: StudentProfileDialogProps) {
  const [open, setOpen] = useState(false);

  const initials = student.full_name
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
            <Avatar className='h-12 w-12'>
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='text-xl font-bold'>{student.full_name}</div>
              <div className='text-muted-foreground text-sm font-normal'>
                Student Profile
              </div>
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
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                  <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900'>
                    <Mail className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-sm font-medium'>Email</div>
                    <div className='text-muted-foreground text-sm'>
                      {student.email}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                  <div className='rounded-full bg-green-100 p-2 dark:bg-green-900'>
                    <Phone className='h-4 w-4 text-green-600' />
                  </div>
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
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='text-center'>
                  <div
                    className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${getScoreColor(student.average_score || 0)}`}
                  >
                    {student.average_score || 'N/A'}
                    {student.average_score && '%'}
                  </div>
                  <div className='mt-2 text-sm font-medium'>Average Score</div>
                  <div className='text-muted-foreground text-xs'>
                    {student.average_score
                      ? getScoreStatus(student.average_score)
                      : 'No data'}
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4 text-blue-500' />
                    <span className='text-sm'>Performance Trend</span>
                    <Badge variant='outline' className='text-xs'>
                      Improving
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Award className='h-4 w-4 text-yellow-500' />
                    <span className='text-sm'>Class Rank</span>
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
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='rounded-lg border p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-sm font-medium'>Behavior Notes</span>
                    <Badge
                      variant={
                        student.behavior_notes_count &&
                        student.behavior_notes_count > 0
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {student.behavior_notes_count || 0}
                    </Badge>
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    {student.behavior_notes_count &&
                    student.behavior_notes_count > 0
                      ? 'Some behavioral concerns noted'
                      : 'Good behavior record'}
                  </div>
                </div>
                <div className='rounded-lg border p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-sm font-medium'>Attendance</span>
                    <Badge variant='default'>95%</Badge>
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Excellent attendance record
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
              <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                <div className='rounded-full bg-purple-100 p-2 dark:bg-purple-900'>
                  <Calendar className='h-4 w-4 text-purple-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Enrolled Since</div>
                  <div className='text-muted-foreground text-sm'>
                    {format(new Date(student.created_at), 'MMMM dd, yyyy')}
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
