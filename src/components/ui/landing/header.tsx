'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/landing', label: 'Trang chủ' },
  { href: '/landing/role', label: 'Kết nối' },
  { href: '/landing/feature', label: 'Tính năng' },
  { href: '/landing/news', label: 'Tin tức' }
];

export function LandingHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 border-b shadow-sm backdrop-blur-lg'
          : 'bg-background/80 border-b border-transparent backdrop-blur-md'
      )}
    >
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link
            href='/landing'
            className='flex items-center gap-3 transition-transform hover:scale-105'
          >
            <div className='relative'>
              <Image
                src='/Logo.png'
                alt='AlphaEdu Logo'
                width={40}
                height={40}
                className='rounded-lg'
              />
              <div className='absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity hover:opacity-100' />
            </div>
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'>
              AlphaEdu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-1 md:flex'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className='absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600' />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden items-center gap-3 md:flex'>
            {/* <Button variant='ghost' asChild>
              <Link href='/auth/sign-up'>Đăng ký</Link>
            </Button> */}
            <Button
              asChild
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            >
              <Link href='/auth/sign-in'>
                Đăng nhập
                <ChevronRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <div className='flex flex-col gap-6 py-6'>
                {/* Mobile Logo */}
                <Link
                  href='/landing'
                  className='flex items-center gap-3'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Image
                    src='/Logo.png'
                    alt='AlphaEdu Logo'
                    width={32}
                    height={32}
                    className='rounded-lg'
                  />
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent'>
                    AlphaEdu
                  </span>
                </Link>

                {/* Mobile Navigation */}
                <nav className='flex flex-col gap-1'>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {item.label}
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Actions */}
                <div className='flex flex-col gap-2 border-t pt-6'>
                  {/* <Button
                    variant='outline'
                    asChild
                    className='w-full'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href='/auth/sign-up'>Đăng ký</Link>
                  </Button> */}
                  <Button
                    asChild
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href='/auth/sign-in'>Đăng nhập</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
