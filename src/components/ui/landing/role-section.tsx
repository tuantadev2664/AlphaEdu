'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const roles = [
  {
    title: 'Giáo Viên',
    description:
      'Hệ thống quản lý học tập cung cấp tài nguyên giảng dạy chất lượng, phản hồi kịp thời để hỗ trợ học sinh và gia đình.',
    icon: '👩‍🏫',
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    title: 'Học Sinh',
    description:
      'Giúp học sinh chủ động tham gia học tập, theo dõi tiến độ, tiếp nhận phản hồi từ giáo viên và phụ huynh.',
    icon: '👨‍🎓',
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    title: 'Phụ Huynh',
    description:
      'Theo dõi quá trình học tập của con, nhận cảnh báo sớm, phối hợp với giáo viên để hỗ trợ con tiến bộ.',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-orange-500 to-orange-700',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  }
];

export function RoleSection() {
  return (
    <section id='role' className='bg-muted/30 py-20'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <h2 className='text-foreground mb-4 text-3xl font-bold md:text-4xl'>
            Kết nối giáo viên, phụ huynh và học sinh
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            AlphaEdu mang đến giải pháp toàn diện cho mọi thành viên trong hệ
            thống giáo dục
          </p>
        </div>

        {/* Role Cards */}
        <div className='grid gap-8 md:grid-cols-3'>
          {roles.map((role, index) => (
            <Card
              key={index}
              className={`${role.bgColor} ${role.borderColor} group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
            >
              <CardHeader className='text-center'>
                {/* Icon with gradient background */}
                <div
                  className={`mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {role.icon}
                </div>
                <CardTitle className='text-foreground text-xl font-bold'>
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-muted-foreground leading-relaxed'>
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Lines Visualization */}
        <div className='relative mt-16'>
          <div className='flex justify-center'>
            <div className='relative'>
              {/* Central hub */}
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg'>
                AI
              </div>

              {/* Connection lines */}
              <svg className='absolute -top-8 -left-8 -z-10 h-32 w-32'>
                <defs>
                  <linearGradient
                    id='connectionGradient'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='100%'
                  >
                    <stop offset='0%' stopColor='rgb(168, 85, 247)' />
                    <stop offset='100%' stopColor='rgb(59, 130, 246)' />
                  </linearGradient>
                </defs>
                <circle
                  cx='64'
                  cy='64'
                  r='50'
                  fill='none'
                  stroke='url(#connectionGradient)'
                  strokeWidth='2'
                  strokeDasharray='5,5'
                  className='animate-spin'
                  style={{ animationDuration: '20s' }}
                />
              </svg>
            </div>
          </div>

          <p className='text-muted-foreground mt-4 text-center text-sm'>
            AI kết nối và hỗ trợ tất cả các thành viên trong hệ sinh thái giáo
            dục
          </p>
        </div>
      </div>
    </section>
  );
}
