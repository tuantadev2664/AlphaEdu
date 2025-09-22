'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Activity,
  Award
} from 'lucide-react';
import Link from 'next/link';
import {
  Class,
  TeacherDashboardStats,
  Announcement
} from '@/features/teacher/types';
import { format } from 'date-fns';

interface TeacherDashboardProps {
  stats: TeacherDashboardStats;
  classes: Class[];
}

export function TeacherDashboard({ stats, classes }: TeacherDashboardProps) {
  return (
    <div className='space-y-8'>
      {/* Welcome Section */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5'></div>

        <div className='relative flex items-center justify-between'>
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-white/20 p-2'>
                <GraduationCap className='h-6 w-6' />
              </div>
              <h1 className='text-4xl font-bold tracking-tight'>
                Welcome back, Teacher!
              </h1>
            </div>
            <p className='max-w-2xl text-lg text-blue-100'>
              Ready to inspire minds today? Here's your classroom overview and
              what needs your attention.
            </p>
            <div className='flex items-center gap-4 pt-2'>
              <div className='flex items-center gap-2 text-blue-100'>
                <Activity className='h-4 w-4' />
                <span className='text-sm'>
                  Active Classes: {stats.total_classes}
                </span>
              </div>
              <div className='flex items-center gap-2 text-blue-100'>
                <Users className='h-4 w-4' />
                <span className='text-sm'>
                  Students: {stats.total_students}
                </span>
              </div>
            </div>
          </div>
          <div className='hidden flex-col gap-3 md:flex'>
            <Button
              asChild
              className='border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30'
            >
              <Link href='/teacher/inbox'>
                <MessageSquare className='mr-2 h-4 w-4' />
                Messages ({stats.unread_messages})
              </Link>
            </Button>
            {stats.pending_assignments > 0 && (
              <Button
                variant='outline'
                className='border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20'
                asChild
              >
                <Link href='/teacher/assignments'>
                  <ClipboardList className='mr-2 h-4 w-4' />
                  {stats.pending_assignments} to grade
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10'></div>
          <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle className='text-sm font-medium text-emerald-100'>
              Total Classes
            </CardTitle>
            <div className='rounded-lg bg-white/20 p-2'>
              <GraduationCap className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='relative'>
            <div className='text-3xl font-bold'>{stats.total_classes}</div>
            <p className='mt-1 flex items-center gap-1 text-xs text-emerald-100'>
              <TrendingUp className='h-3 w-3' />
              Active this semester
            </p>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10'></div>
          <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle className='text-sm font-medium text-blue-100'>
              Total Students
            </CardTitle>
            <div className='rounded-lg bg-white/20 p-2'>
              <Users className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='relative'>
            <div className='text-3xl font-bold'>{stats.total_students}</div>
            <p className='mt-1 flex items-center gap-1 text-xs text-blue-100'>
              <Star className='h-3 w-3' />
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card
          className={`relative overflow-hidden border-0 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            stats.pending_assignments > 0
              ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}
        >
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10'></div>
          <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle
              className={`text-sm font-medium ${
                stats.pending_assignments > 0
                  ? 'text-orange-100'
                  : 'text-gray-100'
              }`}
            >
              Pending Tasks
            </CardTitle>
            <div className='rounded-lg bg-white/20 p-2'>
              <ClipboardList className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='relative'>
            <div className='text-3xl font-bold'>
              {stats.pending_assignments}
            </div>
            <p
              className={`mt-1 flex items-center gap-1 text-xs ${
                stats.pending_assignments > 0
                  ? 'text-orange-100'
                  : 'text-gray-100'
              }`}
            >
              <Award className='h-3 w-3' />
              Assignments to grade
            </p>
          </CardContent>
        </Card>

        <Card
          className={`relative overflow-hidden border-0 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            stats.unread_messages > 0
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}
        >
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10'></div>
          <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle
              className={`text-sm font-medium ${
                stats.unread_messages > 0 ? 'text-purple-100' : 'text-gray-100'
              }`}
            >
              Unread Messages
            </CardTitle>
            <div className='rounded-lg bg-white/20 p-2'>
              <MessageSquare className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='relative'>
            <div className='text-3xl font-bold'>{stats.unread_messages}</div>
            <p
              className={`mt-1 flex items-center gap-1 text-xs ${
                stats.unread_messages > 0 ? 'text-purple-100' : 'text-gray-100'
              }`}
            >
              <Bell className='h-3 w-3' />
              {stats.unread_messages > 0
                ? 'Require response'
                : 'All caught up!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-8 md:grid-cols-2'>
        {/* My Classes */}
        <Card className='border-0 bg-gradient-to-br from-slate-50 to-gray-100 shadow-lg dark:from-gray-900 dark:to-gray-800'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-3 text-xl'>
              <div className='rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 text-white'>
                <BookOpen className='h-6 w-6' />
              </div>
              <div>
                <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  My Classes
                </span>
                <p className='text-muted-foreground mt-1 text-sm font-normal'>
                  Manage your active classes
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {classes.map((classItem, index) => (
                <div
                  key={classItem.id}
                  className='group relative overflow-hidden rounded-xl border-0 bg-white p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-indigo-900/20'></div>
                  <div className='relative flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${
                          [
                            'bg-gradient-to-br from-blue-500 to-blue-600',
                            'bg-gradient-to-br from-green-500 to-green-600',
                            'bg-gradient-to-br from-purple-500 to-purple-600',
                            'bg-gradient-to-br from-orange-500 to-orange-600',
                            'bg-gradient-to-br from-pink-500 to-pink-600'
                          ][index % 5]
                        }`}
                      >
                        {classItem.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {classItem.name}
                        </h4>
                        <div className='mt-1 flex items-center gap-3'>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>
                            <GraduationCap className='h-3 w-3' />
                            Grade {classItem.grade?.grade_number}
                          </span>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>
                            <Users className='h-3 w-3' />
                            {classItem.student_count} students
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex translate-x-4 transform gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-indigo-200 bg-white/80 text-indigo-600 shadow-sm hover:bg-indigo-50 hover:text-indigo-700'
                        asChild
                      >
                        <Link href={`/teacher/classes/${classItem.id}/roster`}>
                          View
                          <ArrowRight className='ml-1 h-3 w-3' />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {classes.length === 0 && (
                <div className='py-12 text-center'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                    <BookOpen className='h-8 w-8 text-gray-400' />
                  </div>
                  <p className='text-muted-foreground text-lg font-medium'>
                    No classes assigned yet
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    Contact your administrator to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className='border-0 bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg dark:from-amber-900/20 dark:to-orange-900/20'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-3 text-xl'>
              <div className='rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 text-white'>
                <Bell className='h-6 w-6' />
              </div>
              <div>
                <span className='bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
                  Recent Announcements
                </span>
                <p className='text-muted-foreground mt-1 text-sm font-normal'>
                  Stay updated with latest news
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {stats.recent_announcements.map((announcement, index) => (
                <EnhancedAnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  index={index}
                />
              ))}
              {stats.recent_announcements.length === 0 && (
                <div className='py-12 text-center'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30'>
                    <Bell className='h-8 w-8 text-amber-500' />
                  </div>
                  <p className='text-muted-foreground text-lg font-medium'>
                    No recent announcements
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    All caught up! Check back later.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='border-0 bg-gradient-to-br from-gray-50 to-slate-100 shadow-lg dark:from-gray-900 dark:to-slate-900'>
        <CardHeader className='pb-6'>
          <CardTitle className='flex items-center gap-3 text-2xl'>
            <div className='rounded-xl bg-gradient-to-br from-slate-600 to-gray-700 p-2.5 text-white'>
              <TrendingUp className='h-6 w-6' />
            </div>
            <div>
              <span className='bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent'>
                Quick Actions
              </span>
              <p className='text-muted-foreground mt-1 text-sm font-normal'>
                Access frequently used tools
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='group cursor-pointer border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <Link href='/teacher/classes' className='block p-6 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
                  <GraduationCap className='h-8 w-8' />
                </div>
                <h3 className='mb-2 text-lg font-semibold'>View All Classes</h3>
                <p className='text-sm text-indigo-100'>Manage your courses</p>
              </Link>
            </Card>

            <Card className='group cursor-pointer border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <Link href='/teacher/inbox' className='block p-6 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
                  <MessageSquare className='h-8 w-8' />
                </div>
                <h3 className='mb-2 text-lg font-semibold'>Check Messages</h3>
                <p className='text-sm text-emerald-100'>Stay connected</p>
              </Link>
            </Card>

            <Card className='group cursor-pointer border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <div className='block p-6 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
                  <Calendar className='h-8 w-8' />
                </div>
                <h3 className='mb-2 text-lg font-semibold'>Schedule</h3>
                <p className='text-sm text-orange-100'>Plan your day</p>
              </div>
            </Card>

            <Card className='group cursor-pointer border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
              <div className='block p-6 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
                  <ClipboardList className='h-8 w-8' />
                </div>
                <h3 className='mb-2 text-lg font-semibold'>Grade Book</h3>
                <p className='text-sm text-violet-100'>Track progress</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EnhancedAnnouncementCard({
  announcement,
  index
}: {
  announcement: Announcement;
  index: number;
}) {
  const gradients = [
    'from-blue-500/10 to-indigo-500/10 border-blue-200',
    'from-green-500/10 to-emerald-500/10 border-green-200',
    'from-purple-500/10 to-violet-500/10 border-purple-200',
    'from-orange-500/10 to-red-500/10 border-orange-200',
    'from-pink-500/10 to-rose-500/10 border-pink-200'
  ];

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br ${gradients[index % 5]} p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className='absolute inset-0 bg-white/50 dark:bg-gray-800/50'></div>
      <div className='relative'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <div
                className={`h-2 w-2 rounded-full ${
                  announcement.is_urgent ? 'bg-red-500' : 'bg-green-500'
                }`}
              ></div>
              <h5 className='font-semibold text-gray-900 dark:text-white'>
                {announcement.title}
              </h5>
              {announcement.is_urgent && (
                <Badge className='animate-pulse bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'>
                  Urgent
                </Badge>
              )}
            </div>
            <p className='mb-3 line-clamp-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              {announcement.content}
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                <Calendar className='h-3 w-3' />
                <span>
                  {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 px-2 text-xs opacity-0 transition-all duration-300 group-hover:opacity-100'
              >
                Read more
                <ArrowRight className='ml-1 h-3 w-3' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className='rounded-lg border p-3'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <h5 className='text-sm font-medium'>{announcement.title}</h5>
            {announcement.is_urgent && (
              <Badge variant='destructive' className='text-xs'>
                Urgent
              </Badge>
            )}
          </div>
          <p className='text-muted-foreground line-clamp-2 text-xs'>
            {announcement.content}
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}
