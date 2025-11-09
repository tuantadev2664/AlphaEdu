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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  Subject,
  Score,
  GradeComponent,
  Assessment
} from '@/features/student/types';
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  BarChart3,
  Target,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';

interface SubjectScoreDetailsDialogProps {
  subject: Subject;
  scores: Score[];
  gradeComponents: GradeComponent[];
  averageScore: number;
  letterGrade: string;
  children: React.ReactNode;
}

// Mock additional data that would come from API
const mockClassStats = {
  classAverage: 7.8,
  highestScore: 9.8,
  lowestScore: 5.5,
  totalStudents: 30,
  studentRank: 8
};

export function SubjectScoreDetailsDialog({
  subject,
  scores,
  gradeComponents,
  averageScore,
  letterGrade,
  children
}: SubjectScoreDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string>('all');

  const getGradeColor = (score: number) => {
    if (score >= 9.0) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 8.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 6.5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTypeIcon = (kind: string) => {
    switch (kind) {
      case 'quiz':
        return <BookOpen className='h-3 w-3' />;
      case 'test':
        return <GraduationCap className='h-3 w-3' />;
      case 'midterm':
        return <Award className='h-3 w-3' />;
      case 'final':
        return <Target className='h-3 w-3' />;
      case 'project':
        return <Target className='h-3 w-3' />;
      case 'oral':
        return <MessageSquare className='h-3 w-3' />;
      default:
        return <BookOpen className='h-3 w-3' />;
    }
  };

  const getPerformanceIcon = (studentScore: number, classAverage: number) => {
    if (studentScore > classAverage + 0.5)
      return <TrendingUp className='h-4 w-4 text-green-500' />;
    if (studentScore < classAverage - 0.5)
      return <TrendingDown className='h-4 w-4 text-red-500' />;
    return <Minus className='h-4 w-4 text-yellow-500' />;
  };

  // Group scores by grade component
  const scoresByComponent = gradeComponents.map((component) => {
    const componentScores = scores.filter(
      (score) => score.assessment?.grade_component?.id === component.id
    );
    const componentAverage =
      componentScores.length > 0
        ? componentScores.reduce(
            (sum, score) => sum + (score.is_absent ? 0 : score.score),
            0
          ) / componentScores.filter((s) => !s.is_absent).length
        : 0;

    return {
      component,
      scores: componentScores,
      average: Math.round(componentAverage)
    };
  });

  const filteredScores =
    selectedComponent === 'all'
      ? scores
      : scores.filter((score) => {
          const component = gradeComponents.find(
            (gc) => gc.id === score.assessment?.grade_component?.id
          );
          return component?.kind === selectedComponent;
        });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='top-[50%] left-[50%] z-50 max-h-[95vh] max-w-[95vw] translate-x-[-50%] translate-y-[-50%] overflow-y-auto px-2 sm:max-w-[1400px] sm:px-6'>
        <DialogHeader className='pb-3'>
          <DialogTitle className='flex items-center gap-2 text-sm sm:text-base'>
            <GraduationCap className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='truncate'>{subject.name} - Score Details</span>
          </DialogTitle>
          <DialogDescription className='text-xs sm:text-sm'>
            Detailed breakdown of your performance in {subject.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Overall Performance Summary */}
          <div className='grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='pt-3 sm:pt-6'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600 sm:text-3xl'>
                    {averageScore.toFixed(1)}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Điểm trung bình
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-3 sm:pt-6'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-green-600 sm:text-3xl'>
                    {letterGrade}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Xếp loại
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-3 sm:pt-6'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-purple-600 sm:text-3xl'>
                    {mockClassStats.studentRank}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Xếp hạng lớp
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-3 sm:pt-6'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-orange-600 sm:text-3xl'>
                    {mockClassStats.classAverage.toFixed(1)}
                  </div>
                  <div className='text-muted-foreground text-xs sm:text-sm'>
                    Điểm TB lớp
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                <BarChart3 className='h-4 w-4 sm:h-5 sm:w-5' />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 sm:space-y-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <span className='text-xs font-medium sm:text-sm'>
                    Your Performance vs Class
                  </span>
                  <div className='flex items-center gap-2'>
                    {getPerformanceIcon(
                      averageScore,
                      mockClassStats.classAverage
                    )}
                    <span className='text-xs sm:text-sm'>
                      {averageScore > mockClassStats.classAverage
                        ? 'Above'
                        : averageScore < mockClassStats.classAverage
                          ? 'Below'
                          : 'At'}{' '}
                      Class Average
                    </span>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='flex flex-col gap-1 text-xs sm:flex-row sm:justify-between sm:text-sm'>
                    <span>Điểm của bạn: {averageScore.toFixed(1)}</span>
                    <span>
                      Điểm TB lớp: {mockClassStats.classAverage.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={(averageScore / 10) * 100} className='h-2' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Matrix Table */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                <Award className='h-4 w-4 sm:h-5 sm:w-5' />
                Bảng điểm chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-w-[350px] overflow-x-auto sm:max-w-full'>
                <div className='max-h-80 overflow-y-auto sm:max-h-96'>
                  <table className='w-full border-collapse text-xs sm:text-sm'>
                    <thead className='bg-background sticky top-0'>
                      <tr className='border-b'>
                        <th className='p-2 text-left font-medium sm:p-3'>
                          Tên bài kiểm tra
                        </th>
                        <th className='p-2 text-center font-medium sm:p-3'>
                          Loại
                        </th>
                        <th className='p-2 text-center font-medium sm:p-3'>
                          Hệ số
                        </th>
                        <th className='p-2 text-center font-medium sm:p-3'>
                          Điểm
                        </th>
                        <th className='p-2 text-left font-medium sm:p-3'>
                          Nhận xét
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                        .map((score) => (
                          <tr
                            key={score.id}
                            className='hover:bg-muted/50 border-b transition-colors'
                          >
                            <td className='p-2 sm:p-3'>
                              <div className='flex items-center gap-2'>
                                <div className='flex-shrink-0 rounded-full bg-gray-100 p-1 sm:p-1.5 dark:bg-gray-800'>
                                  {getTypeIcon(
                                    score.assessment?.grade_component?.kind ||
                                      'quiz'
                                  )}
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <div className='truncate text-xs font-medium sm:text-sm'>
                                    {score.assessment?.title}
                                  </div>
                                  <div className='text-muted-foreground text-xs'>
                                    {format(
                                      new Date(score.created_at),
                                      'dd/MM/yyyy'
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='p-2 text-center sm:p-3'>
                              <Badge variant='outline' className='text-xs'>
                                {score.assessment?.grade_component?.name}
                              </Badge>
                            </td>
                            <td className='p-2 text-center sm:p-3'>
                              <span className='text-xs font-medium sm:text-sm'>
                                {score.assessment?.grade_component?.weight?.toFixed(
                                  1
                                )}
                              </span>
                            </td>
                            <td className='p-2 text-center sm:p-3'>
                              {score.is_absent ? (
                                <Badge
                                  variant='destructive'
                                  className='text-xs'
                                >
                                  Vắng
                                </Badge>
                              ) : (
                                <div
                                  className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getGradeColor(score.score)}`}
                                >
                                  {score.score.toFixed(1)}
                                </div>
                              )}
                            </td>
                            <td className='p-2 sm:p-3'>
                              <div className='text-xs sm:text-sm'>
                                {score.comment ? (
                                  <span className='text-muted-foreground line-clamp-2 italic'>
                                    &rdquo;{score.comment}&rdquo;
                                  </span>
                                ) : (
                                  <span className='text-muted-foreground'>
                                    -
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weighted Average Calculation */}
              <div className='bg-muted/30 mt-3 rounded-lg p-3 sm:mt-4 sm:p-4'>
                <div className='mb-2 text-xs font-medium sm:text-sm'>
                  Cách tính điểm trung bình:
                </div>
                <div className='text-muted-foreground space-y-1 text-xs'>
                  {scoresByComponent.map(
                    ({ component, scores: compScores }) => {
                      const validScores = compScores.filter(
                        (s) => !s.is_absent
                      );
                      const componentAvg =
                        validScores.length > 0
                          ? validScores.reduce((sum, s) => sum + s.score, 0) /
                            validScores.length
                          : 0;
                      return (
                        <div
                          key={component.id}
                          className='flex justify-between'
                        >
                          <span>
                            {component.name} (hệ số{' '}
                            {component.weight.toFixed(1)}):
                          </span>
                          <span>
                            {componentAvg.toFixed(1)} ×{' '}
                            {component.weight.toFixed(1)} ={' '}
                            {(componentAvg * component.weight).toFixed(1)}
                          </span>
                        </div>
                      );
                    }
                  )}
                  <div className='mt-2 border-t pt-1 font-medium'>
                    <div className='flex justify-between'>
                      <span>Điểm trung bình:</span>
                      <span>{averageScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Filter Tabs */}
          <Tabs value={selectedComponent} onValueChange={setSelectedComponent}>
            <TabsList className='grid h-auto w-full grid-cols-5 gap-1'>
              <TabsTrigger
                value='all'
                className='px-0.5 py-1.5 text-xs sm:px-1 sm:py-2 sm:text-sm'
              >
                <span className='hidden sm:inline'>Tất cả</span>
                <span className='sm:hidden'>All</span>
              </TabsTrigger>
              <TabsTrigger
                value='oral'
                className='px-0.5 py-1.5 text-xs sm:px-1 sm:py-2 sm:text-sm'
              >
                <span className='hidden sm:inline'>Miệng</span>
                <span className='sm:hidden'>Oral</span>
              </TabsTrigger>
              <TabsTrigger
                value='quiz'
                className='px-0.5 py-1.5 text-xs sm:px-1 sm:py-2 sm:text-sm'
              >
                <span className='hidden sm:inline'>15 phút</span>
                <span className='sm:hidden'>15m</span>
              </TabsTrigger>
              <TabsTrigger
                value='test'
                className='px-0.5 py-1.5 text-xs sm:px-1 sm:py-2 sm:text-sm'
              >
                <span className='hidden sm:inline'>1 tiết</span>
                <span className='sm:hidden'>1h</span>
              </TabsTrigger>
              <TabsTrigger
                value='final'
                className='px-0.5 py-1.5 text-xs sm:px-1 sm:py-2 sm:text-sm'
              >
                <span className='hidden sm:inline'>Học kỳ</span>
                <span className='sm:hidden'>Final</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedComponent} className='mt-3 sm:mt-4'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                    <Calendar className='h-4 w-4 sm:h-5 sm:w-5' />
                    Lịch sử bài kiểm tra
                    {selectedComponent !== 'all' && (
                      <Badge variant='outline' className='text-xs capitalize'>
                        {selectedComponent}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-w-[350px] overflow-x-auto sm:max-w-full'>
                    <div className='max-h-80 overflow-y-auto'>
                      <table className='w-full border-collapse text-xs sm:text-sm'>
                        <thead className='bg-background sticky top-0'>
                          <tr className='border-b'>
                            <th className='p-2 text-left font-medium sm:p-3'>
                              Tên bài kiểm tra
                            </th>
                            <th className='p-2 text-center font-medium sm:p-3'>
                              Hệ số
                            </th>
                            <th className='p-2 text-center font-medium sm:p-3'>
                              Điểm
                            </th>
                            <th className='p-2 text-left font-medium sm:p-3'>
                              Nhận xét
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredScores.length > 0 ? (
                            filteredScores
                              .sort(
                                (a, b) =>
                                  new Date(b.created_at).getTime() -
                                  new Date(a.created_at).getTime()
                              )
                              .map((score) => (
                                <tr
                                  key={score.id}
                                  className='hover:bg-muted/50 border-b transition-colors'
                                >
                                  <td className='p-2 sm:p-3'>
                                    <div className='flex items-center gap-2'>
                                      <div className='flex-shrink-0 rounded-full bg-gray-100 p-1 sm:p-1.5 dark:bg-gray-800'>
                                        {getTypeIcon(
                                          score.assessment?.grade_component
                                            ?.kind || 'quiz'
                                        )}
                                      </div>
                                      <div className='min-w-0 flex-1'>
                                        <div className='truncate text-xs font-medium sm:text-sm'>
                                          {score.assessment?.title}
                                        </div>
                                        <div className='text-muted-foreground text-xs'>
                                          {format(
                                            new Date(score.created_at),
                                            'dd/MM/yyyy'
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className='p-2 text-center sm:p-3'>
                                    <span className='text-xs font-medium sm:text-sm'>
                                      {score.assessment?.grade_component?.weight?.toFixed(
                                        1
                                      )}
                                    </span>
                                  </td>
                                  <td className='p-2 text-center sm:p-3'>
                                    {score.is_absent ? (
                                      <Badge
                                        variant='destructive'
                                        className='text-xs'
                                      >
                                        Vắng
                                      </Badge>
                                    ) : (
                                      <div
                                        className={`inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getGradeColor(score.score)}`}
                                      >
                                        {score.score.toFixed(1)}
                                      </div>
                                    )}
                                  </td>
                                  <td className='p-2 sm:p-3'>
                                    <div className='text-xs sm:text-sm'>
                                      {score.comment ? (
                                        <span className='text-muted-foreground line-clamp-2 italic'>
                                          &rdquo;{score.comment}&rdquo;
                                        </span>
                                      ) : (
                                        <span className='text-muted-foreground'>
                                          -
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className='text-muted-foreground py-6 text-center text-xs sm:py-8 sm:text-sm'
                              >
                                Không có bài kiểm tra nào cho{' '}
                                {selectedComponent === 'all'
                                  ? 'môn học này'
                                  : selectedComponent}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Score Statistics */}
          <div className='grid gap-2 sm:gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm sm:text-lg'>
                  Thống kê điểm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 sm:space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>Điểm cao nhất:</span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {Math.max(
                        ...scores
                          .filter((s) => !s.is_absent)
                          .map((s) => s.score)
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>Điểm thấp nhất:</span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {Math.min(
                        ...scores
                          .filter((s) => !s.is_absent)
                          .map((s) => s.score)
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>Tổng số bài:</span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {scores.length}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>Đã làm:</span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {scores.filter((s) => !s.is_absent).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm sm:text-lg'>
                  So sánh với lớp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 sm:space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>
                      Điểm cao nhất lớp:
                    </span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {mockClassStats.highestScore.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>
                      Điểm thấp nhất lớp:
                    </span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {mockClassStats.lowestScore.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>Điểm TB lớp:</span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {mockClassStats.classAverage.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-xs sm:text-sm'>
                      Xếp hạng của bạn:
                    </span>
                    <span className='text-xs font-medium sm:text-sm'>
                      {mockClassStats.studentRank}/
                      {mockClassStats.totalStudents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
