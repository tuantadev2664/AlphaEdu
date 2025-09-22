// Enhanced Teacher Class List Page
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  GraduationCap,
  BookOpen,
  Filter,
  ArrowRight,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Home
} from 'lucide-react';
import { fakeTeacher } from '@/constants/mock-api';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TeacherClassListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Get all classes from the system (not just teacher's classes)
  const allClasses = fakeTeacher.classes;

  // Filter classes based on search and grade
  const filteredClasses = allClasses.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === 'all' ||
      cls.grade?.grade_number.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter
  const availableGrades = Array.from(
    new Set(allClasses.map((cls) => cls.grade?.grade_number).filter(Boolean))
  ).sort();

  // Calculate stats
  const totalClasses = allClasses.length;
  const totalStudents = allClasses.reduce(
    (sum, cls) => sum + (cls.student_count || 0),
    0
  );
  const averageClassSize = Math.round(totalStudents / totalClasses);
  const myClasses = allClasses.filter(
    (cls) => cls.homeroom_teacher_id === 'teacher-1'
  ).length;

  const gradientColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-600'
  ];

  return (
    <ScrollArea className='h-[calc(100dvh)]'>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900'>
        {/* Hero Header */}
        <div className='relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10'></div>
          <div className='absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5'></div>

          <div className='relative mx-auto max-w-7xl px-6 py-16'>
            <div className='flex items-center justify-between'>
              <div className='space-y-6'>
                {/* Back to Dashboard Button */}
                <div className='mb-4 flex items-center gap-4'>
                  <Button
                    asChild
                    variant='ghost'
                    className='text-white transition-colors hover:bg-white/20'
                  >
                    <Link href='/teacher' className='flex items-center gap-2'>
                      <ArrowLeft className='h-4 w-4' />
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='rounded-2xl bg-white/20 p-3'>
                    <GraduationCap className='h-8 w-8' />
                  </div>
                  <div>
                    <h1 className='text-4xl font-bold tracking-tight'>
                      All Classes
                    </h1>
                    <p className='mt-2 text-lg text-indigo-100'>
                      Explore all classes across the school
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
                    <div className='flex items-center gap-2 text-indigo-100'>
                      <BookOpen className='h-4 w-4' />
                      <span className='text-sm font-medium'>Total Classes</span>
                    </div>
                    <div className='mt-1 text-2xl font-bold'>
                      {totalClasses}
                    </div>
                  </div>
                  <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
                    <div className='flex items-center gap-2 text-indigo-100'>
                      <Users className='h-4 w-4' />
                      <span className='text-sm font-medium'>
                        Total Students
                      </span>
                    </div>
                    <div className='mt-1 text-2xl font-bold'>
                      {totalStudents}
                    </div>
                  </div>
                  <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
                    <div className='flex items-center gap-2 text-indigo-100'>
                      <TrendingUp className='h-4 w-4' />
                      <span className='text-sm font-medium'>
                        Avg Class Size
                      </span>
                    </div>
                    <div className='mt-1 text-2xl font-bold'>
                      {averageClassSize}
                    </div>
                  </div>
                  <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
                    <div className='flex items-center gap-2 text-indigo-100'>
                      <Star className='h-4 w-4' />
                      <span className='text-sm font-medium'>My Classes</span>
                    </div>
                    <div className='mt-1 text-2xl font-bold'>{myClasses}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='mx-auto max-w-7xl px-6 py-8'>
          {/* Search and Filters */}
          <div className='mb-8 space-y-4'>
            <div className='flex flex-col gap-4 md:flex-row'>
              {/* Search */}
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Search classes...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='h-12 border-0 bg-white pl-10 shadow-sm focus:ring-2 focus:ring-indigo-500'
                />
              </div>

              {/* Grade Filter */}
              <div className='flex gap-2'>
                <Button
                  variant={selectedGrade === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedGrade('all')}
                  className='h-12'
                >
                  All Grades
                </Button>
                {availableGrades.map((grade) => (
                  <Button
                    key={grade}
                    variant={
                      selectedGrade === grade?.toString()
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => setSelectedGrade(grade?.toString() || 'all')}
                    className='h-12'
                  >
                    Grade {grade}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count & Quick Actions */}
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                Showing {filteredClasses.length} of {totalClasses} classes
              </p>
              <Button
                asChild
                variant='outline'
                className='hidden items-center gap-2 md:flex'
              >
                <Link href='/teacher'>
                  <Home className='h-4 w-4' />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Classes Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredClasses.map((cls, index) => (
              <Card
                key={cls.id}
                className='group relative overflow-hidden border-0 bg-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl'
              >
                {/* Gradient Header */}
                <div
                  className={`h-24 bg-gradient-to-r ${gradientColors[index % gradientColors.length]} relative overflow-hidden`}
                >
                  <div className='absolute inset-0 bg-black/10'></div>
                  <div className='absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/20'></div>
                  <div className='relative flex h-full items-center justify-between p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/30 font-bold text-white'>
                        {cls.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className='text-lg font-bold text-white'>
                          {cls.name}
                        </h3>
                        <p className='text-sm text-white/80'>
                          Grade {cls.grade?.grade_number}
                        </p>
                      </div>
                    </div>
                    {cls.homeroom_teacher_id === 'teacher-1' && (
                      <Badge className='border-white/30 bg-white/20 text-white'>
                        My Class
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className='space-y-4 p-6'>
                  <div className='space-y-3'>
                    <div className='text-muted-foreground flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      <span className='text-sm'>
                        {cls.student_count} students enrolled
                      </span>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      <span className='text-sm'>
                        Teacher ID: {cls.homeroom_teacher_id}
                      </span>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span className='text-sm'>
                        Grade Level: {cls.grade?.level}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex translate-y-2 transform gap-2 pt-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                    <Button asChild className='flex-1'>
                      <Link href={`/teacher/classes/${cls.id}/roster`}>
                        <BookOpen className='mr-2 h-4 w-4' />
                        View Details
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <div className='py-16 text-center'>
              <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <Search className='h-12 w-12 text-gray-400' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                No classes found
              </h3>
              <p className='text-muted-foreground mb-6'>
                Try adjusting your search terms or filters
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGrade('all');
                }}
                variant='outline'
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className='fixed right-6 bottom-6 z-50 md:hidden'>
          <Button
            asChild
            size='lg'
            className='h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
          >
            <Link href='/teacher'>
              <Home className='h-6 w-6' />
            </Link>
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
