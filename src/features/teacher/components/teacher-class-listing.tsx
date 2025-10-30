'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  BookOpen,
  ArrowRight,
  Star,
  TrendingUp,
  MapPin,
  User,
  ArrowLeft
} from 'lucide-react';
import { useTeacherClasses } from '../hooks/use-teacher.query';

export default function TeacherClassListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showMyClassesOnly, setShowMyClassesOnly] = useState(false);

  const { data: classes, isLoading } = useTeacherClasses({
    academicYearId: '22222222-2222-2222-2222-222222222222'
  });

  // Get all classes from the teacher's assignments
  const allClasses = classes || [];

  // Filter classes based on search, grade, and my classes
  const filteredClasses = allClasses.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === 'all' || cls.gradeId === selectedGrade;
    const matchesMyClasses = !showMyClassesOnly || true; // All returned classes are teacher's classes
    return matchesSearch && matchesGrade && matchesMyClasses;
  });

  // Get unique grades for filter from gradeId
  const availableGrades = Array.from(
    new Set(
      allClasses
        .map((cls) => {
          return { gradeId: cls.gradeId, name: cls.name };
        })
        .filter(Boolean)
    )
  ).sort();

  // Calculate stats
  const totalClasses = allClasses.length;
  const totalStudents = allClasses.reduce(
    (sum, cls) => sum + (cls.classEnrollments?.length || 0),
    0
  );
  const averageClassSize =
    totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
  const myClasses = allClasses.length; // All classes are teacher's classes

  return (
    <div className='flex flex-1 flex-col space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Lớp Học Của Tôi</h2>
          <p className='text-muted-foreground'>
            Các lớp bạn được phân công giảng dạy
          </p>
        </div>
        <Button asChild variant='outline'>
          <Link href='/teacher' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Quay Lại Bảng Điều Khiển
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
        <Card className='@container/card'>
          <CardHeader>
            <CardDescription>Lớp Của Tôi</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {isLoading ? '...' : totalClasses}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                <BookOpen className='h-4 w-4' />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Lớp đang hoạt động <BookOpen className='size-4' />
            </div>
            <div className='text-muted-foreground'>Trên tất cả các khối</div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader>
            <CardDescription>Tổng Học Sinh</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {isLoading ? '...' : totalStudents}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                <Users className='h-4 w-4' />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Học sinh đã đăng ký <Users className='size-4' />
            </div>
            <div className='text-muted-foreground'>Tổng số học sinh</div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader>
            <CardDescription>Sĩ Số TB</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {isLoading ? '...' : averageClassSize}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                <TrendingUp className='h-4 w-4' />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Học sinh mỗi lớp <TrendingUp className='size-4' />
            </div>
            <div className='text-muted-foreground'>Sĩ số trung bình</div>
          </CardFooter>
        </Card>

        <Card className='@container/card'>
          <CardHeader>
            <CardDescription>Lớp Đang Dạy</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {isLoading ? '...' : myClasses}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                <Star className='h-4 w-4' />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              Lớp tôi dạy <Star className='size-4' />
            </div>
            <div className='text-muted-foreground'>Lớp được phân công</div>
          </CardFooter>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className='space-y-4'>
        <div className='flex flex-col gap-4 md:flex-row'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Tìm kiếm lớp học...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Class Ownership Filter */}
          <div className='flex gap-2'>
            <Button
              variant={showMyClassesOnly ? 'default' : 'outline'}
              onClick={() => setShowMyClassesOnly(!showMyClassesOnly)}
            >
              {showMyClassesOnly ? 'Hiện Tất Cả' : 'Chỉ Lớp Của Tôi'}
            </Button>
          </div>
        </div>

        {/* Grade Filter */}
        <div className='flex flex-wrap gap-2'>
          <span className='text-muted-foreground flex items-center text-sm font-medium'>
            Lọc theo Khối:
          </span>
          <Button
            variant={selectedGrade === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedGrade('all')}
            size='sm'
          >
            Tất Cả Khối
          </Button>
          {availableGrades.map(({ gradeId, name }) => (
            <Button
              key={gradeId}
              variant={selectedGrade === gradeId ? 'default' : 'outline'}
              onClick={() => setSelectedGrade(gradeId)}
              size='sm'
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground'>
            Hiển thị {filteredClasses.length} trong tổng số {totalClasses} lớp
          </p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredClasses.map((cls, index) => (
          <Card key={cls.id} className='@container/card'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg font-bold'>
                    {cls.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className='text-lg'>{cls.name}</CardTitle>
                    <CardDescription>Mã Khối: {cls.name}</CardDescription>
                  </div>
                </div>
                <Badge variant='secondary'>Lớp Của Tôi</Badge>
              </div>
            </CardHeader>

            <CardContent className='space-y-3'>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <Users className='h-4 w-4' />
                <span>
                  {cls.classEnrollments?.length || 0} học sinh đã đăng ký
                </span>
              </div>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <User className='h-4 w-4' />
                {/* <span>Giáo viên chủ nhiệm: {cls.homeroomTeacherId}</span> */}
              </div>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <MapPin className='h-4 w-4' />
                <span>Phân công: {cls.teacherAssignments?.length || 0}</span>
              </div>
            </CardContent>

            <CardFooter>
              <Button asChild className='w-full'>
                <Link href={`/teacher/classes/${cls.id}/roster`}>
                  <BookOpen className='mr-2 h-4 w-4' />
                  Xem Chi Tiết
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className='py-16 text-center'>
          <div className='bg-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
            <Search className='text-muted-foreground h-12 w-12' />
          </div>
          <h3 className='mb-2 text-xl font-semibold'>Không tìm thấy lớp học</h3>
          <p className='text-muted-foreground mb-6'>
            Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedGrade('all');
              setShowMyClassesOnly(false);
            }}
            variant='outline'
          >
            Xóa Bộ Lọc
          </Button>
        </div>
      )}
    </div>
  );
}
