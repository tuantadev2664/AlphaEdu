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
import { useStudentRank } from '@/features/score/hooks/use-score.query';
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

import type {
  ParentChildFullInfoItem,
  ParentCommunicationItem,
  ParentCommunicationMessage
} from '@/features/parent/types';

interface ChildDetailDialogProps {
  childId: string;
  classId?: string;
  termId?: string;
  childData?: ParentChildFullInfoItem;
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
    case 'Excellent':
      return <CheckCircle className='h-4 w-4 text-green-600' />;
    case 'Good':
      return <CheckCircle className='h-4 w-4 text-blue-600' />;
    case 'Fair':
      return <Minus className='h-4 w-4 text-yellow-600' />;
    case 'Needs improvement':
      return <AlertTriangle className='h-4 w-4 text-orange-600' />;
    case 'Poor':
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

const getLetterGrade = (score: number) => {
  if (score >= 9.0) return 'A+';
  if (score >= 8.5) return 'A';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
};

// Mock data for communication
const generateMockCommunication = (
  teacherId: string,
  teacherName: string,
  subjectName: string
): ParentCommunicationItem => {
  const conversations = [
    {
      lastMessage:
        'Cảm ơn phụ huynh đã quan tâm. Em học rất tốt trong tuần này!',
      unreadCount: 0,
      status: 'active' as const
    },
    {
      lastMessage:
        'Em cần chú ý hơn trong giờ học Toán. Mong phụ huynh hỗ trợ thêm.',
      unreadCount: 1,
      status: 'active' as const
    },
    {
      lastMessage: 'Em đã cải thiện rất nhiều. Tiếp tục phát huy nhé!',
      unreadCount: 0,
      status: 'active' as const
    },
    {
      lastMessage: 'Có bài tập về nhà cần em hoàn thành trước thứ 2.',
      unreadCount: 2,
      status: 'active' as const
    },
    {
      lastMessage: 'Em tham gia tích cực trong hoạt động nhóm. Rất đáng khen!',
      unreadCount: 0,
      status: 'active' as const
    }
  ];

  const randomConversation =
    conversations[Math.floor(Math.random() * conversations.length)];

  return {
    id: `conv-${teacherId}-${Date.now()}`,
    teacherId,
    teacherName,
    subjectName,
    lastMessage: randomConversation.lastMessage,
    lastMessageTime: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    unreadCount: randomConversation.unreadCount,
    status: randomConversation.status
  };
};

export function ChildDetailDialog({
  childId,
  classId,
  termId,
  childData,
  children
}: ChildDetailDialogProps) {
  const [open, setOpen] = useState(false);

  // Default values for classId and termId if not provided
  const defaultClassId = classId || '33333333-3333-3333-3333-333333333333';
  const defaultTermId = termId || '33333333-3333-3333-3333-333333333333';

  // Fetch student rank data from API
  const { data: studentRank, isLoading: studentRankLoading } = useStudentRank(
    childId,
    {
      classId: defaultClassId,
      termId: defaultTermId
    },
    {
      enabled: open && !!childId && !!defaultClassId && !!defaultTermId
    }
  );

  // Process childData from API
  const displayData = childData
    ? {
        studentId: childData.studentId,
        studentName: childData.studentName,
        className: childData.className,
        classId: childData.classId,
        overallAverage:
          childData.transcript?.subjects?.length > 0
            ? childData.transcript.subjects.reduce(
                (sum, s) => sum + (s.averageScore || 0),
                0
              ) / childData.transcript.subjects.length
            : 0,
        recentScores: (childData.scores || []).slice(-6).map((s) => ({
          title: s.assessmentName || 'Bài kiểm tra',
          score: s.score1 || 0,
          isAbsent: s.isAbsent
        })),
        latestBehaviorNote:
          childData.behaviorNotes?.length > 0
            ? {
                level: childData.behaviorNotes[0].level,
                note: childData.behaviorNotes[0].note,
                createdAt: childData.behaviorNotes[0].createdAt,
                teacherName: childData.behaviorNotes[0].teacherName
              }
            : null,
        upcomingAssessments: (childData.subjects || [])
          .flatMap(
            (subject) =>
              subject.components?.flatMap(
                (component) =>
                  component.assessments?.map((assessment) => ({
                    id: assessment.assessmentId,
                    title: assessment.title,
                    dueDate: assessment.dueDate
                  })) || []
              ) || []
          )
          .slice(0, 5)
      }
    : {
        studentId: childId,
        studentName: 'Học sinh',
        className: 'Lớp',
        classId: defaultClassId,
        overallAverage: 0,
        recentScores: [],
        latestBehaviorNote: null,
        upcomingAssessments: []
      };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-[98vw] overflow-y-auto px-3 sm:max-w-[1200px] sm:px-6'>
        <DialogHeader className='pb-3'>
          <DialogTitle className='flex items-center gap-2 text-sm sm:text-base'>
            <User className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='truncate'>
              Chi tiết học tập - {displayData.studentName}
            </span>
          </DialogTitle>
          <DialogDescription className='text-xs sm:text-sm'>
            Thông tin chi tiết về kết quả học tập và hạnh kiểm của con
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 sm:space-y-6'>
          {/* Student Overview */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                <Award className='h-4 w-4 sm:h-5 sm:w-5' />
                Tổng quan học tập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4'>
                <div className='rounded-lg border p-3 text-center sm:p-4'>
                  <div className='mb-2 flex items-center justify-center'>
                    {getPerformanceIcon(childData?.overallAverage || 0)}
                  </div>
                  <div className='text-lg font-bold sm:text-2xl'>
                    {childData?.overallAverage?.toFixed(1) || 0}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Điểm trung bình
                  </div>
                </div>
                <div className='rounded-lg border p-3 text-center sm:p-4'>
                  <div className='mb-2 flex items-center justify-center'>
                    {studentRankLoading ? (
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 sm:h-5 sm:w-5'></div>
                    ) : studentRank ? (
                      studentRank.rank <= 3 ? (
                        <Award className='h-4 w-4 text-amber-600 sm:h-5 sm:w-5' />
                      ) : (
                        <Target className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5' />
                      )
                    ) : (
                      <Target className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5' />
                    )}
                  </div>
                  <div className='text-lg font-bold sm:text-2xl'>
                    {studentRankLoading ? (
                      <div className='mx-auto h-6 w-8 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-12'></div>
                    ) : studentRank ? (
                      `#${studentRank.rank}`
                    ) : (
                      `#N/A`
                    )}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Xếp hạng lớp
                  </div>
                </div>
                <div className='rounded-lg border p-3 text-center sm:p-4'>
                  <div className='mb-2 flex items-center justify-center'>
                    <BookOpen className='h-4 w-4 text-purple-600 sm:h-5 sm:w-5' />
                  </div>
                  <div className='text-lg font-bold sm:text-2xl'>
                    {childData?.subjects?.length || 0}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Môn học
                  </div>
                </div>
                <div className='rounded-lg border p-3 text-center sm:p-4'>
                  <div className='mb-2 flex items-center justify-center'>
                    <CheckCircle className='h-4 w-4 text-green-600 sm:h-5 sm:w-5' />
                  </div>
                  <div className='text-lg font-bold sm:text-2xl'>
                    {childData?.behaviorNotes?.length || 0}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Ghi chú hạnh kiểm
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue='subjects' className='w-full'>
            <TabsList className='grid h-auto w-full grid-cols-3'>
              <TabsTrigger
                value='subjects'
                className='px-1 py-2 text-xs sm:text-sm'
              >
                <span className='hidden sm:inline'>Kết quả học tập</span>
                <span className='sm:hidden'>Học tập</span>
              </TabsTrigger>
              <TabsTrigger
                value='behavior'
                className='px-1 py-2 text-xs sm:text-sm'
              >
                Hạnh kiểm
              </TabsTrigger>
              <TabsTrigger
                value='communication'
                className='px-1 py-2 text-xs sm:text-sm'
              >
                <span className='hidden sm:inline'>Liên lạc</span>
                <span className='sm:hidden'>Chat</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='subjects' className='space-y-3 sm:space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                    <BookOpen className='h-4 w-4 sm:h-5 sm:w-5' />
                    Kết quả theo môn học
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 sm:space-y-4'>
                    {childData?.subjects?.map((subjectData) => (
                      <Card
                        key={subjectData.subjectId}
                        className='hover:bg-muted/50 transition-colors'
                      >
                        <CardContent className='p-3 sm:p-4'>
                          <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                            <div className='flex min-w-0 flex-1 items-center gap-3'>
                              <div className='flex-shrink-0 rounded-lg bg-blue-100 p-2'>
                                <BookOpen className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5' />
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='truncate text-sm font-medium sm:text-base'>
                                  {subjectData.subjectName}
                                </div>
                                <div className='text-muted-foreground truncate text-xs sm:text-sm'>
                                  Giáo viên: {subjectData.teacherName}
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center gap-2 sm:gap-4'>
                              <div className='text-right'>
                                {(() => {
                                  const transcriptSubject =
                                    childData?.transcript?.subjects?.find(
                                      (s) =>
                                        s.subjectName ===
                                        subjectData.subjectName
                                    );
                                  const averageScore =
                                    transcriptSubject?.averageScore || 0;
                                  return (
                                    <>
                                      <div
                                        className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getGradeColor(averageScore)}`}
                                      >
                                        {averageScore > 0
                                          ? averageScore.toFixed(1)
                                          : 'N/A'}
                                      </div>
                                      <div className='text-muted-foreground mt-1 text-xs'>
                                        Xếp loại:{' '}
                                        {averageScore > 0
                                          ? getLetterGrade(averageScore)
                                          : 'N/A'}
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-xs sm:text-sm'
                              >
                                <MessageSquare className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                                <span className='hidden sm:inline'>
                                  Nhắn tin
                                </span>
                                <span className='sm:hidden'>Chat</span>
                              </Button>
                            </div>
                          </div>

                          {/* Subject Grade Details */}
                          <div className='space-y-2 sm:space-y-3'>
                            <div className='text-xs font-medium sm:text-sm'>
                              Chi tiết điểm số:
                            </div>
                            <div className='space-y-2'>
                              {(() => {
                                const allAssessments =
                                  subjectData.components?.flatMap(
                                    (component) => component.assessments || []
                                  ) || [];

                                if (allAssessments.length === 0) {
                                  return (
                                    <div className='text-muted-foreground py-8 text-center'>
                                      <BookOpen className='mx-auto mb-4 h-12 w-12 opacity-50' />
                                      <p>Chưa có bài kiểm tra nào</p>
                                    </div>
                                  );
                                }

                                return allAssessments.map((assessment) => {
                                  const component =
                                    subjectData.components?.find((comp) =>
                                      comp.assessments?.some(
                                        (ass) =>
                                          ass.assessmentId ===
                                          assessment.assessmentId
                                      )
                                    );

                                  return (
                                    <div
                                      key={assessment.assessmentId}
                                      className='bg-muted/30 flex flex-col gap-2 rounded p-2 sm:flex-row sm:items-center sm:justify-between'
                                    >
                                      <div className='min-w-0 flex-1'>
                                        <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                                          <span className='truncate text-xs font-medium sm:text-sm'>
                                            {assessment.title}
                                          </span>
                                          <Badge
                                            variant='outline'
                                            className='w-fit text-xs'
                                          >
                                            Hệ số {component?.weight || 1}
                                          </Badge>
                                        </div>
                                        <div className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                                          {component?.componentName ||
                                            'Bài kiểm tra'}
                                          {assessment.comment &&
                                            ` • ${assessment.comment}`}
                                        </div>
                                      </div>
                                      <div
                                        className={`inline-flex flex-shrink-0 items-center justify-center rounded-full border px-2 py-1 text-xs font-medium ${
                                          assessment.isAbsent
                                            ? 'border-red-200 bg-red-100 text-red-800'
                                            : getGradeColor(assessment.score)
                                        }`}
                                      >
                                        {assessment.isAbsent
                                          ? 'Vắng'
                                          : assessment.score.toFixed(1)}
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            {subjectData.components &&
                              subjectData.components.length > 0 && (
                                <div className='border-t pt-2'>
                                  <div className='text-muted-foreground text-xs'>
                                    <strong>Tổng điểm số:</strong>{' '}
                                    {subjectData.components.reduce(
                                      (sum, comp) =>
                                        sum + (comp.assessments?.length || 0),
                                      0
                                    )}{' '}
                                    bài
                                  </div>
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='behavior' className='space-y-3 sm:space-y-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                    <Award className='h-4 w-4 sm:h-5 sm:w-5' />
                    Tổng quan hạnh kiểm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 sm:space-y-4'>
                    {childData?.behaviorNotes &&
                    childData.behaviorNotes.length > 0 ? (
                      <div className='grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-5'>
                        {[
                          'Excellent',
                          'Good',
                          'Fair',
                          'Needs improvement',
                          'Poor'
                        ].map((level) => {
                          const count =
                            childData.behaviorNotes?.filter(
                              (note) => note.level === level
                            ).length || 0;
                          const displayName =
                            level === 'Excellent'
                              ? 'Xuất sắc'
                              : level === 'Good'
                                ? 'Tốt'
                                : level === 'Fair'
                                  ? 'Khá'
                                  : level === 'Needs improvement'
                                    ? 'Cần cải thiện'
                                    : 'Yếu';
                          return (
                            <div
                              key={level}
                              className='rounded-lg border p-2 text-center sm:p-3'
                            >
                              <div className='mb-2 flex items-center justify-center'>
                                {getBehaviorIcon(level)}
                              </div>
                              <div className='text-lg font-bold sm:text-2xl'>
                                {count}
                              </div>
                              <div className='text-muted-foreground text-xs'>
                                {displayName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className='text-muted-foreground py-8 text-center'>
                        <Award className='mx-auto mb-4 h-12 w-12 opacity-50' />
                        <p>Chưa có ghi chú hạnh kiểm</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Behavior Notes */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                    <Bell className='h-4 w-4 sm:h-5 sm:w-5' />
                    Ghi chú hạnh kiểm gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-80 space-y-3 overflow-y-auto sm:max-h-96 sm:space-y-4'>
                    {childData?.behaviorNotes &&
                    childData.behaviorNotes.length > 0 ? (
                      childData.behaviorNotes
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((behaviorNote) => (
                          <div
                            key={behaviorNote.id}
                            className={`rounded-lg border p-3 sm:p-4 ${
                              behaviorNote.level === 'Excellent'
                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                : behaviorNote.level === 'Good'
                                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                                  : behaviorNote.level === 'Needs improvement'
                                    ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                            }`}
                          >
                            <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                              <div className='flex items-center gap-2'>
                                {getBehaviorIcon(behaviorNote.level)}
                                <span
                                  className={`text-xs font-medium capitalize sm:text-sm ${
                                    behaviorNote.level === 'Excellent'
                                      ? 'text-green-700 dark:text-green-300'
                                      : behaviorNote.level === 'Good'
                                        ? 'text-blue-700 dark:text-blue-300'
                                        : behaviorNote.level ===
                                            'Needs improvement'
                                          ? 'text-orange-700 dark:text-orange-300'
                                          : 'text-red-700 dark:text-red-300'
                                  }`}
                                >
                                  {behaviorNote.level === 'Excellent'
                                    ? 'Xuất sắc'
                                    : behaviorNote.level === 'Good'
                                      ? 'Tốt'
                                      : behaviorNote.level ===
                                          'Needs improvement'
                                        ? 'Cần cải thiện'
                                        : 'Yếu'}
                                </span>
                              </div>
                              <Badge
                                variant='outline'
                                className='w-fit text-xs'
                              >
                                {format(
                                  new Date(behaviorNote.createdAt),
                                  'dd/MM/yyyy HH:mm'
                                )}
                              </Badge>
                            </div>

                            <p
                              className={`mb-3 text-xs leading-relaxed sm:text-sm ${
                                behaviorNote.level === 'Excellent'
                                  ? 'text-green-800 dark:text-green-200'
                                  : behaviorNote.level === 'Good'
                                    ? 'text-blue-800 dark:text-blue-200'
                                    : behaviorNote.level === 'Needs improvement'
                                      ? 'text-orange-800 dark:text-orange-200'
                                      : 'text-red-800 dark:text-red-200'
                              }`}
                            >
                              &rdquo;{behaviorNote.note}&rdquo;
                            </p>

                            <div className='text-muted-foreground flex items-center justify-between text-xs'>
                              <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-1'>
                                  <User className='h-3 w-3 flex-shrink-0' />
                                  <span className='truncate'>
                                    {behaviorNote.teacherName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className='text-muted-foreground py-8 text-center'>
                        <Bell className='mx-auto mb-4 h-12 w-12 opacity-50' />
                        <p>Chưa có ghi chú hạnh kiểm gần đây</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value='communication'
              className='space-y-3 sm:space-y-4'
            >
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                    <MessageSquare className='h-4 w-4 sm:h-5 sm:w-5' />
                    Liên lạc với giáo viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3 sm:space-y-4'>
                    {childData?.subjects?.map((subjectData) => {
                      const communication = generateMockCommunication(
                        subjectData.teacherId,
                        subjectData.teacherName,
                        subjectData.subjectName
                      );

                      return (
                        <div
                          key={subjectData.subjectId}
                          className='hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-4'
                        >
                          <div className='flex min-w-0 flex-1 items-center gap-3'>
                            <Avatar className='h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10'>
                              <AvatarFallback className='bg-blue-100 text-blue-600'>
                                {subjectData.teacherName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 flex-1'>
                              <div className='flex items-center gap-2'>
                                <div className='truncate text-sm font-medium sm:text-base'>
                                  {subjectData.teacherName}
                                </div>
                                {communication.unreadCount > 0 && (
                                  <Badge
                                    variant='destructive'
                                    className='flex-shrink-0 text-xs'
                                  >
                                    {communication.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <div className='text-muted-foreground truncate text-xs sm:text-sm'>
                                Giáo viên {subjectData.subjectName}
                              </div>
                              <div className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                                {communication.lastMessage}
                              </div>
                              <div className='text-muted-foreground text-xs'>
                                {format(
                                  new Date(communication.lastMessageTime),
                                  'dd/MM/yyyy HH:mm'
                                )}
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              className='w-full text-xs sm:w-auto sm:text-sm'
                            >
                              <MessageSquare className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                              <span className='hidden sm:inline'>Nhắn tin</span>
                              <span className='sm:hidden'>Chat</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
