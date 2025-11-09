'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Sparkles,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Play,
  CheckCircle2
} from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Học sinh' },
  { value: '500+', label: 'Trường học' },
  { value: '98%', label: 'Hài lòng' },
  { value: '24/7', label: 'Hỗ trợ' }
];

const features = [
  'Theo dõi học lực thời gian thực',
  'Phân tích AI thông minh',
  'Cảnh báo sớm tự động'
];

export function HeroSection() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className='relative min-h-screen overflow-hidden pt-16'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950'>
        {/* Animated gradient orbs */}
        <div className='animate-blob absolute top-1/4 -left-4 h-96 w-96 rounded-full bg-purple-300 opacity-30 mix-blend-multiply blur-3xl filter dark:opacity-20' />
        <div className='animation-delay-2000 animate-blob absolute top-1/3 right-4 h-96 w-96 rounded-full bg-blue-300 opacity-30 mix-blend-multiply blur-3xl filter dark:opacity-20' />
        <div className='animation-delay-4000 animate-blob absolute -bottom-8 left-20 h-96 w-96 rounded-full bg-pink-300 opacity-30 mix-blend-multiply blur-3xl filter dark:opacity-20' />
      </div>

      {/* Grid pattern overlay */}
      <div className='absolute inset-0 bg-[url("/grid.svg")] bg-center opacity-10' />

      {/* Main Content */}
      <div className='relative z-10 container mx-auto px-4 py-12 sm:py-20 lg:py-24'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-8'>
          {/* Left Content */}
          <div className='space-y-8 text-center lg:text-left'>
            {/* Badge */}
            <Badge
              variant='secondary'
              className='inline-flex items-center gap-2 px-4 py-2 text-sm'
            >
              <Sparkles className='h-4 w-4 text-purple-600' />
              <span>Công nghệ AI mới nhất 2024</span>
            </Badge>

            {/* Heading */}
            <h1 className='text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
              <span className='block'>Sổ liên lạc điện tử</span>
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                thông minh với AI
              </span>
            </h1>

            {/* Description */}
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl lg:mx-0'>
              Kết nối liền mạch giữa giáo viên, học sinh và phụ huynh. Theo dõi
              học lực, phân tích tiến độ và nhận cảnh báo sớm với công nghệ AI
              tiên tiến.
            </p>

            {/* Features list */}
            <ul className='space-y-3 text-left'>
              {features.map((feature, index) => (
                <li key={index} className='flex items-center gap-3'>
                  <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-green-600' />
                  <span className='text-muted-foreground'>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
              <Button
                size='lg'
                asChild
                className='group bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 hover:from-blue-700 hover:to-purple-700'
              >
                <Link href='/auth/sign-in'>
                  Bắt đầu ngay
                  <ChevronRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='group border-2'
                onClick={() => setIsDemoOpen(true)}
              >
                <Link href='#demo'>
                  <div className='flex items-center gap-2'>
                    <Play className='mr-2 h-4 w-4' />
                    <span>Xem demo</span>
                  </div>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center lg:text-left'>
                  <div className='text-foreground text-2xl font-bold sm:text-3xl'>
                    {stat.value}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Floating Cards */}
          <div className='relative mx-auto w-full max-w-lg lg:max-w-none'>
            <div className='relative aspect-square min-h-[400px] sm:min-h-[500px]'>
              {/* Main Dashboard Card */}
              <div className='animate-float absolute top-4/5 left-3/4 z-20 w-full max-w-[300px] -translate-x-1/2 -translate-y-3/4 transform px-4 sm:left-4/5 sm:w-4/5 sm:max-w-[500px] sm:px-0'>
                <div className='bg-card rounded-2xl border p-4 shadow-2xl backdrop-blur-sm sm:p-6'>
                  <div className='mb-3 flex items-center justify-between sm:mb-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 sm:h-10 sm:w-10' />
                      <div>
                        <div className='text-sm font-semibold sm:text-base'>
                          Nguyễn Minh An
                        </div>
                        <div className='text-muted-foreground text-xs'>
                          Lớp 10A1
                        </div>
                      </div>
                    </div>
                    <Badge className='bg-green-500/10 text-xs text-green-700 hover:bg-green-500/20 sm:text-sm'>
                      Xuất sắc
                    </Badge>
                  </div>

                  <div className='space-y-2 sm:space-y-3'>
                    <div className='flex justify-between text-xs sm:text-sm'>
                      <span className='text-muted-foreground'>Toán học</span>
                      <span className='font-semibold text-blue-600'>9.5</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div className='h-full w-[95%] rounded-full bg-gradient-to-r from-blue-600 to-purple-600' />
                    </div>

                    <div className='flex justify-between text-xs sm:text-sm'>
                      <span className='text-muted-foreground'>Văn học</span>
                      <span className='font-semibold text-purple-600'>9.0</span>
                    </div>
                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                      <div className='h-full w-[90%] rounded-full bg-gradient-to-r from-purple-600 to-pink-600' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 1 - AI Alert */}
              <div className='animation-delay-1000 animate-float-slow absolute top-4 left-0 z-10 w-[45%] sm:top-10 sm:w-2/5'>
                <div className='bg-card/80 rounded-lg border p-3 shadow-xl backdrop-blur-sm sm:rounded-xl sm:p-4'>
                  <div className='mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2'>
                    <TrendingUp className='h-4 w-4 text-green-600 sm:h-5 sm:w-5' />
                    <span className='text-[10px] font-semibold sm:text-xs'>
                      Cải thiện
                    </span>
                  </div>
                  <p className='text-muted-foreground text-[10px] leading-tight sm:text-xs'>
                    Điểm Anh văn tăng 12%
                  </p>
                </div>
              </div>

              {/* Floating Card 2 - Attendance */}
              <div className='animation-delay-2000 animate-float-slow absolute top-12 right-0 z-10 w-[45%] sm:top-20 sm:w-2/5'>
                <div className='bg-card/80 rounded-lg border p-3 shadow-xl backdrop-blur-sm sm:rounded-xl sm:p-4'>
                  <div className='mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2'>
                    <Users className='h-4 w-4 text-blue-600 sm:h-5 sm:w-5' />
                    <span className='text-[10px] font-semibold sm:text-xs'>
                      Điểm danh
                    </span>
                  </div>
                  <p className='text-muted-foreground text-[10px] leading-tight sm:text-xs'>
                    100% tháng này
                  </p>
                </div>
              </div>

              {/* Floating Card 3 - Achievement */}
              <div className='animation-delay-3000 animate-float-slow absolute right-0 bottom-4 z-10 w-[45%] sm:right-4 sm:bottom-10 sm:w-2/5'>
                <div className='bg-card/80 rounded-lg border p-3 shadow-xl backdrop-blur-sm sm:rounded-xl sm:p-4'>
                  <div className='mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2'>
                    <Award className='h-4 w-4 text-yellow-600 sm:h-5 sm:w-5' />
                    <span className='text-[10px] font-semibold sm:text-xs'>
                      Thành tích
                    </span>
                  </div>
                  <p className='text-muted-foreground text-[10px] leading-tight sm:text-xs'>
                    Học sinh xuất sắc Q1
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className='absolute -top-4 -left-4 h-16 w-16 rounded-full bg-blue-500 opacity-20 blur-2xl sm:h-24 sm:w-24' />
              <div className='absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-purple-500 opacity-20 blur-2xl sm:h-24 sm:w-24' />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className='absolute right-0 bottom-0 left-0'>
        <svg
          className='h-16 w-full sm:h-20 lg:h-24'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z'
            className='fill-background'
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Demo Dialog */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Demo Sổ liên lạc điện tử</DialogTitle>
            <DialogDescription>
              Xem hướng dẫn sử dụng hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center py-4'>
            <img
              src='/1025.gif'
              alt='Demo video'
              className='max-h-[70vh] w-auto rounded-lg'
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
