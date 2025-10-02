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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChildDetailView } from '@/features/parent/types';
import {
  Award,
  BookOpen,
  Calendar,
  User,
  Clock,
  TrendingUp,
  Target,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Minus,
  AlertTriangle,
  Bell,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

interface ChildDetailDialogProps {
  childId: string;
  children: React.ReactNode;
}

// Mock data - would come from API
const mockChildDetail: ChildDetailView = {
  parent: {
    id: 'parent-1',
    role: 'parent',
    full_name: 'Nguyễn Văn An',
    email: 'an.nguyen@parent.com',
    phone: '+84-123-456-789',
    school_id: 'school-1',
    created_at: '2023-08-01T00:00:00Z'
  },
  child: {
    id: 'student-1',
    role: 'student',
    full_name: 'Nguyễn Minh Khang',
    email: 'khang.nguyen@student.edu',
    phone: '+84-987-654-321',
    school_id: 'school-1',
    created_at: '2023-08-01T00:00:00Z',
    class_id: 'class-1'
  },
  current_class: {
    id: 'class-1',
    grade_id: 'grade-1',
    name: '10A1',
    homeroom_teacher_id: 'teacher-1',
    grade: {
      id: 'grade-1',
      school_id: 'school-1',
      level: 'upper_secondary',
      grade_number: 10
    }
  },
  current_term: {
    id: 'term-1',
    academic_year_id: 'year-1',
    code: 'S1',
    start_date: '2024-09-01',
    end_date: '2025-01-15'
  },
  subjects: [
    {
      subject: {
        id: 'math',
        code: 'MATH',
        name: 'Toán học',
        level: 'upper_secondary',
        is_active: true
      },
      teacher: {
        id: 'teacher-math',
        role: 'teacher',
        full_name: 'Cô Nguyễn Thị Lan',
        email: 'lan.nguyen@school.edu',
        phone: '+84-123-456-789',
        school_id: 'school-1',
        created_at: '2023-08-01T00:00:00Z'
      },
      grade_components: [],
      scores: [],
      average_score: 8.5,
      letter_grade: 'A'
    },
    {
      subject: {
        id: 'literature',
        code: 'LIT',
        name: 'Ngữ văn',
        level: 'upper_secondary',
        is_active: true
      },
      teacher: {
        id: 'teacher-lit',
        role: 'teacher',
        full_name: 'Thầy Trần Văn Nam',
        email: 'nam.tran@school.edu',
        phone: '+84-123-456-790',
        school_id: 'school-1',
        created_at: '2023-08-01T00:00:00Z'
      },
      grade_components: [],
      scores: [],
      average_score: 7.8,
      letter_grade: 'B'
    }
  ],
  behavior_notes: [],
  behavior_summary: {
    excellent_count: 8,
    good_count: 12,
    fair_count: 3,
    needs_improvement_count: 1,
    poor_count: 0
  },
  upcoming_assessments: [],
  recent_announcements: [],
  overall_average: 8.2,
  class_rank: 5
};

const getBehaviorIcon = (level: string) => {
  switch (level) {
    case 'excellent':
      return <CheckCircle className='h-4 w-4 text-green-600' />;
    case 'good':
      return <CheckCircle className='h-4 w-4 text-blue-600' />;
    case 'fair':
      return <Minus className='h-4 w-4 text-yellow-600' />;
    case 'needs_improvement':
      return <AlertTriangle className='h-4 w-4 text-orange-600' />;
    case 'poor':
      return <XCircle className='h-4 w-4 text-red-600' />;
    default:
      return <Minus className='h-4 w-4 text-gray-600' />;
  }
};

const getGradeColor = (score: number) => {
  if (score >= 9.0) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 8.0) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (score >= 6.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (score >= 5.0) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getPerformanceIcon = (average: number) => {
  if (average >= 9.0) return <Star className='h-4 w-4 text-green-600' />;
  if (average >= 8.0) return <TrendingUp className='h-4 w-4 text-blue-600' />;
  if (average >= 6.5) return <Target className='h-4 w-4 text-yellow-600' />;
  return <AlertCircle className='h-4 w-4 text-red-600' />;
};

export function ChildDetailDialog({
  childId,
  children
}: ChildDetailDialogProps) {
  const [open, setOpen] = useState(false);

  // In real app, fetch child detail based on childId
  const childData = mockChildDetail;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-[1200px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Chi tiết học tập - {childData.child.full_name}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về kết quả học tập và hạnh kiểm của con
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Student Overview */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Award className='h-5 w-5' />
                Tổng quan học tập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-4'>
                <div className='rounded-lg border p-4 text-center'>
                  <div className='mb-2 flex items-center justify-center'>
                    {getPerformanceIcon(childData.overall_average)}
                  </div>
                  <div className='text-2xl font-bold'>
                    {childData.overall_average.toFixed(1)}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Điểm trung bình
                  </div>
                </div>
                <div className='rounded-lg border p-4 text-center'>
                  <div className='mb-2 flex items-center justify-center'>
                    <Target className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='text-2xl font-bold'>
                    #{childData.class_rank}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Xếp hạng lớp
                  </div>
                </div>
                <div className='rounded-lg border p-4 text-center'>
                  <div className='mb-2 flex items-center justify-center'>
                    <BookOpen className='h-5 w-5 text-purple-600' />
                  </div>
                  <div className='text-2xl font-bold'>
                    {childData.subjects.length}
                  </div>
                  <div className='text-muted-foreground text-sm'>Môn học</div>
                </div>
                <div className='rounded-lg border p-4 text-center'>
                  <div className='mb-2 flex items-center justify-center'>
                    <CheckCircle className='h-5 w-5 text-green-600' />
                  </div>
                  <div className='text-2xl font-bold'>
                    {childData.behavior_summary.excellent_count}
                  </div>
                  <div className='text-muted-foreground text-sm'>Khen ngợi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue='subjects' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='subjects'>Kết quả học tập</TabsTrigger>
              <TabsTrigger value='behavior'>Hạnh kiểm</TabsTrigger>
              <TabsTrigger value='communication'>Liên lạc</TabsTrigger>
            </TabsList>

            <TabsContent value='subjects' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Kết quả theo môn học
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {childData.subjects.map((subjectData) => (
                      <Card
                        key={subjectData.subject.id}
                        className='hover:bg-muted/50 transition-colors'
                      >
                        <CardContent className='p-4'>
                          <div className='mb-4 flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                              <div className='rounded-lg bg-blue-100 p-2'>
                                <BookOpen className='h-5 w-5 text-blue-600' />
                              </div>
                              <div>
                                <div className='font-medium'>
                                  {subjectData.subject.name}
                                </div>
                                <div className='text-muted-foreground text-sm'>
                                  Giáo viên: {subjectData.teacher.full_name}
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center gap-4'>
                              <div className='text-right'>
                                <div
                                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-medium ${getGradeColor(subjectData.average_score)}`}
                                >
                                  {subjectData.average_score.toFixed(1)}
                                </div>
                                <div className='text-muted-foreground mt-1 text-xs'>
                                  Xếp loại: {subjectData.letter_grade}
                                </div>
                              </div>
                              <Button variant='outline' size='sm'>
                                <MessageSquare className='mr-2 h-4 w-4' />
                                Nhắn tin
                              </Button>
                            </div>
                          </div>

                          {/* Subject Grade Details */}
                          <div className='space-y-3'>
                            <div className='text-sm font-medium'>
                              Chi tiết điểm số:
                            </div>
                            <div className='grid gap-2'>
                              {/* Mock detailed scores for this subject */}
                              {[
                                {
                                  name: 'Kiểm tra miệng',
                                  weight: 1.0,
                                  score: 8.5,
                                  date: '2024-09-15',
                                  comment: 'Trả lời tốt'
                                },
                                {
                                  name: 'Kiểm tra 15 phút',
                                  weight: 1.0,
                                  score: 7.8,
                                  date: '2024-09-22',
                                  comment: 'Cần cải thiện phần cuối'
                                },
                                {
                                  name: 'Kiểm tra 1 tiết',
                                  weight: 2.0,
                                  score: 8.2,
                                  date: '2024-09-30',
                                  comment:
                                    'Làm bài tốt, chữ viết cần rõ ràng hơn'
                                },
                                {
                                  name: 'Bài tập về nhà',
                                  weight: 1.0,
                                  score: 9.0,
                                  date: '2024-10-01',
                                  comment: 'Hoàn thành đầy đủ, chính xác'
                                }
                              ].map((scoreDetail, index) => (
                                <div
                                  key={index}
                                  className='bg-muted/30 flex items-center justify-between rounded p-2'
                                >
                                  <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                      <span className='text-sm font-medium'>
                                        {scoreDetail.name}
                                      </span>
                                      <Badge
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        Hệ số {scoreDetail.weight.toFixed(1)}
                                      </Badge>
                                    </div>
                                    <div className='text-muted-foreground mt-1 text-xs'>
                                      {scoreDetail.date} • {scoreDetail.comment}
                                    </div>
                                  </div>
                                  <div
                                    className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium ${getGradeColor(scoreDetail.score)}`}
                                  >
                                    {scoreDetail.score.toFixed(1)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className='border-t pt-2'>
                              <div className='text-muted-foreground text-xs'>
                                <strong>Cách tính:</strong> (8.5×1 + 7.8×1 +
                                8.2×2 + 9.0×1) ÷ 5 ={' '}
                                {subjectData.average_score.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='behavior' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Award className='h-5 w-5' />
                    Tổng quan hạnh kiểm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 md:grid-cols-5'>
                    {Object.entries(childData.behavior_summary).map(
                      ([level, count]) => {
                        const levelName = level
                          .replace('_count', '')
                          .replace('_', ' ');
                        const displayName =
                          levelName === 'excellent'
                            ? 'Xuất sắc'
                            : levelName === 'good'
                              ? 'Tốt'
                              : levelName === 'fair'
                                ? 'Khá'
                                : levelName === 'needs improvement'
                                  ? 'Cần cải thiện'
                                  : 'Yếu';
                        return (
                          <div
                            key={level}
                            className='rounded-lg border p-3 text-center'
                          >
                            <div className='mb-2 flex items-center justify-center'>
                              {getBehaviorIcon(level.replace('_count', ''))}
                            </div>
                            <div className='text-2xl font-bold'>{count}</div>
                            <div className='text-muted-foreground text-xs'>
                              {displayName}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Behavior Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Bell className='h-5 w-5' />
                    Ghi chú hạnh kiểm gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-96 space-y-4 overflow-y-auto'>
                    {/* Mock behavior notes with detailed content */}
                    {[
                      {
                        id: 'note-1',
                        level: 'excellent',
                        note: 'Em Khang tích cực tham gia hoạt động nhóm trong dự án khoa học về môi trường. Em có khả năng lãnh đạo tốt và luôn động viên các bạn trong nhóm hoàn thành nhiệm vụ.',
                        teacher: 'Cô Nguyễn Thị Lan',
                        subject: 'Khoa học tự nhiên',
                        date: '2024-10-01',
                        time: '14:30'
                      },
                      {
                        id: 'note-2',
                        level: 'good',
                        note: 'Học sinh có thái độ học tập nghiêm túc, luôn hoàn thành bài tập đúng hạn. Tuy nhiên cần tích cực hơn trong việc phát biểu ý kiến trong giờ học.',
                        teacher: 'Thầy Trần Văn Nam',
                        subject: 'Ngữ văn',
                        date: '2024-09-28',
                        time: '10:15'
                      },
                      {
                        id: 'note-3',
                        level: 'needs_improvement',
                        note: 'Em cần chú ý tập trung hơn trong giờ học Toán. Đã có hiện tượng nói chuyện riêng với bạn bè trong lúc giáo viên giảng bài. Cần khuyến khích em tự giác hơn.',
                        teacher: 'Cô Lê Thị Hoa',
                        subject: 'Toán học',
                        date: '2024-09-25',
                        time: '08:45'
                      },
                      {
                        id: 'note-4',
                        level: 'excellent',
                        note: 'Em Khang đã giúp đỡ bạn mới chuyển lớp hòa nhập với tập thể. Thể hiện tinh thần đoàn kết, yêu thương bạn bè rất đáng khen ngợi.',
                        teacher: 'Cô Phạm Thị Mai',
                        subject: 'Chủ nhiệm',
                        date: '2024-09-20',
                        time: '16:00'
                      },
                      {
                        id: 'note-5',
                        level: 'good',
                        note: 'Tham gia tích cực vào hoạt động thể thao của lớp. Em có tinh thần thể thao tốt và luôn cổ vũ các bạn.',
                        teacher: 'Thầy Nguyễn Văn Đức',
                        subject: 'Thể dục',
                        date: '2024-09-18',
                        time: '15:30'
                      }
                    ].map((behaviorNote) => (
                      <div
                        key={behaviorNote.id}
                        className={`rounded-lg border p-4 ${
                          behaviorNote.level === 'excellent'
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                            : behaviorNote.level === 'good'
                              ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                              : behaviorNote.level === 'needs_improvement'
                                ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                        }`}
                      >
                        <div className='mb-3 flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            {getBehaviorIcon(behaviorNote.level)}
                            <span
                              className={`text-sm font-medium capitalize ${
                                behaviorNote.level === 'excellent'
                                  ? 'text-green-700 dark:text-green-300'
                                  : behaviorNote.level === 'good'
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : behaviorNote.level === 'needs_improvement'
                                      ? 'text-orange-700 dark:text-orange-300'
                                      : 'text-red-700 dark:text-red-300'
                              }`}
                            >
                              {behaviorNote.level === 'excellent'
                                ? 'Xuất sắc'
                                : behaviorNote.level === 'good'
                                  ? 'Tốt'
                                  : behaviorNote.level === 'needs_improvement'
                                    ? 'Cần cải thiện'
                                    : 'Yếu'}
                            </span>
                          </div>
                          <Badge variant='outline' className='text-xs'>
                            {behaviorNote.date} {behaviorNote.time}
                          </Badge>
                        </div>

                        <p
                          className={`mb-3 text-sm leading-relaxed ${
                            behaviorNote.level === 'excellent'
                              ? 'text-green-800 dark:text-green-200'
                              : behaviorNote.level === 'good'
                                ? 'text-blue-800 dark:text-blue-200'
                                : behaviorNote.level === 'needs_improvement'
                                  ? 'text-orange-800 dark:text-orange-200'
                                  : 'text-red-800 dark:text-red-200'
                          }`}
                        >
                          &rdquo;{behaviorNote.note}&rdquo;
                        </p>

                        <div className='text-muted-foreground flex items-center justify-between text-xs'>
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1'>
                              <User className='h-3 w-3' />
                              <span>{behaviorNote.teacher}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <BookOpen className='h-3 w-3' />
                              <span>{behaviorNote.subject}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='communication' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5' />
                    Liên lạc với giáo viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {childData.subjects.map((subjectData) => (
                      <div
                        key={subjectData.subject.id}
                        className='flex items-center justify-between rounded-lg border p-4'
                      >
                        <div className='flex items-center gap-4'>
                          <Avatar className='h-10 w-10'>
                            <AvatarFallback className='bg-blue-100 text-blue-600'>
                              {subjectData.teacher.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>
                              {subjectData.teacher.full_name}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              Giáo viên {subjectData.subject.name}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button variant='outline' size='sm'>
                            <MessageSquare className='mr-2 h-4 w-4' />
                            Nhắn tin
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
