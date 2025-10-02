'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  const scrollToFeatures = () => {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <section
      id='home'
      className='relative flex min-h-screen items-center overflow-hidden'
    >
      {/* Background with purple gradient and wave shapes */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800'>
        <div className='absolute inset-0 opacity-20'>
          <svg
            className='absolute bottom-0 left-0 h-64 w-full'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z'
              fill='rgba(255,255,255,0.1)'
            />
          </svg>
          <svg
            className='absolute top-0 right-0 h-64 w-full'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M1200,120 C1050,20 850,120 600,70 C350,20 150,120 0,70 L0,0 L1200,0 Z'
              fill='rgba(255,255,255,0.05)'
            />
          </svg>
        </div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-20'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Left Content */}
          <div className='text-center lg:text-left'>
            <h1 className='mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl'>
              Sổ liên lạc điện tử{' '}
              <span className='relative text-yellow-400'>
                thông minh
                <svg
                  className='absolute -bottom-2 left-0 h-3 w-full'
                  viewBox='0 0 100 10'
                  preserveAspectRatio='none'
                >
                  <path
                    d='M0,8 Q25,2 50,6 T100,4'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                  />
                </svg>
              </span>{' '}
              với AI
            </h1>

            <p className='mb-8 text-lg leading-relaxed text-purple-100 md:text-xl'>
              Kết nối giáo viên và phụ huynh thông qua công nghệ AI tiên tiến.
              Theo dõi học lực, nhận cảnh báo sớm và gợi ý cải thiện cá nhân
              hóa.
            </p>

            <div className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
              <Button
                size='lg'
                className='bg-yellow-500 px-8 py-3 text-lg font-semibold text-white hover:bg-yellow-600'
                asChild
              >
                <Link href='/auth/sign-up'>🚀 Dùng thử miễn phí</Link>
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='border-white px-8 py-3 text-lg font-semibold text-purple-500 hover:bg-white hover:text-purple-700'
                onClick={scrollToFeatures}
              >
                📖 Tìm hiểu thêm
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className='flex justify-center lg:justify-end'>
            <div className='relative'>
              {/* Phone mockup background */}
              <div className='rotate-3 transform rounded-3xl bg-white p-6 shadow-2xl transition-transform duration-300 hover:rotate-0'>
                <div className='h-96 w-64 rounded-2xl bg-gradient-to-b from-purple-50 to-white p-4'>
                  {/* Phone screen content */}
                  <div className='space-y-4'>
                    {/* Header */}
                    <div className='flex items-center justify-between rounded-xl bg-purple-600 p-3 text-white'>
                      <span className='font-semibold'>AlphaEdu</span>
                      <div className='h-2 w-2 rounded-full bg-green-400'></div>
                    </div>

                    {/* Alert notification */}
                    <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-red-500'>⚠️</span>
                        <span className='text-sm font-semibold text-red-700'>
                          Cảnh báo học lực
                        </span>
                      </div>
                      <p className='text-xs text-red-600'>
                        Điểm Toán của Minh đã giảm 15% trong tuần qua
                      </p>
                    </div>

                    {/* Calendar */}
                    <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-blue-500'>📅</span>
                        <span className='text-sm font-semibold text-blue-700'>
                          Lịch kiểm tra
                        </span>
                      </div>
                      <div className='space-y-1'>
                        <div className='text-xs text-blue-600'>
                          Thứ 3: Kiểm tra Văn
                        </div>
                        <div className='text-xs text-blue-600'>
                          Thứ 5: Kiểm tra Anh
                        </div>
                      </div>
                    </div>

                    {/* Progress chart */}
                    <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-green-500'>📊</span>
                        <span className='text-sm font-semibold text-green-700'>
                          Tiến độ học tập
                        </span>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-xs'>
                          <span>Toán</span>
                          <span>85%</span>
                        </div>
                        <div className='h-1 w-full rounded-full bg-green-200'>
                          <div className='h-1 w-4/5 rounded-full bg-green-500'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className='absolute -top-4 -right-4 animate-bounce rounded-full bg-yellow-400 p-2 text-black'>
                🤖
              </div>
              <div className='absolute -bottom-4 -left-4 animate-pulse rounded-full bg-green-400 p-2 text-white'>
                ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className='absolute bottom-0 left-0 w-full'>
        <svg
          className='h-20 w-full'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z'
            fill='hsl(var(--background))'
          />
        </svg>
      </div>
    </section>
  );
}
