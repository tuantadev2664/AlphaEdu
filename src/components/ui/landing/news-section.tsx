'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Mock data for news articles
const newsArticles = [
  {
    id: 1,
    title: 'AlphaEdu ra mắt tính năng AI phân tích học lực mới',
    description:
      'Công nghệ AI tiên tiến giúp phát hiện sớm những khó khăn trong học tập và đưa ra giải pháp cá nhân hóa.',
    category: 'Sự kiện',
    date: '15/12/2025',
    image: '/education-hero.svg',
    href: '#'
  },
  {
    id: 2,
    title: 'Hướng dẫn sử dụng sổ liên lạc điện tử hiệu quả',
    description:
      'Những mẹo và thủ thuật giúp phụ huynh và giáo viên tận dụng tối đa các tính năng của AlphaEdu.',
    category: 'Blog',
    date: '12/12/2025',
    image: '/education-hero.svg',
    href: '#'
  },
  {
    id: 3,
    title: 'Chính sách bảo mật dữ liệu học sinh được cập nhật',
    description:
      'AlphaEdu cam kết bảo vệ thông tin cá nhân và dữ liệu học tập của học sinh một cách tuyệt đối.',
    category: 'Thông báo',
    date: '10/12/2025',
    image: '/education-hero.svg',
    href: '#'
  }
];

const categoryColors = {
  'Sự kiện': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  Blog: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'Thông báo':
    'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
};

export function NewsSection() {
  return (
    <section id='news' className='bg-muted/30 py-20'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <h2 className='text-foreground mb-4 text-3xl font-bold md:text-4xl'>
            Tin tức
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Cập nhật những thông tin mới nhất về AlphaEdu và xu hướng giáo dục
            hiện đại
          </p>
        </div>

        {/* News Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {newsArticles.map((article) => (
            <Card
              key={article.id}
              className='group transform cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
            >
              {/* Article Image */}
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
                {/* Category Tag */}
                <div className='absolute top-4 left-4'>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[article.category as keyof typeof categoryColors]}`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              <CardHeader className='pb-2'>
                {/* Date */}
                <div className='text-muted-foreground mb-2 text-sm'>
                  {article.date}
                </div>

                {/* Title */}
                <h3 className='text-foreground group-hover:text-primary text-lg leading-tight font-bold transition-colors'>
                  {article.title}
                </h3>
              </CardHeader>

              <CardContent className='pt-0'>
                {/* Description */}
                <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                  {article.description}
                </p>

                {/* Read More Button */}
                <Button
                  variant='ghost'
                  className='text-primary hover:text-primary/80 h-auto p-0 font-semibold'
                >
                  Xem thêm →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All News Button */}
        <div className='mt-12 text-center'>
          <Button variant='outline' size='lg' className='px-8'>
            Xem tất cả tin tức
          </Button>
        </div>

        {/* Newsletter Subscription */}
        <div className='mt-16 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20'>
          <h3 className='text-foreground mb-4 text-2xl font-bold'>
            Đăng ký nhận tin tức
          </h3>
          <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
            Nhận những cập nhật mới nhất về tính năng và tin tức giáo dục qua
            email
          </p>
          <div className='mx-auto flex max-w-md flex-col gap-4 sm:flex-row'>
            <input
              type='email'
              placeholder='Nhập email của bạn'
              className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none'
            />
            <Button className='px-6'>Đăng ký</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
