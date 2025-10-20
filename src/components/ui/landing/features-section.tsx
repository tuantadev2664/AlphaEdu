'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Smartphone,
  Brain,
  BarChart3,
  Layout,
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Bell,
  Lock,
  MessageSquare,
  FileText,
  Calendar,
  Award
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Trợ lý AI thông minh',
    description: 'Công nghệ AI giúp tự động hóa và tối ưu quy trình giảng dạy',
    icon: Bot,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    items: [
      { icon: Zap, text: 'Nhận xét nhanh chóng' },
      { icon: TrendingUp, text: 'Gợi ý cải thiện cá nhân' },
      { icon: BarChart3, text: 'Thống kê học lực chi tiết' }
    ]
  },
  {
    title: 'Kết nối phụ huynh',
    description: 'Cầu nối giữa nhà trường và gia đình qua thông báo tức thì',
    icon: Smartphone,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    items: [
      { icon: Bell, text: 'Nhận thông báo tức thì' },
      { icon: MessageSquare, text: 'Giao tiếp trực tiếp giáo viên' },
      { icon: FileText, text: 'Theo dõi quá trình học tập' }
    ]
  },
  {
    title: 'Phân tích AI nâng cao',
    description: 'Đánh giá toàn diện và gợi ý lộ trình học tập cá nhân hóa',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    items: [
      { icon: BarChart3, text: 'Phân tích điểm số thông minh' },
      { icon: FileText, text: 'Gợi ý tài liệu phù hợp' },
      { icon: TrendingUp, text: 'Đề xuất lộ trình cải thiện' }
    ]
  },
  {
    title: 'Báo cáo học lực',
    description: 'Biểu đồ trực quan giúp theo dõi tiến độ học tập dễ dàng',
    icon: BarChart3,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    items: [
      { icon: TrendingUp, text: 'Biểu đồ tiến bộ theo thời gian' },
      { icon: Award, text: 'So sánh với lớp học' },
      { icon: Brain, text: 'Nhận diện xu hướng học tập' }
    ]
  },
  {
    title: 'Giao diện thân thiện',
    description: 'Thiết kế hiện đại, dễ sử dụng trên mọi thiết bị',
    icon: Layout,
    gradient: 'from-teal-500 to-blue-500',
    bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    items: [
      { icon: Layout, text: 'Giao diện trực quan, đẹp mắt' },
      { icon: Smartphone, text: 'Truy cập mọi lúc, mọi nơi' },
      { icon: Bell, text: 'Thông báo đẩy tức thì' }
    ]
  },
  {
    title: 'Bảo mật tối đa',
    description: 'Bảo vệ dữ liệu người dùng với công nghệ mã hóa hiện đại',
    icon: Shield,
    gradient: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    items: [
      { icon: Shield, text: 'Mã hóa dữ liệu đầu cuối' },
      { icon: Lock, text: 'Quyền riêng tư được đảm bảo' },
      { icon: FileText, text: 'Chính sách bảo mật minh bạch' }
    ]
  }
];

export function FeaturesSection() {
  return (
    <section id='features' className='relative overflow-hidden py-20 lg:py-32'>
      {/* Background Elements */}
      <div className='from-muted/30 via-background to-muted/30 absolute inset-0 bg-gradient-to-b' />
      <div className='absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl' />
      <div className='absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl' />

      <div className='relative z-10 container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <Badge
            variant='secondary'
            className='mb-4 inline-flex items-center gap-2'
          >
            <Sparkles className='h-4 w-4' />
            <span>Tính năng vượt trội</span>
          </Badge>
          <h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl'>
            <span className='block'>Tính năng</span>
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              mạnh mẽ và thông minh
            </span>
          </h2>
          <p className='text-muted-foreground mx-auto max-w-3xl text-lg sm:text-xl'>
            Khám phá những tính năng tiên tiến giúp kết nối giáo viên, học sinh
            và phụ huynh một cách hiệu quả nhất
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.bgColor}`}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                <CardHeader className='relative space-y-4 pb-4'>
                  {/* Icon */}
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <IconComponent className='h-7 w-7 text-white' />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <CardTitle className='mb-2 text-xl font-bold'>
                      {feature.title}
                    </CardTitle>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className='relative'>
                  {/* Feature Items */}
                  <ul className='space-y-3'>
                    {feature.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={itemIndex} className='flex items-start gap-3'>
                          <div className='mt-0.5 flex-shrink-0 rounded-md bg-green-500/10 p-1'>
                            <CheckCircle2 className='h-4 w-4 text-green-600' />
                          </div>
                          <div className='flex-1 space-y-1'>
                            <span className='text-foreground text-sm font-medium'>
                              {item.text}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features Banner */}
        <div className='mt-20'>
          <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 shadow-xl backdrop-blur-sm lg:p-12'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl' />

            <div className='relative z-10 mx-auto max-w-3xl text-center'>
              <div className='bg-background/80 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm'>
                <Sparkles className='h-4 w-4 text-yellow-500' />
                <span>Liên tục cập nhật</span>
              </div>
              <h3 className='mb-4 text-2xl font-bold sm:text-3xl'>
                Và còn nhiều tính năng khác
              </h3>
              <p className='text-muted-foreground mb-8 text-lg'>
                Chúng tôi không ngừng phát triển và cải tiến để mang đến trải
                nghiệm tốt nhất cho bạn
              </p>

              {/* Feature Tags */}
              <div className='mb-8 flex flex-wrap justify-center gap-2'>
                {[
                  'Lịch học thông minh',
                  'Video bài giảng',
                  'Thi trực tuyến',
                  'Diễn đàn thảo luận',
                  'Thư viện tài liệu',
                  'Gamification'
                ].map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant='secondary'
                    className='bg-background/60 backdrop-blur-sm'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <Button
                asChild
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700'
              >
                <Link href='/auth/sign-in'>
                  Trải nghiệm ngay
                  <Zap className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
