'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Newspaper,
  Mail,
  Send,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

// Mock data for news articles
const newsArticles = [
  {
    id: 1,
    title: 'AlphaEdu ra mắt tính năng AI phân tích học lực mới',
    description:
      'Công nghệ AI tiên tiến giúp phát hiện sớm những khó khăn trong học tập và đưa ra giải pháp cá nhân hóa cho từng học sinh.',
    category: 'Sự kiện',
    date: '15/12/2025',
    readTime: '5 phút đọc',
    image: '/education-hero.svg',
    href: '#',
    featured: true
  },
  {
    id: 2,
    title: 'Hướng dẫn sử dụng sổ liên lạc điện tử hiệu quả',
    description:
      'Những mẹo và thủ thuật giúp phụ huynh và giáo viên tận dụng tối đa các tính năng của AlphaEdu trong quá trình theo dõi học tập.',
    category: 'Blog',
    date: '12/12/2025',
    readTime: '8 phút đọc',
    image: '/education-hero.svg',
    href: '#',
    featured: false
  },
  {
    id: 3,
    title: 'Chính sách bảo mật dữ liệu học sinh được cập nhật',
    description:
      'AlphaEdu cam kết bảo vệ thông tin cá nhân và dữ liệu học tập của học sinh một cách tuyệt đối với công nghệ mã hóa hiện đại.',
    category: 'Thông báo',
    date: '10/12/2025',
    readTime: '3 phút đọc',
    image: '/education-hero.svg',
    href: '#',
    featured: false
  }
];

const categoryConfig = {
  'Sự kiện': {
    color: 'bg-blue-500',
    lightBg: 'bg-blue-500/10',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  Blog: {
    color: 'bg-green-500',
    lightBg: 'bg-green-500/10',
    textColor: 'text-green-700 dark:text-green-300'
  },
  'Thông báo': {
    color: 'bg-orange-500',
    lightBg: 'bg-orange-500/10',
    textColor: 'text-orange-700 dark:text-orange-300'
  }
};

export function NewsSection() {
  return (
    <section id='news' className='relative overflow-hidden py-20 lg:py-32'>
      {/* Background Elements */}
      <div className='from-background via-muted/30 to-background absolute inset-0 bg-gradient-to-b' />
      <div className='absolute top-20 left-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl' />
      <div className='absolute right-0 bottom-20 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl' />

      <div className='relative z-10 container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <Badge
            variant='secondary'
            className='mb-4 inline-flex items-center gap-2'
          >
            <Newspaper className='h-4 w-4' />
            <span>Cập nhật mới nhất</span>
          </Badge>
          <h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl'>
            <span className='block'>Tin tức &</span>
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Xu hướng giáo dục
            </span>
          </h2>
          <p className='text-muted-foreground mx-auto max-w-3xl text-lg sm:text-xl'>
            Cập nhật những thông tin mới nhất về AlphaEdu và xu hướng công nghệ
            giáo dục hiện đại
          </p>
        </div>

        {/* News Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {newsArticles.map((article) => {
            const config =
              categoryConfig[article.category as keyof typeof categoryConfig];
            return (
              <Card
                key={article.id}
                className='group relative overflow-hidden border-2 !pt-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
              >
                {/* Featured Badge */}
                {article.featured && (
                  <div className='absolute top-4 right-4 z-10'>
                    <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'>
                      <Sparkles className='mr-1 h-3 w-3' />
                      Nổi bật
                    </Badge>
                  </div>
                )}

                {/* Article Image */}
                <div className='relative h-64 overflow-hidden'>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

                  {/* Category Tag */}
                  <div className='absolute bottom-4 left-4'>
                    <Badge
                      className={`${config.color} border-0 text-white shadow-lg`}
                    >
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className='space-y-3 pb-4'>
                  {/* Date & Read Time */}
                  <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                    <div className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5' />
                      <span>{article.date}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Clock className='h-3.5 w-3.5' />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className='group-hover:text-primary line-clamp-2 text-xl leading-tight font-bold transition-colors'>
                    {article.title}
                  </h3>
                </CardHeader>

                <CardContent className='space-y-4 pt-0'>
                  {/* Description */}
                  <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
                    {article.description}
                  </p>

                  {/* Read More Button */}
                  <Button
                    variant='ghost'
                    className='group/btn text-primary hover:text-primary/80 h-auto p-0 font-semibold'
                    asChild
                  >
                    <Link href={article.href}>
                      Đọc thêm
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All News Button */}
        <div className='mt-12 text-center'>
          <Button
            variant='outline'
            size='lg'
            className='group border-2 px-8'
            asChild
          >
            <Link href='#'>
              Xem tất cả tin tức
              <TrendingUp className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
        </div>

        {/* Newsletter Subscription */}
        <div className='mt-20'>
          <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 shadow-xl backdrop-blur-sm lg:p-12'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl' />

            <div className='relative z-10 mx-auto max-w-2xl text-center'>
              {/* Icon */}
              <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'>
                <Mail className='h-8 w-8 text-white' />
              </div>

              {/* Title & Description */}
              <h3 className='mb-3 text-2xl font-bold sm:text-3xl'>
                Đăng ký nhận tin tức
              </h3>
              <p className='text-muted-foreground mb-8 text-lg'>
                Nhận những cập nhật mới nhất về tính năng và xu hướng giáo dục
                qua email
              </p>

              {/* Email Form */}
              <div className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'>
                <div className='relative flex-1'>
                  <Mail className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
                  <Input
                    type='email'
                    placeholder='Nhập email của bạn'
                    className='h-12 border-2 pl-10'
                  />
                </div>
                <Button
                  size='lg'
                  className='h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:px-8'
                >
                  <Send className='mr-2 h-4 w-4' />
                  Đăng ký
                </Button>
              </div>

              {/* Privacy Note */}
              <p className='text-muted-foreground mt-4 text-xs'>
                Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ
                lúc nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
