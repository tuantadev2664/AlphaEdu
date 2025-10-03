'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ParentDashboard } from '@/features/parent/types';
import {
  ChildDetailDialog,
  TeacherCommunicationDialog
} from '@/features/parent/components/dialogs';
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Bell,
  Award,
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
  MessageSquare,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ParentDashboardViewProps {
  data: ParentDashboard;
}

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

export function ParentDashboardView({ data }: ParentDashboardViewProps) {
  const { parent, children, recent_announcements, unread_messages_count } =
    data;
  const [selectedChild, setSelectedChild] = useState<string>(
    children[0]?.student.id || ''
  );

  // Calculate overall family performance
  const familyAverage =
    children.length > 0
      ? children.reduce((sum, child) => sum + child.overall_average, 0) /
        children.length
      : 0;

  const totalBehaviorIssues = children.reduce(
    (sum, child) =>
      sum +
      child.behavior_summary.needs_improvement_count +
      child.behavior_summary.poor_count,
    0
  );

  const urgentAlerts = children.filter(
    (child) =>
      child.latest_behavior_note?.level === 'poor' ||
      child.overall_average < 5.0
  );

  // Mock academic alerts data - would come from API
  const academicAlerts = [
    {
      id: 'alert-1',
      studentId: 'e6f4ed8e-a84e-48e2-9693-f0d1b36a04f7',
      fullName: 'Trần Thị B',
      average: 8.5,
      belowCount: 0,
      riskLevel: 'Thấp',
      comment: 'Kết quả ổn định.',
      subjects: {
        Toán: {
          average: 8.5,
          assignmentsCount: 1,
          belowThresholdCount: 0,
          riskLevel: 'Thấp',
          comment: 'Ổn định.',
          components: [
            {
              gradeComponentId: 'cf47a46f-8db2-48bf-ad68-447eeccf003a',
              gradeComponentName: 'KT 15 phút',
              kind: 'quiz',
              weight: 1,
              maxScore: 10,
              average: 8.5,
              count: 1,
              belowThresholdCount: 0,
              riskLevel: 'Thấp',
              comment: 'Ổn định.'
            }
          ]
        }
      },
      summary:
        'Học sinh Trần Thị B có trung bình 8.50 trong học kỳ này, 0 môn dưới chuẩn, mức rủi ro Thấp.'
    }
  ];

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
      case 'Thấp':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'Trung bình':
        return <AlertTriangle className='h-4 w-4 text-yellow-600' />;
      case 'Cao':
        return <AlertCircle className='h-4 w-4 text-orange-600' />;
      case 'Rất cao':
        return <XCircle className='h-4 w-4 text-red-600' />;
      default:
        return <Minus className='h-4 w-4 text-gray-600' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Family Overview Header */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng số con</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{children.length}</div>
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
          <CardContent>
            <div className='text-2xl font-bold'>{familyAverage.toFixed(1)}</div>
            <div className='flex items-center gap-1'>
              {getPerformanceIcon(familyAverage)}
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
          <CardContent>
            <div className='text-2xl font-bold'>{unread_messages_count}</div>
            <p className='text-muted-foreground text-xs'>Từ giáo viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Cảnh báo</CardTitle>
            <AlertTriangle className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {urgentAlerts.length + academicAlerts.length}
            </div>
            <p className='text-muted-foreground text-xs'>
              {urgentAlerts.length > 0 && academicAlerts.length > 0
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
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-red-800 dark:text-red-200'>
              <AlertCircle className='h-5 w-5' />
              Cảnh báo hành vi khẩn cấp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {urgentAlerts.map((child) => (
                <div
                  key={child.student.id}
                  className='flex items-center justify-between rounded-lg border border-red-200 bg-white p-3 dark:border-red-800 dark:bg-red-900/10'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-red-100 text-red-600'>
                        {child.student.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium text-red-800 dark:text-red-200'>
                        {child.student.full_name}
                      </div>
                      <div className='text-sm text-red-600 dark:text-red-400'>
                        {child.overall_average < 5.0 &&
                          `Điểm TB: ${child.overall_average.toFixed(1)} (Yếu)`}
                        {child.latest_behavior_note?.level === 'poor' &&
                          'Hành vi cần cải thiện'}
                      </div>
                    </div>
                  </div>
                  <ChildDetailDialog childId={child.student.id}>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-red-200 text-red-600 hover:bg-red-50'
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
      {academicAlerts.length > 0 && (
        <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-blue-800 dark:text-blue-200'>
              <TrendingUp className='h-5 w-5' />
              Cảnh báo học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {academicAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-4 ${getRiskLevelColor(alert.riskLevel)}`}
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-blue-100 text-blue-600'>
                          {alert.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='text-lg font-medium'>
                          {alert.fullName}
                        </div>
                        <div className='text-sm opacity-80'>
                          Điểm TB: {alert.average.toFixed(1)} •{' '}
                          {alert.belowCount} môn dưới chuẩn
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getRiskLevelIcon(alert.riskLevel)}
                      <Badge
                        variant='outline'
                        className={`text-xs ${getRiskLevelColor(alert.riskLevel)}`}
                      >
                        {alert.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className='mb-3'>
                    <p className='mb-2 text-sm font-medium'>Tóm tắt:</p>
                    <p className='text-sm opacity-90'>
                      &ldquo;{alert.summary}&rdquo;
                    </p>
                  </div>

                  <div className='mb-3'>
                    <p className='mb-2 text-sm font-medium'>Nhận xét chung:</p>
                    <p className='text-sm opacity-90'>
                      &ldquo;{alert.comment}&rdquo;
                    </p>
                  </div>

                  {/* Subject Details */}
                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Chi tiết theo môn:</p>
                    <div className='space-y-2'>
                      {Object.entries(alert.subjects).map(
                        ([subjectName, subjectData]) => (
                          <div
                            key={subjectName}
                            className='rounded border bg-white/50 p-3 dark:bg-black/20'
                          >
                            <div className='mb-2 flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <BookOpen className='h-4 w-4' />
                                <span className='font-medium'>
                                  {subjectName}
                                </span>
                                <Badge variant='outline' className='text-xs'>
                                  {subjectData.average.toFixed(1)}
                                </Badge>
                              </div>
                              <div className='flex items-center gap-1'>
                                {getRiskLevelIcon(subjectData.riskLevel)}
                                <span className='text-xs opacity-70'>
                                  {subjectData.riskLevel}
                                </span>
                              </div>
                            </div>
                            <p className='mb-2 text-xs opacity-80'>
                              &ldquo;{subjectData.comment}&rdquo;
                            </p>

                            {/* Grade Components */}
                            <div className='space-y-1'>
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
                                        {component.average.toFixed(1)}
                                      </span>
                                      <div className='flex items-center gap-1'>
                                        {getRiskLevelIcon(component.riskLevel)}
                                        <span className='text-xs opacity-70'>
                                          {component.riskLevel}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className='flex items-center justify-between border-t border-current/20 pt-3'>
                    <div className='flex items-center gap-2 text-xs opacity-70'>
                      <Clock className='h-3 w-3' />
                      <span>
                        Cập nhật lần cuối:{' '}
                        {format(new Date(), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <ChildDetailDialog childId={alert.studentId}>
                      <Button variant='outline' size='sm' className='text-xs'>
                        <Eye className='mr-1 h-3 w-3' />
                        Xem chi tiết
                      </Button>
                    </ChildDetailDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Tổng quan học tập các con
            </CardTitle>
            <TeacherCommunicationDialog>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <MessageSquare className='h-4 w-4' />
                Liên hệ giáo viên
              </Button>
            </TeacherCommunicationDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
            {children.map((child) => (
              <Card key={child.student.id} className='relative overflow-hidden'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-blue-100 text-blue-600'>
                          {child.student.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>
                          {child.student.full_name}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {child.current_class.name} -{' '}
                          {child.current_class.grade?.level}
                        </div>
                      </div>
                    </div>
                    {child.latest_behavior_note?.level === 'poor' && (
                      <Badge variant='destructive' className='animate-pulse'>
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
                    <span className='text-sm font-medium'>Điểm số gần đây</span>
                    <div className='grid grid-cols-2 gap-1'>
                      {child.recent_scores.slice(0, 4).map((score, index) => (
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
                            {score.is_absent ? 'Vắng' : score.score.toFixed(1)}
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
                        {getBehaviorIcon('excellent')}
                        <span className='text-xs'>
                          {child.behavior_summary.excellent_count}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getBehaviorIcon('good')}
                        <span className='text-xs'>
                          {child.behavior_summary.good_count}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getBehaviorIcon('needs_improvement')}
                        <span className='text-xs'>
                          {child.behavior_summary.needs_improvement_count}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getBehaviorIcon('poor')}
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
                          child.latest_behavior_note.level === 'excellent'
                            ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300'
                            : child.latest_behavior_note.level === 'poor'
                              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300'
                              : child.latest_behavior_note.level === 'good'
                                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300'
                                : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300'
                        }`}
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            {getBehaviorIcon(child.latest_behavior_note.level)}
                            <span className='font-medium capitalize'>
                              {child.latest_behavior_note.level === 'excellent'
                                ? 'Xuất sắc'
                                : child.latest_behavior_note.level === 'good'
                                  ? 'Tốt'
                                  : child.latest_behavior_note.level ===
                                      'needs_improvement'
                                    ? 'Cần cải thiện'
                                    : 'Yếu'}
                            </span>
                          </div>
                          <span className='text-xs opacity-70'>
                            {formatDistanceToNow(
                              new Date(child.latest_behavior_note.created_at),
                              {
                                addSuffix: true,
                                locale: vi
                              }
                            )}
                          </span>
                        </div>
                        <p className='mb-2 line-clamp-3 leading-relaxed'>
                          &rdquo;{child.latest_behavior_note.note}&rdquo;
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
                              new Date(child.latest_behavior_note.created_at),
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
                                {format(new Date(assessment.due_date), 'dd/MM')}
                              </Badge>
                            </div>
                          ))}
                        {child.upcoming_assessments.length > 2 && (
                          <div className='text-muted-foreground text-xs'>
                            +{child.upcoming_assessments.length - 2} bài khác
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <ChildDetailDialog childId={child.student.id}>
                    <Button variant='outline' className='mt-4 w-full'>
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
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            Thông báo gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recent_announcements.length > 0 ? (
              recent_announcements.slice(0, 5).map((announcement) => (
                <div
                  key={announcement.id}
                  className='hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-4 transition-colors'
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
                    <div className='mb-1 flex items-center gap-2'>
                      <h4 className='truncate font-medium'>
                        {announcement.title}
                      </h4>
                      {announcement.is_urgent && (
                        <Badge variant='destructive' className='text-xs'>
                          Khẩn cấp
                        </Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground mb-2 line-clamp-2 text-sm'>
                      {announcement.content}
                    </p>
                    <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                      <div className='flex items-center gap-1'>
                        <User className='h-3 w-3' />
                        <span>{announcement.sender?.full_name}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span>
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
              <div className='text-muted-foreground py-8 text-center'>
                <Bell className='mx-auto mb-4 h-12 w-12 opacity-50' />
                <p>Chưa có thông báo nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
