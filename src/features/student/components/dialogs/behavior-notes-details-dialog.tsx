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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BehaviorNote } from '@/features/student/types';
import {
  FileText,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Minus,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

interface BehaviorNotesDetailsDialogProps {
  studentName: string;
  behaviorSummary: {
    excellent_count: number;
    good_count: number;
    fair_count: number;
    needs_improvement_count: number;
    poor_count: number;
  };
  notes?: BehaviorNote[];
  children: React.ReactNode;
}

// Deprecated: Local mock notes were used before API integration.
// Keeping example structure for reference, but component now prefers `notes` prop when provided.
const mockBehaviorNotes: BehaviorNote[] = [
  {
    id: 'behavior-1',
    student_id: 'student-1',
    class_id: 'class-1',
    term_id: 'term-s1-2024',
    note: 'Học sinh tích cực tham gia hoạt động nhóm và giúp đỡ bạn bè',
    level: 'Excellent',
    created_by: 'teacher-1',
    created_at: '2024-09-15T10:30:00Z',
    created_by_user: {
      id: 'teacher-1',
      role: 'teacher',
      full_name: 'Cô Nguyễn Thị Lan',
      email: 'lan.nguyen@school.edu',
      phone: '+84-123-456-789',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    }
  },
  {
    id: 'behavior-2',
    student_id: 'student-1',
    class_id: 'class-1',
    term_id: 'term-s1-2024',
    note: 'Hoàn thành bài tập đúng hạn và có thái độ học tập tốt',
    level: 'Good',
    created_by: 'teacher-1',
    created_at: '2024-09-20T14:15:00Z',
    created_by_user: {
      id: 'teacher-1',
      role: 'teacher',
      full_name: 'Thầy Trần Văn Nam',
      email: 'nam.tran@school.edu',
      phone: '+84-123-456-790',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    }
  },
  {
    id: 'behavior-3',
    student_id: 'student-1',
    class_id: 'class-1',
    term_id: 'term-s1-2024',
    note: 'Cần cải thiện việc tập trung trong giờ học',
    level: 'Needs improvement',
    created_by: 'teacher-2',
    created_at: '2024-09-25T09:45:00Z',
    created_by_user: {
      id: 'teacher-2',
      role: 'teacher',
      full_name: 'Cô Lê Thị Hoa',
      email: 'hoa.le@school.edu',
      phone: '+84-123-456-791',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    }
  },
  {
    id: 'behavior-4',
    student_id: 'student-1',
    class_id: 'class-1',
    term_id: 'term-s1-2024',
    note: 'Thể hiện tinh thần tr책nhiệm cao trong công việc lớp',
    level: 'Excellent',
    created_by: 'teacher-1',
    created_at: '2024-10-01T11:20:00Z',
    created_by_user: {
      id: 'teacher-1',
      role: 'teacher',
      full_name: 'Cô Nguyễn Thị Lan',
      email: 'lan.nguyen@school.edu',
      phone: '+84-123-456-789',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    }
  },
  {
    id: 'behavior-5',
    student_id: 'student-1',
    class_id: 'class-1',
    term_id: 'term-s1-2024',
    note: 'Thái độ học tập bình thường, cần động viên thêm',
    level: 'Fair',
    created_by: 'teacher-3',
    created_at: '2024-10-05T16:00:00Z',
    created_by_user: {
      id: 'teacher-3',
      role: 'teacher',
      full_name: 'Thầy Phạm Minh Tuấn',
      email: 'tuan.pham@school.edu',
      phone: '+84-123-456-792',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    }
  }
];

const getBehaviorIcon = (level: string) => {
  switch (level) {
    case 'excellent':
      return <Star className='h-4 w-4 text-yellow-500' />;
    case 'good':
      return <CheckCircle className='h-4 w-4 text-green-600' />;
    case 'fair':
      return <Minus className='h-4 w-4 text-blue-600' />;
    case 'needs_improvement':
      return <AlertTriangle className='h-4 w-4 text-orange-600' />;
    case 'poor':
      return <XCircle className='h-4 w-4 text-red-600' />;
    default:
      return <Minus className='h-4 w-4 text-gray-600' />;
  }
};

const getBehaviorColor = (level: string) => {
  switch (level) {
    case 'Excellent':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Good':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'fair':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Needs improvement':
      return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'Poor':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

const getBehaviorLabel = (level: string) => {
  switch (level) {
    case 'excellent':
      return 'Xuất sắc';
    case 'good':
      return 'Tốt';
    case 'fair':
      return 'Khá';
    case 'needs_improvement':
      return 'Cần cải thiện';
    case 'poor':
      return 'Yếu';
    default:
      return 'Không xác định';
  }
};

export function BehaviorNotesDetailsDialog({
  studentName,
  behaviorSummary,
  notes,
  children
}: BehaviorNotesDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const sourceNotes = (
    notes && notes.length > 0 ? notes : mockBehaviorNotes
  ).slice();
  const filteredNotes =
    selectedLevel === 'all'
      ? sourceNotes
      : sourceNotes.filter((note) => note.level === selectedLevel);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Nhận xét hạnh kiểm - {studentName}
          </DialogTitle>
          <DialogDescription>
            Chi tiết các nhận xét về hạnh kiểm và thái độ học tập
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Behavior Summary Overview */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Tổng quan hạnh kiểm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 md:grid-cols-5'>
                {Object.entries(behaviorSummary).map(([level, count]) => {
                  const levelKey = level.replace('_count', '');
                  const levelLabel = getBehaviorLabel(levelKey);

                  return (
                    <div
                      key={level}
                      className='rounded-lg border p-3 text-center'
                    >
                      <div className='mb-2 flex items-center justify-center'>
                        {getBehaviorIcon(levelKey)}
                      </div>
                      <div className='text-2xl font-bold'>{count}</div>
                      <div className='text-muted-foreground text-xs'>
                        {levelLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Filter Buttons */}
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setSelectedLevel('all')}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedLevel === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              Tất cả ({sourceNotes.length})
            </button>
            {['Excellent', 'Good', 'Fair', 'Needs improvement', 'Poor'].map(
              (level) => {
                const count = sourceNotes.filter(
                  (note) => note.level === level
                ).length;
                if (count === 0) return null;

                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      selectedLevel === level
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {getBehaviorLabel(level.toLowerCase())} ({count})
                  </button>
                );
              }
            )}
          </div>

          {/* Behavior Notes List */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Danh sách nhận xét
                {selectedLevel !== 'all' && (
                  <Badge variant='outline'>
                    {getBehaviorLabel(selectedLevel.toLowerCase())}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-96 space-y-4 overflow-y-auto'>
                {filteredNotes.length > 0 ? (
                  filteredNotes
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((note) => (
                      <div
                        key={note.id}
                        className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                      >
                        <div className='mb-3 flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            {getBehaviorIcon(note.level.toLowerCase())}
                            <Badge
                              variant='outline'
                              className={`text-xs ${getBehaviorColor(note.level)}`}
                            >
                              {getBehaviorLabel(note.level.toLowerCase())}
                            </Badge>
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {format(
                              new Date(note.created_at),
                              'dd/MM/yyyy HH:mm'
                            )}
                          </div>
                        </div>

                        <div className='mb-3'>
                          <p className='text-sm leading-relaxed'>{note.note}</p>
                        </div>

                        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                          <User className='h-3 w-3' />
                          <span>
                            Nhận xét bởi: {note.created_by_user?.full_name}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className='text-muted-foreground py-8 text-center'>
                    Không có nhận xét nào cho{' '}
                    {selectedLevel === 'all'
                      ? 'học sinh này'
                      : getBehaviorLabel(selectedLevel).toLowerCase()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Tổng số nhận xét:</span>
                    <span className='font-medium'>{notes?.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Nhận xét tích cực:</span>
                    <span className='font-medium text-green-600'>
                      {
                        notes?.filter((n) =>
                          ['excellent', 'good'].includes(n.level.toLowerCase())
                        ).length
                      }
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Cần cải thiện:</span>
                    <span className='font-medium text-orange-600'>
                      {
                        notes?.filter((n) =>
                          ['needs_improvement', 'poor'].includes(
                            n.level.toLowerCase()
                          )
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Xu hướng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Nhận xét gần đây:</span>
                    <span className='font-medium'>
                      {notes?.length && notes.length > 0 && (
                        <Badge
                          variant='outline'
                          className={getBehaviorColor(notes?.[0].level)}
                        >
                          {getBehaviorLabel(notes?.[0].level.toLowerCase())}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>
                      Giáo viên nhận xét nhiều nhất:
                    </span>
                    <span className='text-sm font-medium'>
                      {notes?.[0].created_by_user?.full_name}
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
