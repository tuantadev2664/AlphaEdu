'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section id='contact' className='relative overflow-hidden py-20'>
      {/* Background with gradient and wave patterns */}
      <div className='absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600'>
        {/* Wave patterns */}
        <div className='absolute inset-0 opacity-20'>
          <svg
            className='absolute top-0 left-0 h-32 w-full'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,0 Z'
              fill='rgba(255,255,255,0.1)'
            />
          </svg>
          <svg
            className='absolute right-0 bottom-0 h-32 w-full'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M1200,120 C1050,20 850,120 600,70 C350,20 150,120 0,70 L0,120 Z'
              fill='rgba(255,255,255,0.1)'
            />
          </svg>
        </div>

        {/* Floating shapes */}
        <div className='absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/10'></div>
        <div className='absolute right-20 bottom-20 h-16 w-16 animate-bounce rounded-full bg-white/10'></div>
        <div className='absolute top-1/2 left-1/4 h-12 w-12 animate-ping rounded-full bg-white/10'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          {/* Main heading */}
          <h2 className='mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl'>
            Tham gia ngay hôm nay!
          </h2>

          {/* Subheading */}
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl'>
            Đừng bỏ lỡ cơ hội trải nghiệm sổ liên lạc điện tử thông minh.
            <br />
            Hãy đăng ký ngay để nhận ưu đãi đặc biệt!
          </p>

          {/* Special offer highlight */}
          <div className='mb-8 inline-flex animate-pulse items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg'>
            <span>🎉</span>
            <span>Miễn phí 30 ngày đầu tiên</span>
            <span>🎉</span>
          </div>

          {/* CTA Buttons */}
          <div className='mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              size='lg'
              className='transform bg-white px-8 py-4 text-lg font-bold text-black shadow-xl transition-all duration-200 hover:scale-105 hover:bg-gray-100'
              asChild
            >
              <Link href='/auth/sign-up'>🚀 Đăng ký ngay</Link>
            </Button>

            <Button
              size='lg'
              variant='outline'
              className='border-white px-8 py-4 text-lg font-bold text-white hover:bg-white hover:text-black'
              asChild
            >
              <Link href='/auth/sign-in'>📱 Đăng nhập</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className='grid grid-cols-2 gap-8 text-center text-white/80 md:grid-cols-4'>
            <div>
              <div className='text-3xl font-bold text-white'>10,000+</div>
              <div className='text-sm'>Học sinh</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-white'>500+</div>
              <div className='text-sm'>Giáo viên</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-white'>200+</div>
              <div className='text-sm'>Trường học</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-white'>99.9%</div>
              <div className='text-sm'>Uptime</div>
            </div>
          </div>

          {/* Security badges */}
          <div className='mt-12 flex flex-wrap items-center justify-center gap-6 text-white/70'>
            <div className='flex items-center gap-2'>
              <span>🔒</span>
              <span className='text-sm'>SSL Encrypted</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>🛡️</span>
              <span className='text-sm'>GDPR Compliant</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>✅</span>
              <span className='text-sm'>ISO 27001</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>⭐</span>
              <span className='text-sm'>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
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
