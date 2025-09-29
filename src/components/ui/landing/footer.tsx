'use client';

import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { name: 'Pricing', href: '#' },
  { name: 'Jobs', href: '#' },
  { name: 'Employer', href: '#' },
  { name: 'Careers', href: '#' },
  { name: 'Contact Us', href: '#' }
];

const otherLinks = [
  { name: 'How it works', href: '#' },
  { name: 'Terms & Conditions', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'About Us', href: '#' }
];

const aboutLinks = [
  { name: 'Company milestone', href: '#' },
  { name: 'Web mail', href: '#' },
  { name: 'Board of Directors', href: '#' },
  { name: 'Senior Management', href: '#' }
];

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.418-3.323C6.001 8.218 7.152 7.728 8.449 7.728s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.875-2.026 1.365-3.323 1.365zm7.138 0c-1.297 0-2.448-.49-3.323-1.297-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.875-2.026 1.365-3.323 1.365z' />
      </svg>
    )
  },
  {
    name: 'Telegram',
    href: '#',
    icon: (
      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' />
      </svg>
    )
  },
  {
    name: 'TikTok',
    href: '#',
    icon: (
      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
      </svg>
    )
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
      </svg>
    )
  }
];

export function Footer() {
  return (
    <footer className='bg-muted/50 border-t'>
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='mb-6 flex items-center gap-3'>
              <Image
                src='/Logo.png'
                alt='AlphaEdu Logo'
                width={40}
                height={40}
                className='rounded-lg'
              />
              <span className='text-foreground text-2xl font-bold'>
                AlphaEdu
              </span>
            </div>
            <p className='text-muted-foreground mb-6 max-w-md'>
              Sổ liên lạc điện tử thông minh với AI, kết nối giáo viên và phụ
              huynh để hỗ trợ học sinh phát triển toàn diện.
            </p>

            {/* Social Links */}
            <div className='flex gap-4'>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className='bg-muted hover:bg-primary hover:text-primary-foreground flex h-10 w-10 transform items-center justify-center rounded-lg transition-all duration-200 hover:scale-110'
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-foreground mb-4 font-semibold'>Quick Links</h3>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Others */}
          <div>
            <h3 className='text-foreground mb-4 font-semibold'>Others</h3>
            <ul className='space-y-3'>
              {otherLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className='text-foreground mb-4 font-semibold'>About us</h3>
            <ul className='space-y-3'>
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row'>
          <div className='text-muted-foreground text-sm'>
            ©2025 AlphaEdu – All rights reserved
          </div>

          <div className='flex flex-wrap gap-4 text-sm'>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground'
            >
              Terms of Service
            </Link>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground'
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                        <span>🇻🇳</span>
                        <span>Made with ❤️ in Vietnam</span>
                        <span>•</span>
                        <span>Powered by AI Technology</span>
                    </div>
                </div> */}
      </div>
    </footer>
  );
}
