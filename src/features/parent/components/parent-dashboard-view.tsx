'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ParentDashboard } from '@/features/parent/types';
import {
  ChildDetailDialog,
  TeacherCommunicationDialog
} from '@/features/parent/components/dialogs';
import {
  Users,
  BookOpen,
  TrendingUp,
  Bell,
  Clock,
  User,
  GraduationCap,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Minus,
  Eye,
  Star,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { fakeParent } from '@/constants/mock-api';
import { Heading } from '@/components/ui/heading';
import { useParentChildrenFullInfoQuery } from '@/features/parent/hooks/use-parent.query';
import {
  useStudentAnalysis,
  useStudentOverallAverage
} from '@/features/score/hooks/use-score.query';

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

export function ParentDashboardView() {
  const [dashboardData, setDashboardData] = useState<ParentDashboard | null>(
    null
  );
  const [selectedChild, setSelectedChild] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fakeParent.getParentDashboard('parent-1');
        if (mounted) {
          setDashboardData(data as any);
          setSelectedChild(data.children[0]?.student.id || '');
        }
      } catch (e) {
        // keep mock failure silent
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  let { data: apiChildrenFullInfo, isLoading: apiLoading } =
    useParentChildrenFullInfoQuery('33333333-3333-3333-3333-333333333333');

  const parent = dashboardData?.parent;
  const children = dashboardData?.children ?? [];
  const unread_messages_count = dashboardData?.unread_messages_count ?? 0;

  const { data: overallAverage } = useStudentOverallAverage({
    studentId: apiChildrenFullInfo?.[0]?.studentId ?? '',
    termId: '33333333-3333-3333-3333-333333333333'
  });

  const { data: studentAnalysis } = useStudentAnalysis({
    studentId: apiChildrenFullInfo?.[0]?.studentId ?? '',
    termId: '33333333-3333-3333-3333-333333333333'
  });

  apiChildrenFullInfo = apiChildrenFullInfo?.map((child) => ({
    ...child,
    overallAverage: overallAverage ?? 0
  }));

  // Extract announcements from API data
  const recent_announcements = useMemo(() => {
    if (!apiChildrenFullInfo) return [];

    // Collect all announcements from all children
    const allAnnouncements = apiChildrenFullInfo.flatMap((child) =>
      child.announcements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        is_urgent: announcement.isUrgent,
        created_at: announcement.createdAt,
        expires_at: announcement.expiresAt,
        sender_id: announcement.senderId,
        class_id: announcement.classId,
        subject_id: announcement.subjectId,
        sender: {
          full_name: 'Giáo viên' // API không trả về thông tin sender, dùng placeholder
        }
      }))
    );

    // Sort by created_at descending and take the most recent ones
    return allAnnouncements
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10); // Take top 10 most recent
  }, [apiChildrenFullInfo]);

  const apiChildrenOverview = useMemo(() => {
    if (!apiChildrenFullInfo) return [];

    return apiChildrenFullInfo.map((c) => {
      const recentScores = (c.scores ?? []).slice(-6).map((s) => ({
        title: s.assessmentName || 'Bài kiểm tra',
        score: Number(s.score1) || 0,
        isAbsent: !!s.isAbsent
      }));

      const latestBehavior = (c.behaviorNotes ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      const upcomingAssessments: Array<{
        id: string;
        title: string;
        dueDate: string;
      }> = [];
      (c.subjects ?? []).forEach((subj) => {
        (subj.components ?? []).forEach((comp) => {
          (comp.assessments ?? []).forEach((a) => {
            if (a.dueDate) {
              upcomingAssessments.push({
                id: a.assessmentId,
                title: a.title,
                dueDate: a.dueDate
              });
            }
          });
        });
      });

      upcomingAssessments.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

      return {
        studentId: c.studentId,
        studentName: c.studentName,
        className: c.className,
        classId: c.classId,
        overallAverage: overallAverage ?? 0,
        recentScores,
        latestBehaviorNote: latestBehavior
          ? {
              level: latestBehavior.level,
              note: latestBehavior.note,
              createdAt: latestBehavior.createdAt,
              teacherName: latestBehavior.teacherName
            }
          : null,
        upcomingAssessments
      };
    });
  }, [apiChildrenFullInfo]);

  // Calculate overall family performance
  const familyAverage = useMemo(() => {
    if (apiChildrenFullInfo && apiChildrenFullInfo.length > 0) {
      const perChildAvg = apiChildrenFullInfo.map((c) => {
        const subjects = c.transcript?.subjects ?? [];
        const valid = subjects.filter(
          (s) => typeof s.averageScore === 'number'
        );
        if (valid.length === 0) return 0;
        const sum = valid.reduce(
          (acc, s) => acc + (Number(s.averageScore) || 0),
          0
        );
        return sum / valid.length;
      });
      if (perChildAvg.length === 0) return 0;
      return perChildAvg.reduce((a, b) => a + b, 0) / perChildAvg.length;
    }
    if (children.length > 0) {
      return (
        children.reduce((sum, child) => sum + child.overall_average, 0) /
        children.length
      );
    }
    return 0;
  }, [apiChildrenFullInfo, children]);

  const totalBehaviorIssues = children.reduce(
    (sum, child) =>
      sum +
      child.behavior_summary.needs_improvement_count +
      child.behavior_summary.poor_count,
    0
  );

  const urgentAlerts = apiChildrenOverview?.filter(
    (child) =>
      child.latestBehaviorNote?.level === 'Poor' ||
      (child.overallAverage && child.overallAverage < 5.0)
  );

  // Mock academic alerts data - would come from API
  // const academicAlerts = studentAnalysis ? studentAnalysis : [
  //   {
  //     id: 'alert-1',
  //     studentId: 'e6f4ed8e-a84e-48e2-9693-f0d1b36a04f7',
  //     fullName: 'Trần Thị B',
  //     average: 8.5,
  //     belowCount: 0,
  //     riskLevel: 'Thấp',
  //     comment: 'Kết quả ổn định.',
  //     subjects: {
  //       Toán: {
  //         average: 8.5,
  //         assignmentsCount: 1,
  //         belowThresholdCount: 0,
  //         riskLevel: 'Thấp',
  //         comment: 'Ổn định.',
  //         components: [
  //           {
  //             gradeComponentId: 'cf47a46f-8db2-48bf-ad68-447eeccf003a',
  //             gradeComponentName: 'KT 15 phút',
  //             kind: 'quiz',
  //             weight: 1,
  //             maxScore: 10,
  //             average: 8.5,
  //             count: 1,
  //             belowThresholdCount: 0,
  //             riskLevel: 'Thấp',
  //             comment: 'Ổn định.'
  //           }
  //         ]
  //       }
  //     },
  //     summary:
  //       'Học sinh Trần Thị B có trung bình 8.50 trong học kỳ này, 0 môn dưới chuẩn, mức rủi ro Thấp.'
  //   }
  // ];

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Thấp':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300';
      case 'Trung bình':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'Cao':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-300';
      case 'Rất cao':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'medium':
        return <AlertTriangle className='h-4 w-4 text-yellow-600' />;
      case 'high':
        return <AlertCircle className='h-4 w-4 text-orange-600' />;
      case 'very high':
        return <XCircle className='h-4 w-4 text-red-600' />;
      default:
        return <Minus className='h-4 w-4 text-gray-600' />;
    }
  };

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Chào mừng, ${parent?.full_name ?? 'Phụ huynh'}!`}
          description='Theo dõi tình hình học tập của các con và liên lạc với giáo viên.'
        />
      </div>
      <Separator />

      <div className='space-y-4 md:space-y-6'>
        {/* Family Overview Header */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tổng số con</CardTitle>
              <Users className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent className='pb-3'>
              <div className='text-xl font-bold sm:text-2xl'>
                {apiChildrenFullInfo
                  ? apiChildrenFullInfo.length
                  : children.length}
              </div>
              <p className='text-muted-foreground text-xs'>
                Đang theo dõi học tập
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Điểm TB gia đình
              </CardTitle>
              <GraduationCap className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent className='pb-3'>
              <div className='text-xl font-bold sm:text-2xl'>
                {(apiChildrenFullInfo?.reduce(
                  (sum, child) => sum + (child.overallAverage ?? 0),
                  0
                ) || 0) / (apiChildrenFullInfo?.length ?? 0) || 0}
              </div>
              <div className='flex items-center gap-1'>
                {getPerformanceIcon(
                  (apiChildrenFullInfo?.reduce(
                    (sum, child) => sum + (child.overallAverage ?? 0),
                    0
                  ) || 0) / (apiChildrenFullInfo?.length ?? 0) || 0
                )}
                <p className='text-muted-foreground text-xs'>
                  Trung bình các con
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Tin nhắn chưa đọc
              </CardTitle>
              <MessageSquare className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent className='pb-3'>
              <div className='text-xl font-bold sm:text-2xl'>
                {unread_messages_count}
              </div>
              <p className='text-muted-foreground text-xs'>Từ giáo viên</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Cảnh báo</CardTitle>
              <AlertTriangle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent className='pb-3'>
              <div className='text-xl font-bold text-red-600 sm:text-2xl'>
                {urgentAlerts.length + (studentAnalysis ? 1 : 0)}
              </div>
              <p className='text-muted-foreground text-xs'>
                {urgentAlerts.length > 0 && (studentAnalysis ? 1 : 0)
                  ? 'Hành vi + Học tập'
                  : urgentAlerts.length > 0
                    ? 'Hành vi'
                    : 'Học tập'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Alerts */}
        {urgentAlerts.length > 0 && (
          <Card className='border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm text-red-800 sm:text-base dark:text-red-200'>
                <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5' />
                Cảnh báo hành vi khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {urgentAlerts.map((child) => (
                  <div
                    key={child.studentId}
                    className='flex flex-col gap-3 rounded-lg border border-red-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between dark:border-red-800 dark:bg-red-900/10'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8 flex-shrink-0'>
                        <AvatarFallback className='bg-red-100 text-red-600'>
                          {child.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <div className='truncate font-medium text-red-800 dark:text-red-200'>
                          {child.studentName}
                        </div>
                        <div className='space-y-1 text-sm text-red-600 dark:text-red-400'>
                          {child.overallAverage &&
                            child.overallAverage < 5.0 && (
                              <div className='truncate'>
                                Điểm TB: {child.overallAverage?.toFixed(1)}{' '}
                                (Yếu)
                              </div>
                            )}
                          {child.latestBehaviorNote?.level === 'Poor' && (
                            <div className='line-clamp-2'>
                              {child.latestBehaviorNote?.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChildDetailDialog
                      childId={child.studentId}
                      classId={child.classId}
                      termId='33333333-3333-3333-3333-333333333333'
                      childData={apiChildrenFullInfo?.find(
                        (c) => c.studentId === child.studentId
                      )}
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full border-red-200 text-red-600 hover:bg-red-50 sm:w-auto'
                      >
                        Xem chi tiết
                      </Button>
                    </ChildDetailDialog>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Academic Alerts */}
        {studentAnalysis && (
          <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm text-blue-800 sm:text-base dark:text-blue-200'>
                <TrendingUp className='h-4 w-4 sm:h-5 sm:w-5' />
                Cảnh báo học tập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div
                  key={studentAnalysis?.studentId}
                  className={`rounded-lg border p-3 sm:p-4 ${getRiskLevelColor(studentAnalysis?.riskLevel ?? '')}`}
                >
                  <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10'>
                        <AvatarFallback className='bg-blue-100 text-blue-600'>
                          {studentAnalysis?.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <div className='text-base font-medium sm:text-lg'>
                          {studentAnalysis?.fullName}
                        </div>
                        <div className='text-sm opacity-80'>
                          Điểm TB: {studentAnalysis?.average.toFixed(1)} •{' '}
                          {studentAnalysis?.belowCount} môn dưới chuẩn
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getRiskLevelIcon(
                        studentAnalysis?.riskLevel == 'Thấp'
                          ? 'low'
                          : studentAnalysis?.riskLevel == 'Trung bình'
                            ? 'medium'
                            : studentAnalysis?.riskLevel == 'Cao'
                              ? 'high'
                              : studentAnalysis?.riskLevel == 'Rất cao'
                                ? 'very high'
                                : 'medium'
                      )}
                      <Badge
                        variant='outline'
                        className={`text-xs ${getRiskLevelColor(studentAnalysis?.riskLevel ?? '')}`}
                      >
                        {studentAnalysis?.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className='mb-3'>
                    <p className='mb-2 text-sm font-medium'>Tóm tắt:</p>
                    <p className='line-clamp-3 text-sm opacity-90'>
                      &ldquo;{studentAnalysis?.summary}&rdquo;
                    </p>
                  </div>

                  <div className='mb-3'>
                    <p className='mb-2 text-sm font-medium'>Nhận xét chung:</p>
                    <p className='line-clamp-3 text-sm opacity-90'>
                      &ldquo;{studentAnalysis?.comment}&rdquo;
                    </p>
                  </div>

                  {/* Subject Details */}
                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Chi tiết theo môn:</p>
                    <div className='space-y-2'>
                      {studentAnalysis?.subjects?.map((subjectData) => (
                        <div
                          key={subjectData.subjectId}
                          className='rounded border bg-white/50 p-3 dark:bg-black/20'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <BookOpen className='h-4 w-4' />
                              <span className='font-medium'>
                                {subjectData.subjectName}
                              </span>
                              <Badge variant='outline' className='text-xs'>
                                {subjectData.average?.toFixed(1)}
                              </Badge>
                            </div>
                            <div className='flex items-center gap-1'>
                              {getRiskLevelIcon(subjectData.riskLevel ?? '')}
                              <span className='text-xs opacity-70'>
                                {subjectData.riskLevel ?? ''}
                              </span>
                            </div>
                          </div>
                          <p className='mb-2 text-xs opacity-80'>
                            &ldquo;{subjectData.comment}&rdquo;
                          </p>

                          {/* Grade Components */}
                          {/* <div className='space-y-1'>
                            {subjectData.components.map(
                              (component, index) => (
                                <div
                                  key={index}
                                  className='bg-muted/30 flex items-center justify-between rounded p-2 text-xs'
                                >
                                  <div className='flex items-center gap-2'>
                                    <span>
                                      {component.gradeComponentName}
                                    </span>
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      Hệ số {component.weight}
                                    </Badge>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-medium'>
                                      {component.average?.toFixed(1)}
                                    </span>
                                    <div className='flex items-center gap-1'>
                                      {getRiskLevelIcon(component.riskLevel ?? '')}
                                      <span className='text-xs opacity-70'>
                                        {component.riskLevel ?? ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 border-t border-current/20 pt-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-2 text-xs opacity-70'>
                      <Clock className='h-3 w-3 flex-shrink-0' />
                      <span className='truncate'>
                        Cập nhật lần cuối:{' '}
                        {format(new Date(), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <ChildDetailDialog
                      childId={studentAnalysis?.studentId}
                      classId={
                        apiChildrenFullInfo?.[0]?.classId ||
                        '33333333-3333-3333-3333-333333333333'
                      }
                      termId='33333333-3333-3333-3333-333333333333'
                      childData={apiChildrenFullInfo?.find(
                        (c) => c.studentId === studentAnalysis?.studentId
                      )}
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full text-xs sm:w-auto'
                      >
                        <Eye className='mr-1 h-3 w-3' />
                        Xem chi tiết
                      </Button>
                    </ChildDetailDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Children Overview */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                <Users className='h-4 w-4 sm:h-5 sm:w-5' />
                Tổng quan học tập các con
              </CardTitle>
              <TeacherCommunicationDialog>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex w-full items-center justify-center gap-2 sm:w-auto'
                >
                  <MessageSquare className='h-4 w-4' />
                  Liên hệ giáo viên
                </Button>
              </TeacherCommunicationDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:grid-cols-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
              {(apiChildrenFullInfo || []).map((child) => (
                <Card
                  key={child.studentId}
                  className='relative overflow-hidden'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex min-w-0 flex-1 items-center gap-3'>
                        <Avatar className='h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10'>
                          <AvatarFallback className='bg-blue-100 text-blue-600'>
                            {child.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <div className='truncate font-medium'>
                            {child.studentName}
                          </div>
                          <div className='text-muted-foreground truncate text-sm'>
                            {child.className || 'Lớp - N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Academic Performance */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Điểm trung bình
                        </span>
                        <div
                          className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-sm font-medium ${getGradeColor(
                            child.overallAverage ?? 0
                          )}`}
                        >
                          {child.overallAverage ?? 0}
                        </div>
                      </div>
                      <Progress
                        value={child.overallAverage ?? 0}
                        className='h-2'
                      />
                      <div className='text-muted-foreground flex items-center justify-between text-xs'>
                        <span>{(child.scores || []).length} điểm gần đây</span>
                      </div>
                    </div>

                    {/* Recent Scores Preview */}
                    <div className='space-y-2'>
                      <span className='text-sm font-medium'>
                        Điểm số gần đây
                      </span>
                      <div className='grid grid-cols-2 gap-1'>
                        {(child.scores || []).slice(-4).map((score, index) => (
                          <div
                            key={index}
                            className='bg-muted/30 flex items-center justify-between rounded p-1 text-xs'
                          >
                            <span className='truncate'>
                              {score.assessmentName || 'Bài kiểm tra'}
                            </span>
                            <div
                              className={`rounded px-1 py-0.5 text-xs font-medium ${getGradeColor(score.score1 || 0)}`}
                            >
                              {score.isAbsent
                                ? 'Vắng'
                                : (score.score1 || 0).toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                      {(child.scores || []).length > 4 && (
                        <div className='text-muted-foreground text-center text-xs'>
                          +{(child.scores || []).length - 4} điểm khác
                        </div>
                      )}
                    </div>

                    {/* Recent Activity */}
                    {child.behaviorNotes && child.behaviorNotes.length > 0 && (
                      <div className='space-y-2'>
                        <span className='text-sm font-medium'>
                          Ghi chú mới nhất
                        </span>
                        <div
                          className={`rounded-lg border p-3 text-xs ${
                            child.behaviorNotes[0].level === 'Excellent'
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300'
                              : child.behaviorNotes[0].level === 'Poor'
                                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300'
                                : child.behaviorNotes[0].level === 'Good'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300'
                                  : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300'
                          }`}
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <div className='flex items-center gap-1'>
                              {getBehaviorIcon(child.behaviorNotes[0].level)}
                              <span className='font-medium capitalize'>
                                {child.behaviorNotes[0].level}
                              </span>
                            </div>
                            <span className='text-xs opacity-70'>
                              {formatDistanceToNow(
                                new Date(child.behaviorNotes[0].createdAt),
                                {
                                  addSuffix: true,
                                  locale: vi
                                }
                              )}
                            </span>
                          </div>
                          <p className='mb-2 text-sm leading-relaxed'>
                            &ldquo;{child.behaviorNotes[0].note}&rdquo;
                          </p>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs opacity-70'>
                              {child.behaviorNotes[0].teacherName}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {format(
                                new Date(child.behaviorNotes[0].createdAt),
                                'dd/MM HH:mm'
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upcoming Assessments */}
                    {child.subjects &&
                      child.subjects.some((s) =>
                        s.components?.some((c) => c.assessments?.length > 0)
                      ) && (
                        <div className='space-y-2'>
                          <span className='text-sm font-medium'>
                            Bài kiểm tra sắp tới
                          </span>
                          <div className='space-y-1'>
                            {child.subjects
                              .flatMap(
                                (s) =>
                                  s.components?.flatMap(
                                    (c) => c.assessments || []
                                  ) || []
                              )
                              .slice(0, 2)
                              .map((assessment, index) => (
                                <div
                                  key={assessment.assessmentId || index}
                                  className='flex items-center justify-between text-xs'
                                >
                                  <span className='truncate'>
                                    {assessment.title}
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    {format(
                                      new Date(assessment.dueDate),
                                      'dd/MM'
                                    )}
                                  </Badge>
                                </div>
                              ))}
                            {child.subjects.flatMap(
                              (s) =>
                                s.components?.flatMap(
                                  (c) => c.assessments || []
                                ) || []
                            ).length > 2 && (
                              <div className='text-muted-foreground text-xs'>
                                +
                                {child.subjects.flatMap(
                                  (s) =>
                                    s.components?.flatMap(
                                      (c) => c.assessments || []
                                    ) || []
                                ).length - 2}{' '}
                                bài khác
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Action Button */}
                    <ChildDetailDialog
                      childId={child.studentId}
                      classId={child.classId}
                      termId='33333333-3333-3333-3333-333333333333'
                      childData={child}
                    >
                      <Button variant='outline' className='mt-4 w-full text-sm'>
                        <Eye className='mr-2 h-4 w-4' />
                        Xem chi tiết
                      </Button>
                    </ChildDetailDialog>
                  </CardContent>
                </Card>
              ))}

              {(!apiChildrenFullInfo || apiChildrenFullInfo.length === 0) &&
                children.map((child) => (
                  <Card
                    key={child.student.id}
                    className='relative overflow-hidden'
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex min-w-0 flex-1 items-center gap-3'>
                          <Avatar className='h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10'>
                            <AvatarFallback className='bg-blue-100 text-blue-600'>
                              {child.student.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0 flex-1'>
                            <div className='truncate font-medium'>
                              {child.student.full_name}
                            </div>
                            <div className='text-muted-foreground truncate text-sm'>
                              {child.current_class.name} -{' '}
                              {child.current_class.grade?.level}
                            </div>
                          </div>
                        </div>
                        {child.latest_behavior_note?.level === 'Poor' && (
                          <Badge
                            variant='destructive'
                            className='flex-shrink-0 animate-pulse'
                          >
                            Cảnh báo
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Academic Performance */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Điểm trung bình
                          </span>
                          <div
                            className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-sm font-medium ${getGradeColor(child.overall_average)}`}
                          >
                            {child.overall_average.toFixed(1)}
                          </div>
                        </div>
                        <Progress
                          value={(child.overall_average / 10) * 100}
                          className='h-2'
                        />
                        <div className='text-muted-foreground flex items-center justify-between text-xs'>
                          {child.class_rank && (
                            <span>Xếp hạng lớp: #{child.class_rank}</span>
                          )}
                          <span>{child.recent_scores.length} điểm gần đây</span>
                        </div>
                      </div>

                      {/* Recent Scores Preview */}
                      <div className='space-y-2'>
                        <span className='text-sm font-medium'>
                          Điểm số gần đây
                        </span>
                        <div className='grid grid-cols-2 gap-1'>
                          {child.recent_scores
                            .slice(0, 4)
                            .map((score, index) => (
                              <div
                                key={index}
                                className='bg-muted/30 flex items-center justify-between rounded p-1 text-xs'
                              >
                                <span className='truncate'>
                                  {score.assessment?.title || 'Bài kiểm tra'}
                                </span>
                                <div
                                  className={`rounded px-1 py-0.5 text-xs font-medium ${getGradeColor(score.score)}`}
                                >
                                  {score.is_absent
                                    ? 'Vắng'
                                    : score.score.toFixed(1)}
                                </div>
                              </div>
                            ))}
                        </div>
                        {child.recent_scores.length > 4 && (
                          <div className='text-muted-foreground text-center text-xs'>
                            +{child.recent_scores.length - 4} điểm khác
                          </div>
                        )}
                      </div>

                      {/* Behavior Summary */}
                      <div className='space-y-2'>
                        <span className='text-sm font-medium'>Hạnh kiểm</span>
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-1'>
                            {getBehaviorIcon('Excellent')}
                            <span className='text-xs'>
                              {child.behavior_summary.excellent_count}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            {getBehaviorIcon('Good')}
                            <span className='text-xs'>
                              {child.behavior_summary.good_count}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            {getBehaviorIcon('Needs improvement')}
                            <span className='text-xs'>
                              {child.behavior_summary.needs_improvement_count}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            {getBehaviorIcon('Poor')}
                            <span className='text-xs'>
                              {child.behavior_summary.poor_count}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      {child.latest_behavior_note && (
                        <div className='space-y-2'>
                          <span className='text-sm font-medium'>
                            Ghi chú mới nhất
                          </span>
                          <div
                            className={`rounded-lg border p-3 text-xs ${
                              child.latest_behavior_note.level === 'Excellent'
                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300'
                                : child.latest_behavior_note.level === 'Poor'
                                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300'
                                  : child.latest_behavior_note.level === 'Good'
                                    ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300'
                                    : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300'
                            }`}
                          >
                            <div className='mb-2 flex items-center justify-between'>
                              <div className='flex items-center gap-1'>
                                {getBehaviorIcon(
                                  child.latest_behavior_note.level
                                )}
                                <span className='font-medium capitalize'>
                                  {child.latest_behavior_note.level ===
                                  'Excellent'
                                    ? 'Xuất sắc'
                                    : child.latest_behavior_note.level ===
                                        'Good'
                                      ? 'Tốt'
                                      : child.latest_behavior_note.level ===
                                          'Needs improvement'
                                        ? 'Cần cải thiện'
                                        : 'Yếu'}
                                </span>
                              </div>
                              <span className='text-xs opacity-70'>
                                {formatDistanceToNow(
                                  new Date(
                                    child.latest_behavior_note.created_at
                                  ),
                                  {
                                    addSuffix: true,
                                    locale: vi
                                  }
                                )}
                              </span>
                            </div>
                            <p className='mb-2 text-sm leading-relaxed'>
                              &ldquo;{child.latest_behavior_note.note}&rdquo;
                            </p>
                            <div className='flex items-center justify-between'>
                              <span className='text-xs opacity-70'>
                                {
                                  child.latest_behavior_note.created_by_user
                                    ?.full_name
                                }
                              </span>
                              <Badge variant='outline' className='text-xs'>
                                {format(
                                  new Date(
                                    child.latest_behavior_note.created_at
                                  ),
                                  'dd/MM HH:mm'
                                )}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upcoming Assessments */}
                      {child.upcoming_assessments.length > 0 && (
                        <div className='space-y-2'>
                          <span className='text-sm font-medium'>
                            Bài kiểm tra sắp tới
                          </span>
                          <div className='space-y-1'>
                            {child.upcoming_assessments
                              .slice(0, 2)
                              .map((assessment) => (
                                <div
                                  key={assessment.id}
                                  className='flex items-center justify-between text-xs'
                                >
                                  <span className='truncate'>
                                    {assessment.title}
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    {format(
                                      new Date(assessment.due_date),
                                      'dd/MM'
                                    )}
                                  </Badge>
                                </div>
                              ))}
                            {child.upcoming_assessments.length > 2 && (
                              <div className='text-muted-foreground text-xs'>
                                +{child.upcoming_assessments.length - 2} bài
                                khác
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <ChildDetailDialog
                        childId={child.student.id}
                        classId={
                          apiChildrenFullInfo?.[0]?.classId ||
                          '33333333-3333-3333-3333-333333333333'
                        }
                        termId='33333333-3333-3333-3333-333333333333'
                        childData={apiChildrenFullInfo?.find(
                          (c) => c.studentId === child.student.id
                        )}
                      >
                        <Button
                          variant='outline'
                          className='mt-4 w-full text-sm'
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Xem chi tiết
                        </Button>
                      </ChildDetailDialog>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
              <Bell className='h-4 w-4 sm:h-5 sm:w-5' />
              Thông báo gần đây
              {apiLoading && (
                <Badge variant='secondary' className='text-xs'>
                  Đang tải...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3 sm:space-y-4'>
              {apiLoading ? (
                <div className='text-muted-foreground py-6 text-center sm:py-8'>
                  <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 sm:h-12 sm:w-12'></div>
                  <p className='text-sm'>Đang tải thông báo...</p>
                </div>
              ) : recent_announcements.length > 0 ? (
                recent_announcements.slice(0, 5).map((announcement) => (
                  <div
                    key={announcement.id}
                    className='hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors sm:gap-4 sm:p-4'
                  >
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        announcement.is_urgent
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <Bell className='h-4 w-4' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                        <h4 className='truncate text-sm font-medium sm:text-base'>
                          {announcement.title}
                        </h4>
                        {announcement.is_urgent && (
                          <Badge
                            variant='destructive'
                            className='w-fit text-xs'
                          >
                            Khẩn cấp
                          </Badge>
                        )}
                      </div>
                      <p className='text-muted-foreground mb-2 line-clamp-2 text-sm'>
                        {announcement.content}
                      </p>
                      <div className='text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4'>
                        <div className='flex items-center gap-1'>
                          <User className='h-3 w-3 flex-shrink-0' />
                          <span className='truncate'>
                            {announcement.sender?.full_name}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3 flex-shrink-0' />
                          <span className='truncate'>
                            {format(
                              new Date(announcement.created_at),
                              'dd/MM/yyyy HH:mm'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-muted-foreground py-6 text-center sm:py-8'>
                  <Bell className='mx-auto mb-4 h-10 w-10 opacity-50 sm:h-12 sm:w-12' />
                  <p className='text-sm'>Chưa có thông báo nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
