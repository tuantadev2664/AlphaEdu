'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { StudentDashboard } from '@/features/student/types';
import {
  SubjectScoreDetailsDialog,
  BehaviorNotesDetailsDialog
} from '@/features/student/components/dialogs';
import {
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
  AlertCircle
} from 'lucide-react';
import { format, isAfter, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentDashboardViewProps {
  data: StudentDashboard;
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

export function StudentDashboardView({ data }: StudentDashboardViewProps) {
  const {
    student,
    current_class,
    current_term,
    recent_scores,
    recent_announcements,
    behavior_summary,
    upcoming_assessments,
    latest_behavior_note
  } = data;

  // Calculate average score (0-10 system)
  const validScores = recent_scores.filter((s) => !s.is_absent);
  const averageScore =
    validScores.length > 0
      ? validScores.reduce((sum, score) => sum + score.score, 0) /
        validScores.length
      : 0;

  // Group scores by subject for dialog
  const scoresBySubject = recent_scores.reduce(
    (acc, score) => {
      const subject = score.assessment?.grade_component?.subject;
      if (subject) {
        if (!acc[subject.id]) {
          acc[subject.id] = {
            subject,
            scores: [],
            gradeComponents: []
          };
        }
        acc[subject.id].scores.push(score);

        // Add grade component if not already added
        const gradeComponent = score.assessment?.grade_component;
        if (
          gradeComponent &&
          !acc[subject.id].gradeComponents.find(
            (gc) => gc.id === gradeComponent.id
          )
        ) {
          acc[subject.id].gradeComponents.push(gradeComponent);
        }
      }
      return acc;
    },
    {} as Record<
      string,
      { subject: any; scores: any[]; gradeComponents: any[] }
    >
  );

  // Calculate subject averages and letter grades (0-10 system)
  const subjectSummaries = Object.values(scoresBySubject).map(
    ({ subject, scores, gradeComponents }) => {
      const validSubjectScores = scores.filter((s) => !s.is_absent);
      const subjectAverage =
        validSubjectScores.length > 0
          ? validSubjectScores.reduce((sum, score) => sum + score.score, 0) /
            validSubjectScores.length
          : 0;

      const letterGrade =
        subjectAverage >= 9.0
          ? 'A'
          : subjectAverage >= 8.0
            ? 'B'
            : subjectAverage >= 6.5
              ? 'C'
              : subjectAverage >= 5.0
                ? 'D'
                : 'F';

      return {
        subject,
        scores,
        gradeComponents,
        averageScore: subjectAverage,
        letterGrade
      };
    }
  );

  // Get active announcements
  const activeAnnouncements = recent_announcements.filter((a) =>
    isAfter(new Date(a.expires_at), new Date())
  );

  // Calculate behavior score
  const totalBehaviorNotes = Object.values(behavior_summary).reduce(
    (sum, count) => sum + count,
    0
  );
  const behaviorScore =
    totalBehaviorNotes > 0
      ? Math.round(
          ((behavior_summary.excellent_count * 5 +
            behavior_summary.good_count * 4 +
            behavior_summary.fair_count * 3 +
            behavior_summary.needs_improvement_count * 2 +
            behavior_summary.poor_count * 1) /
            totalBehaviorNotes) *
            20
        )
      : 100;

  return (
    <div className='space-y-6'>
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarFallback className='text-lg'>
                {student.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <h3 className='text-xl font-semibold'>{student.full_name}</h3>
              <p className='text-muted-foreground'>
                Class: {current_class.name}
              </p>
              <p className='text-muted-foreground text-sm'>
                Current Term: {current_term.code} (
                {format(new Date(current_term.start_date), 'MMM dd')} -{' '}
                {format(new Date(current_term.end_date), 'MMM dd, yyyy')})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Overview */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Score</CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageScore.toFixed(1)}</div>
            <Progress value={(averageScore / 10) * 100} className='mt-2' />
            <p className='text-muted-foreground mt-2 text-xs'>
              Dựa trên {validScores.length} bài kiểm tra gần đây
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Behavior Score
            </CardTitle>
            <Award className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{behaviorScore}%</div>
            <Progress value={behaviorScore} className='mt-2' />
            <p className='text-muted-foreground mt-2 text-xs'>
              Based on {totalBehaviorNotes} behavior notes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Scores Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {subjectSummaries.map((summary) => (
              <div
                key={summary.subject.id}
                className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
              >
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <div className='text-lg font-medium'>
                      {summary.subject.name}
                    </div>
                    <Badge variant='outline'>{summary.letterGrade}</Badge>
                  </div>
                  <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                    <span>Trung bình: {summary.averageScore.toFixed(1)}</span>
                    <span>•</span>
                    <span>
                      {summary.scores.filter((s) => !s.is_absent).length} bài
                      kiểm tra
                    </span>
                  </div>
                  <Progress
                    value={(summary.averageScore / 10) * 100}
                    className='mt-2 h-2'
                  />
                </div>
                <div className='ml-4'>
                  <SubjectScoreDetailsDialog
                    subject={summary.subject}
                    scores={summary.scores}
                    gradeComponents={summary.gradeComponents}
                    averageScore={summary.averageScore}
                    letterGrade={summary.letterGrade}
                  >
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      <Eye className='h-4 w-4' />
                      View Details
                    </Button>
                  </SubjectScoreDetailsDialog>
                </div>
              </div>
            ))}
            {subjectSummaries.length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                No subject scores available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Behavior Summary */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Award className='h-5 w-5' />
            Behavior Summary
          </CardTitle>
          <BehaviorNotesDetailsDialog
            studentName={student.full_name}
            behaviorSummary={behavior_summary}
          >
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              <Eye className='h-4 w-4' />
              View Details
            </Button>
          </BehaviorNotesDetailsDialog>
        </CardHeader>
        <CardContent>
          {/* Latest Behavior Alert - Enhanced Early Warning System */}
          {latest_behavior_note && (
            <div
              className={`mb-6 rounded-xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                latest_behavior_note.level === 'excellent'
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-950/30 dark:to-emerald-950/30'
                  : latest_behavior_note.level === 'poor'
                    ? 'animate-pulse border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-950/30 dark:to-rose-950/30'
                    : 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-orange-800 dark:from-orange-950/30 dark:to-amber-950/30'
              }`}
            >
              <div className='flex items-start gap-4'>
                <div
                  className={`flex-shrink-0 rounded-full p-2 ${
                    latest_behavior_note.level === 'excellent'
                      ? 'bg-green-100 dark:bg-green-900/50'
                      : latest_behavior_note.level === 'poor'
                        ? 'bg-red-100 dark:bg-red-900/50'
                        : 'bg-orange-100 dark:bg-orange-900/50'
                  }`}
                >
                  {latest_behavior_note.level === 'excellent' ? (
                    <Star className='h-5 w-5 text-green-600 dark:text-green-400' />
                  ) : latest_behavior_note.level === 'poor' ? (
                    <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
                  ) : (
                    <AlertTriangle className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                  )}
                </div>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-base font-semibold ${
                          latest_behavior_note.level === 'excellent'
                            ? 'text-green-800 dark:text-green-200'
                            : latest_behavior_note.level === 'poor'
                              ? 'text-red-800 dark:text-red-200'
                              : 'text-orange-800 dark:text-orange-200'
                        }`}
                      >
                        {latest_behavior_note.level === 'excellent'
                          ? '🌟 Khen ngợi mới nhất'
                          : latest_behavior_note.level === 'poor'
                            ? '🚨 Cảnh báo hành vi'
                            : '⚠️ Cần chú ý'}
                      </span>
                      {latest_behavior_note.level === 'poor' && (
                        <Badge
                          variant='destructive'
                          className='animate-bounce text-xs'
                        >
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className={`text-xs ${
                          latest_behavior_note.level === 'excellent'
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : latest_behavior_note.level === 'poor'
                              ? 'border-red-300 bg-red-50 text-red-700'
                              : 'border-orange-300 bg-orange-50 text-orange-700'
                        }`}
                      >
                        {formatDistanceToNow(
                          new Date(latest_behavior_note.created_at),
                          {
                            addSuffix: true,
                            locale: vi
                          }
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className={`mb-3 rounded-lg p-3 ${
                      latest_behavior_note.level === 'excellent'
                        ? 'border border-green-200/50 bg-white/70 dark:bg-green-900/20'
                        : latest_behavior_note.level === 'poor'
                          ? 'border border-red-200/50 bg-white/70 dark:bg-red-900/20'
                          : 'border border-orange-200/50 bg-white/70 dark:bg-orange-900/20'
                    }`}
                  >
                    <p
                      className={`text-sm leading-relaxed font-medium ${
                        latest_behavior_note.level === 'excellent'
                          ? 'text-green-800 dark:text-green-200'
                          : latest_behavior_note.level === 'poor'
                            ? 'text-red-800 dark:text-red-200'
                            : 'text-orange-800 dark:text-orange-200'
                      }`}
                    >
                      &rdquo;{latest_behavior_note.note}&rdquo;
                    </p>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <User className='text-muted-foreground h-3 w-3' />
                      <span
                        className={`text-xs font-medium ${
                          latest_behavior_note.level === 'excellent'
                            ? 'text-green-600 dark:text-green-400'
                            : latest_behavior_note.level === 'poor'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-orange-600 dark:text-orange-400'
                        }`}
                      >
                        {latest_behavior_note.created_by_user?.full_name}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='text-muted-foreground h-3 w-3' />
                      <span className='text-muted-foreground text-xs'>
                        {format(
                          new Date(latest_behavior_note.created_at),
                          'dd/MM/yyyy HH:mm'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action suggestions for poor behavior */}
              {latest_behavior_note.level === 'poor' && (
                <div className='mt-4 rounded-lg border border-red-200/50 bg-red-100/50 p-3 dark:bg-red-900/20'>
                  <div className='mb-2 flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 text-red-600' />
                    <span className='text-sm font-medium text-red-800 dark:text-red-200'>
                      Khuyến nghị hành động
                    </span>
                  </div>
                  <ul className='ml-6 space-y-1 text-xs text-red-700 dark:text-red-300'>
                    <li>• Trao đổi với giáo viên để hiểu rõ vấn đề</li>
                    <li>• Thảo luận với phụ huynh về kế hoạch cải thiện</li>
                    <li>• Theo dõi sát sao trong thời gian tới</li>
                  </ul>
                </div>
              )}

              {/* Encouragement for excellent behavior */}
              {latest_behavior_note.level === 'excellent' && (
                <div className='mt-4 rounded-lg border border-green-200/50 bg-green-100/50 p-3 dark:bg-green-900/20'>
                  <div className='flex items-center gap-2'>
                    <Star className='h-4 w-4 text-green-600' />
                    <span className='text-sm font-medium text-green-800 dark:text-green-200'>
                      Tiếp tục phát huy! Hành vi tích cực này đáng được ghi nhận
                      và duy trì.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Behavior Summary Grid */}
          <div className='grid gap-4 md:grid-cols-5'>
            {Object.entries(behavior_summary).map(([level, count]) => {
              const levelName = level.replace('_count', '').replace('_', ' ');
              const displayName =
                levelName.charAt(0).toUpperCase() + levelName.slice(1);

              return (
                <div key={level} className='rounded-lg border p-3 text-center'>
                  <div className='mb-2 flex items-center justify-center'>
                    {getBehaviorIcon(level.replace('_count', ''))}
                  </div>
                  <div className='text-2xl font-bold'>{count}</div>
                  <div className='text-muted-foreground text-xs'>
                    {displayName}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {activeAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className='rounded-lg border p-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='font-medium'>{announcement.title}</div>
                    <div className='text-muted-foreground mt-1 text-sm'>
                      {announcement.content.substring(0, 100)}...
                    </div>
                    <div className='text-muted-foreground mt-2 text-xs'>
                      {format(
                        new Date(announcement.created_at),
                        'MMM dd, yyyy'
                      )}
                    </div>
                  </div>
                  {announcement.is_urgent && (
                    <Badge variant='destructive' className='ml-2'>
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {activeAnnouncements.length === 0 && (
              <p className='text-muted-foreground py-4 text-center'>
                No active announcements
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
