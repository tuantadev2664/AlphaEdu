'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function LandingHeader() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };
  return (
    <header className='bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-3'>
            <Image
              src='/Logo.png'
              alt='AlphaEdu Logo'
              width={40}
              height={40}
              className='rounded-lg'
            />
            <span className='text-foreground text-xl font-bold'>
              <Link href='#'>AlphaEdu</Link>
            </span>
          </div>

          {/* Navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            <Link
              href='/landing'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Trang chủ
            </Link>
            <Link
              href='/landing/role'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Kết nối
            </Link>
            <Link
              href='/landing/feature'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Tính năng
            </Link>
            <Link
              href='/landing/news'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Tin tức
            </Link>
            {/* <Link
              href='/landing/contact'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Liên hệ
            </Link> */}
          </nav>

          {/* Login Button */}
          <Button asChild>
            <Link href='/auth/sign-in'>Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
