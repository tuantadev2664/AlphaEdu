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
  ranking: number;
  averageScore: number;
}

export function StudentProfileDialog({
  student,
  children,
  ranking,
  averageScore
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
    if (score >= 8) return 'Xuất Sắc';
    if (score >= 7) return 'Tốt';
    if (score >= 6) return 'Trung Bình';
    return 'Cần Cải Thiện';
  };

  const getLetterGrade = (score: number) => {
    if (score >= 8) return 'A';
    if (score >= 7) return 'B';
    if (score >= 6) return 'C';
    if (score >= 5) return 'D';
    return 'F';
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
              <DialogDescription>Hồ Sơ Học Sinh</DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>
                Đang Tải Thông Tin Học Sinh...
              </div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-destructive'>
                Không thể tải thông tin học sinh
              </div>
            </div>
          ) : (
            <>
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <User className='h-5 w-5' />
                    Thông Tin Liên Hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Email Liên Hệ</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Phone className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Số Điện Thoại</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.parents?.[0]?.phone || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <User className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Trường Học</div>
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
                    Điểm Số
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
                        <div className='text-sm font-medium'>
                          Điểm Trung Bình
                        </div>
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
                        <div className='text-sm font-medium'>Xếp Hạng</div>
                        <Badge variant='outline' className='text-xs'>
                          #{ranking}
                        </Badge>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Award className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Lớp Học</div>
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
                    Hành Vi & Điểm Danh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex items-center gap-3'>
                      <FileText className='text-muted-foreground h-4 w-4' />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Ghi Chú Hành Vi
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
                            ? 'Có một số vấn đề về hành vi được ghi chú'
                            : 'Hành vi tốt'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Clock className='text-muted-foreground h-4 w-4' />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Liên Hệ Phụ Huynh
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
                    Thông Tin Đăng Ký
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Năm Học</div>
                        <div className='text-muted-foreground text-sm'>
                          {studentDetail?.classes?.[0]?.academicYearName ||
                            'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <GraduationCap className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='text-sm font-medium'>Khối Lớp</div>
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
