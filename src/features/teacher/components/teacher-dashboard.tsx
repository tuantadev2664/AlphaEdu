'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  Calendar,
  Bell,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { TeacherDashboardStats } from '@/features/teacher/types';
import { format } from 'date-fns';
import {
  useTeacherClasses,
  useActiveAnnouncements
} from '../hooks/use-teacher.query';

interface TeacherDashboardProps {
  stats: TeacherDashboardStats;
}

export function TeacherDashboard({ stats }: TeacherDashboardProps) {
  const { data: classes, isLoading } = useTeacherClasses({
    academicYearId: '22222222-2222-2222-2222-222222222222'
  });

  // Fetch active announcements from API
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useActiveAnnouncements();

  return (
    <div className='flex flex-1 flex-col space-y-8'>
      {/* Welcome Section */}
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Chào mừng trở lại, Giáo viên! 👋
          </h2>
          <p className='text-muted-foreground'>
            Đây là tổng quan lớp học và những việc cần chú ý.
          </p>
        </div>
        <div className='hidden items-center gap-2 md:flex'>
          <Button asChild variant='outline'>
            <Link href='/teacher/inbox'>
              <MessageSquare className='mr-2 h-4 w-4' />
              Tin nhắn ({stats.unread_messages})
            </Link>
          </Button>
          {stats.pending_assignments > 0 && (
            <Button asChild>
              <Link href='/teacher/assignments'>
                <ClipboardList className='mr-2 h-4 w-4' />
                {stats.pending_assignments} cần chấm
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
        <Card className='@container/card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng Số Lớp</CardTitle>
            <GraduationCap className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tabular-nums @[250px]/card:text-3xl'>
              {stats.total_classes}
            </div>
          </CardContent>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Hoạt động học kỳ này <TrendingUp className='size-4' />
            </div>
            <div className='text-muted-foreground'>
              Tất cả lớp đang hoạt động tốt
            </div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tổng Số Học Sinh
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tabular-nums @[250px]/card:text-3xl'>
              {stats.total_students}
            </div>
          </CardContent>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Trên tất cả lớp học <Star className='size-4' />
            </div>
            <div className='text-muted-foreground'>
              Sự tham gia tích cực học kỳ này
            </div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Công Việc Đang Chờ
            </CardTitle>
            <ClipboardList className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tabular-nums @[250px]/card:text-3xl'>
              {stats.pending_assignments}
            </div>
          </CardContent>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              {stats.pending_assignments > 0
                ? 'Cần chú ý'
                : 'Đã hoàn thành hết'}{' '}
              <Award className='size-4' />
            </div>
            <div className='text-muted-foreground'>
              {stats.pending_assignments > 0
                ? 'Bài tập đang chờ chấm điểm'
                : 'Làm tốt lắm!'}
            </div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tin Nhắn Chưa Đọc
            </CardTitle>
            <MessageSquare className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold tabular-nums @[250px]/card:text-3xl'>
              {stats.unread_messages}
            </div>
          </CardContent>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              {stats.unread_messages > 0 ? 'Cần phản hồi' : 'Đã hoàn thành hết'}{' '}
              <Bell className='size-4' />
            </div>
            <div className='text-muted-foreground'>
              {stats.unread_messages > 0
                ? 'Tin nhắn cần chú ý'
                : 'Giao tiếp đã được cập nhật'}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* My Classes */}
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Lớp Học Của Tôi
            </CardTitle>
            <CardDescription>
              Quản lý các lớp đang hoạt động và theo dõi tiến độ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {classes?.map((classItem, index) => {
                // Calculate some mock progress data for visual appeal
                const attendanceRate = Math.floor(Math.random() * 20) + 80; // 80-100%
                const avgGrade = Math.floor(Math.random() * 15) + 85; // 85-100%
                const progressColor =
                  avgGrade >= 90
                    ? 'bg-green-500'
                    : avgGrade >= 80
                      ? 'bg-blue-500'
                      : 'bg-yellow-500';

                return (
                  <div
                    key={classItem.id}
                    className='group bg-card relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold'>
                          {classItem.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1 space-y-2'>
                          <div>
                            <h4 className='font-semibold'>{classItem.name}</h4>
                            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
                              <span className='flex items-center gap-1'>
                                <GraduationCap className='h-3 w-3' />
                                Khối{' '}
                                {classItem.grade?.grade_number ||
                                  classItem.name.charAt(0).toUpperCase()}
                              </span>
                              <span className='flex items-center gap-1'>
                                <Users className='h-3 w-3' />
                                {classItem.studentCount} học sinh
                              </span>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between space-x-2 text-xs'>
                              <span className='text-muted-foreground'>
                                Hiệu Suất Lớp Học
                              </span>
                              <span className='font-medium'>
                                {avgGrade}% TB
                              </span>
                            </div>
                            <Progress value={avgGrade} className='h-1.5' />
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                        <Badge variant='secondary' className='text-xs'>
                          {attendanceRate}% điểm danh
                        </Badge>
                        <Button variant='ghost' size='sm' asChild>
                          <Link
                            href={`/teacher/classes/${classItem.id}/roster`}
                          >
                            Xem
                            <ArrowRight className='ml-1 h-3 w-3' />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {classes?.length === 0 && (
                <div className='py-12 text-center'>
                  <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                    <BookOpen className='text-muted-foreground h-8 w-8' />
                  </div>
                  <p className='text-lg font-medium'>
                    Chưa có lớp được phân công
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    Liên hệ quản trị viên để bắt đầu
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex w-full items-center justify-between text-sm'>
              <div className='text-muted-foreground'>
                {classes?.length} lớp đang hoạt động
              </div>
              <Button variant='outline' size='sm' asChild>
                <Link href='/teacher/classes'>
                  Xem Tất Cả Lớp
                  <ArrowRight className='ml-1 h-3 w-3' />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Recent Announcements */}
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5' />
              Thông Báo Gần Đây
            </CardTitle>
            <CardDescription>
              Cập nhật tin tức và thông báo mới nhất của trường
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {isLoadingAnnouncements ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='text-muted-foreground'>
                    Đang tải thông báo...
                  </div>
                </div>
              ) : (
                (announcements || []).map((announcement, index) => {
                  const isRecent =
                    new Date().getTime() -
                      new Date(announcement.createdAt).getTime() <
                    24 * 60 * 60 * 1000; // Within 24 hours
                  const priorityColor = announcement.isUrgent
                    ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50'
                    : isRecent
                      ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50'
                      : 'border-border bg-card';

                  return (
                    <div
                      key={announcement.id}
                      className={`group relative rounded-lg border p-4 transition-all hover:shadow-md ${priorityColor}`}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-start gap-3'>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              announcement.isUrgent
                                ? 'bg-red-500/10 text-red-600'
                                : isRecent
                                  ? 'bg-blue-500/10 text-blue-600'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Bell className='h-4 w-4' />
                          </div>
                          <div className='flex-1 space-y-1'>
                            <div className='flex items-center gap-2'>
                              <h5 className='font-semibold'>
                                {announcement.title}
                              </h5>
                              {announcement.isUrgent && (
                                <Badge
                                  variant='destructive'
                                  className='animate-pulse text-xs'
                                >
                                  Khẩn Cấp
                                </Badge>
                              )}
                              {isRecent && !announcement.isUrgent && (
                                <Badge variant='secondary' className='text-xs'>
                                  Mới
                                </Badge>
                              )}
                            </div>
                            <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>
                              {announcement.content}
                            </p>
                            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                              <Calendar className='h-3 w-3' />
                              <span>
                                {format(
                                  new Date(announcement.createdAt),
                                  'MMM dd, yyyy'
                                )}
                              </span>
                              {isRecent && (
                                <>
                                  <span>•</span>
                                  <span className='text-blue-600 dark:text-blue-400'>
                                    Hôm nay
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          <ArrowRight className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
              {!isLoadingAnnouncements &&
                (announcements || []).length === 0 && (
                  <div className='py-12 text-center'>
                    <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                      <Bell className='text-muted-foreground h-8 w-8' />
                    </div>
                    <p className='text-lg font-medium'>
                      Không có thông báo gần đây
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Tất cả đã cập nhật! Kiểm tra lại sau.
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex w-full items-center justify-between text-sm'>
              <div className='text-muted-foreground'>
                {(announcements || []).length} thông báo gần đây
              </div>
              <Button variant='outline' size='sm'>
                Xem Tất Cả
                <ArrowRight className='ml-1 h-3 w-3' />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Hành Động Nhanh
          </CardTitle>
          <CardDescription>
            Truy cập các công cụ và lối tắt thường dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='group hover:border-primary/20 cursor-pointer border-2 border-transparent transition-all hover:shadow-md'>
              <Link href='/teacher/classes' className='block p-4'>
                <div className='flex flex-col items-center gap-3 text-center'>
                  <div className='bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl transition-colors'>
                    <GraduationCap className='h-6 w-6' />
                  </div>
                  <div>
                    <div className='font-semibold'>Xem Tất Cả Lớp</div>
                    <div className='text-muted-foreground text-sm'>
                      Quản lý các lớp học
                    </div>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className='group hover:border-primary/20 cursor-pointer border-2 border-transparent transition-all hover:shadow-md'>
              <Link href='/teacher/inbox' className='block p-4'>
                <div className='flex flex-col items-center gap-3 text-center'>
                  <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white'>
                    <MessageSquare className='h-6 w-6' />
                    {stats.unread_messages > 0 && (
                      <div className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                        {stats.unread_messages}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='font-semibold'>Kiểm Tra Tin Nhắn</div>
                    <div className='text-muted-foreground text-sm'>
                      {stats.unread_messages > 0
                        ? `${stats.unread_messages} chưa đọc`
                        : 'Giữ liên lạc'}
                    </div>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className='group hover:border-muted-foreground/20 border-2 border-transparent transition-all'>
              <div className='block p-4'>
                <div className='flex flex-col items-center gap-3 text-center opacity-50'>
                  <div className='bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-xl'>
                    <Calendar className='h-6 w-6' />
                  </div>
                  <div>
                    <div className='font-semibold'>Lịch Trình</div>
                    <div className='text-muted-foreground text-sm'>
                      Sắp ra mắt
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='group cursor-pointer border-2 border-transparent transition-all hover:border-amber-500/20 hover:shadow-md'>
              <div className='block p-4'>
                <div className='flex flex-col items-center gap-3 text-center'>
                  <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white'>
                    <ClipboardList className='h-6 w-6' />
                    {stats.pending_assignments > 0 && (
                      <div className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                        {stats.pending_assignments}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='font-semibold'>Sổ Điểm</div>
                    <div className='text-muted-foreground text-sm'>
                      {stats.pending_assignments > 0
                        ? `${stats.pending_assignments} đang chờ`
                        : 'Theo dõi tiến độ'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex w-full items-center justify-between text-sm'>
            <div className='text-muted-foreground'>
              Truy cập nhanh các công cụ giáo viên thiết yếu
            </div>
            <Button variant='ghost' size='sm'>
              Tùy Chỉnh
              <ArrowRight className='ml-1 h-3 w-3' />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
