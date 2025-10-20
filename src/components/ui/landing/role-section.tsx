'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Bell,
  BarChart3,
  MessageSquare,
  Shield
} from 'lucide-react';
import Link from 'next/link';

const roles = [
  {
    title: 'Giáo Viên',
    description:
      'Quản lý lớp học hiệu quả với công cụ thông minh, theo dõi tiến độ học sinh và tạo bài giảng chất lượng cao.',
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-700',
    lightColor: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    features: [
      { icon: BookOpen, text: 'Quản lý bài giảng dễ dàng' },
      { icon: BarChart3, text: 'Phân tích học lực chi tiết' },
      { icon: MessageSquare, text: 'Giao tiếp phụ huynh nhanh' }
    ],
    cta: '/auth/sign-in?role=teacher'
  },
  {
    title: 'Học Sinh',
    description:
      'Học tập chủ động với lộ trình cá nhân hóa, nhận phản hồi tức thì và theo dõi tiến độ học tập của bản thân.',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-700',
    lightColor: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    features: [
      { icon: TrendingUp, text: 'Theo dõi tiến độ cá nhân' },
      { icon: Bell, text: 'Nhắc nhở bài tập, kiểm tra' },
      { icon: Sparkles, text: 'Gợi ý học tập từ AI' }
    ],
    cta: '/auth/sign-in?role=student'
  },
  {
    title: 'Phụ Huynh',
    description:
      'Đồng hành cùng con với thông tin học tập minh bạch, cảnh báo sớm và công cụ hỗ trợ hiệu quả.',
    icon: Users,
    color: 'from-orange-500 to-orange-700',
    lightColor: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    features: [
      { icon: Shield, text: 'Theo dõi an toàn, bảo mật' },
      { icon: Bell, text: 'Cảnh báo sớm học lực' },
      { icon: MessageSquare, text: 'Kết nối giáo viên dễ dàng' }
    ],
    cta: '/auth/sign-in?role=parent'
  }
];

export function RoleSection() {
  return (
    <section id='role' className='relative overflow-hidden py-20 lg:py-32'>
      {/* Background Elements */}
      <div className='from-background via-muted/30 to-background absolute inset-0 bg-gradient-to-b' />
      <div className='absolute top-10 left-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl' />
      <div className='absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl' />

      <div className='relative z-10 container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <Badge
            variant='secondary'
            className='mb-4 inline-flex items-center gap-2'
          >
            <Users className='h-4 w-4' />
            <span>Dành cho mọi đối tượng</span>
          </Badge>
          <h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl'>
            <span className='block'>Kết nối toàn diện</span>
            <span className='bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600 bg-clip-text text-transparent'>
              Giáo viên - Học sinh - Phụ huynh
            </span>
          </h2>
          <p className='text-muted-foreground mx-auto max-w-3xl text-lg sm:text-xl'>
            AlphaEdu mang đến giải pháp hoàn hảo cho từng đối tượng trong hệ
            sinh thái giáo dục, được hỗ trợ bởi công nghệ AI tiên tiến
          </p>
        </div>

        {/* Role Cards */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${role.bgColor}`}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.lightColor} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                <CardHeader className='relative space-y-4 pb-4'>
                  {/* Icon */}
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${role.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <IconComponent className='h-8 w-8 text-white' />
                  </div>

                  {/* Title */}
                  <CardTitle className='text-2xl font-bold'>
                    {role.title}
                  </CardTitle>

                  {/* Description */}
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {role.description}
                  </p>
                </CardHeader>

                <CardContent className='relative space-y-6'>
                  {/* Features */}
                  <div className='space-y-3'>
                    {role.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className='flex items-start gap-3'>
                          <div
                            className={`mt-0.5 flex-shrink-0 rounded-lg bg-gradient-to-br ${role.color} p-1.5`}
                          >
                            <FeatureIcon className='h-3.5 w-3.5 text-white' />
                          </div>
                          <span className='text-muted-foreground text-sm'>
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`group/btn w-full bg-gradient-to-r ${role.color} hover:shadow-lg`}
                  >
                    <Link href={role.cta}>
                      Khám phá ngay
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Connection Visualization */}
        <div className='relative mt-20 lg:mt-32'>
          <div className='bg-card/50 mx-auto max-w-4xl rounded-3xl border p-8 shadow-xl backdrop-blur-sm lg:p-12'>
            <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
              {/* Left: AI Visualization */}
              <div className='relative mx-auto'>
                <div className='relative h-64 w-64'>
                  {/* Central AI Circle */}
                  <div className='absolute top-1/2 left-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl'>
                    <div className='text-center'>
                      <Sparkles className='mx-auto h-10 w-10 text-white' />
                      <div className='mt-2 text-sm font-bold text-white'>
                        AI
                      </div>
                    </div>
                  </div>

                  {/* Orbiting circles */}
                  <div className='animate-spin-slow absolute inset-0'>
                    <div className='absolute top-1/2 left-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg'>
                      <GraduationCap className='h-6 w-6' />
                    </div>
                  </div>
                  <div
                    className='animate-spin-slow absolute inset-0'
                    style={{ animationDelay: '-5s' }}
                  >
                    <div className='absolute top-1/2 right-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg'>
                      <BookOpen className='h-6 w-6' />
                    </div>
                  </div>
                  <div
                    className='animate-spin-slow absolute inset-0'
                    style={{ animationDelay: '-10s' }}
                  >
                    <div className='absolute top-0 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg'>
                      <Users className='h-6 w-6' />
                    </div>
                  </div>

                  {/* Connection rings */}
                  <div className='border-muted-foreground/20 absolute inset-0 rounded-full border-2 border-dashed' />
                  <div className='border-muted-foreground/10 absolute inset-4 rounded-full border border-dashed' />
                </div>
              </div>

              {/* Right: Description */}
              <div className='space-y-6 text-center lg:text-left'>
                <div>
                  <h3 className='mb-3 text-2xl font-bold'>
                    Được hỗ trợ bởi AI thông minh
                  </h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    Công nghệ AI tiên tiến kết nối và hỗ trợ tất cả thành viên,
                    mang lại trải nghiệm học tập tốt nhất
                  </p>
                </div>

                <div className='space-y-3'>
                  {[
                    'Phân tích học lực tự động',
                    'Cảnh báo sớm và gợi ý cải thiện',
                    'Cá nhân hóa lộ trình học tập',
                    'Kết nối thông minh 24/7'
                  ].map((item, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-green-600' />
                      <span className='text-muted-foreground text-sm'>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
