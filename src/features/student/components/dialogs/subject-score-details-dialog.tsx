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
      (score) => score.assessment?.grade_component_id === component.id
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
            (gc) => gc.id === score.assessment?.grade_component_id
          );
          return component?.kind === selectedComponent;
        });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-[1400px] overflow-y-auto px-2 py-4'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            {subject.name} - Score Details
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of your performance in {subject.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Overall Performance Summary */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {averageScore.toFixed(1)}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Điểm trung bình
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600'>
                    {letterGrade}
                  </div>
                  <div className='text-muted-foreground text-sm'>Xếp loại</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-purple-600'>
                    {mockClassStats.studentRank}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Xếp hạng lớp
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-orange-600'>
                    {mockClassStats.classAverage.toFixed(1)}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Điểm TB lớp
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Your Performance vs Class
                  </span>
                  <div className='flex items-center gap-2'>
                    {getPerformanceIcon(
                      averageScore,
                      mockClassStats.classAverage
                    )}
                    <span className='text-sm'>
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
                  <div className='flex justify-between text-sm'>
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
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Award className='h-5 w-5' />
                Bảng điểm chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <div className='max-h-96 overflow-y-auto'>
                  <table className='w-full border-collapse'>
                    <thead className='bg-background sticky top-0'>
                      <tr className='border-b'>
                        <th className='p-3 text-left font-medium'>
                          Tên bài kiểm tra
                        </th>
                        <th className='p-3 text-center font-medium'>Loại</th>
                        <th className='p-3 text-center font-medium'>Hệ số</th>
                        <th className='p-3 text-center font-medium'>Điểm</th>
                        <th className='p-3 text-left font-medium'>Nhận xét</th>
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
                            <td className='p-3'>
                              <div className='flex items-center gap-2'>
                                <div className='rounded-full bg-gray-100 p-1.5 dark:bg-gray-800'>
                                  {getTypeIcon(
                                    score.assessment?.grade_component?.kind ||
                                      'quiz'
                                  )}
                                </div>
                                <div>
                                  <div className='font-medium'>
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
                            <td className='p-3 text-center'>
                              <Badge variant='outline' className='text-xs'>
                                {score.assessment?.grade_component?.name}
                              </Badge>
                            </td>
                            <td className='p-3 text-center'>
                              <span className='font-medium'>
                                {score.assessment?.grade_component?.weight?.toFixed(
                                  1
                                )}
                              </span>
                            </td>
                            <td className='p-3 text-center'>
                              {score.is_absent ? (
                                <Badge variant='destructive'>Vắng</Badge>
                              ) : (
                                <div
                                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-medium ${getGradeColor(score.score)}`}
                                >
                                  {score.score.toFixed(1)}
                                </div>
                              )}
                            </td>
                            <td className='p-3'>
                              <div className='text-sm'>
                                {score.comment ? (
                                  <span className='text-muted-foreground italic'>
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
              <div className='bg-muted/30 mt-4 rounded-lg p-4'>
                <div className='mb-2 text-sm font-medium'>
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
            <TabsList className='grid w-full grid-cols-5'>
              <TabsTrigger value='all'>Tất cả</TabsTrigger>
              <TabsTrigger value='oral'>Miệng</TabsTrigger>
              <TabsTrigger value='quiz'>15 phút</TabsTrigger>
              <TabsTrigger value='test'>1 tiết</TabsTrigger>
              <TabsTrigger value='final'>Học kỳ</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedComponent} className='mt-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5' />
                    Lịch sử bài kiểm tra
                    {selectedComponent !== 'all' && (
                      <Badge variant='outline' className='capitalize'>
                        {selectedComponent}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <div className='max-h-80 overflow-y-auto'>
                      <table className='w-full border-collapse'>
                        <thead className='bg-background sticky top-0'>
                          <tr className='border-b'>
                            <th className='p-3 text-left font-medium'>
                              Tên bài kiểm tra
                            </th>
                            <th className='p-3 text-center font-medium'>
                              Hệ số
                            </th>
                            <th className='p-3 text-center font-medium'>
                              Điểm
                            </th>
                            <th className='p-3 text-left font-medium'>
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
                                  <td className='p-3'>
                                    <div className='flex items-center gap-2'>
                                      <div className='rounded-full bg-gray-100 p-1.5 dark:bg-gray-800'>
                                        {getTypeIcon(
                                          score.assessment?.grade_component
                                            ?.kind || 'quiz'
                                        )}
                                      </div>
                                      <div>
                                        <div className='font-medium'>
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
                                  <td className='p-3 text-center'>
                                    <span className='font-medium'>
                                      {score.assessment?.grade_component?.weight?.toFixed(
                                        1
                                      )}
                                    </span>
                                  </td>
                                  <td className='p-3 text-center'>
                                    {score.is_absent ? (
                                      <Badge variant='destructive'>Vắng</Badge>
                                    ) : (
                                      <div
                                        className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-medium ${getGradeColor(score.score)}`}
                                      >
                                        {score.score.toFixed(1)}
                                      </div>
                                    )}
                                  </td>
                                  <td className='p-3'>
                                    <div className='text-sm'>
                                      {score.comment ? (
                                        <span className='text-muted-foreground italic'>
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
                                className='text-muted-foreground py-8 text-center'
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
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Thống kê điểm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Điểm cao nhất:</span>
                    <span className='font-medium'>
                      {Math.max(
                        ...scores
                          .filter((s) => !s.is_absent)
                          .map((s) => s.score)
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Điểm thấp nhất:</span>
                    <span className='font-medium'>
                      {Math.min(
                        ...scores
                          .filter((s) => !s.is_absent)
                          .map((s) => s.score)
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Tổng số bài:</span>
                    <span className='font-medium'>{scores.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Đã làm:</span>
                    <span className='font-medium'>
                      {scores.filter((s) => !s.is_absent).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>So sánh với lớp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Điểm cao nhất lớp:</span>
                    <span className='font-medium'>
                      {mockClassStats.highestScore.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Điểm thấp nhất lớp:</span>
                    <span className='font-medium'>
                      {mockClassStats.lowestScore.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Điểm TB lớp:</span>
                    <span className='font-medium'>
                      {mockClassStats.classAverage.toFixed(1)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Xếp hạng của bạn:</span>
                    <span className='font-medium'>
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
