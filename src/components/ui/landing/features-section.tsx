'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Giáo viên thông minh',
    items: ['Nhận xét nhanh chóng', 'Gợi ý cải thiện', 'Thống kê học lực'],
    icon: '🤖',
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    title: 'Phụ huynh kết nối',
    items: [
      'Nhận thông báo tức thì',
      'Tham gia vào quá trình học tập',
      'Giao tiếp trực tiếp với giáo viên'
    ],
    icon: '📱',
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    title: 'AI hỗ trợ',
    items: [
      'Phân tích điểm số',
      'Gợi ý tài liệu học tập',
      'Đề xuất lộ trình học'
    ],
    icon: '🧠',
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    title: 'Phân tích học lực',
    items: [
      'Biểu đồ tiến bộ',
      'So sánh với bạn bè',
      'Nhận diện xu hướng học tập'
    ],
    icon: '📊',
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  {
    title: 'Ứng dụng thân thiện',
    items: [
      'Giao diện trực quan',
      'Truy cập mọi lúc, mọi nơi',
      'Thông báo tức thì'
    ],
    icon: '📲',
    gradient: 'from-teal-500 to-blue-500',
    bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    borderColor: 'border-teal-200 dark:border-teal-800'
  },
  {
    title: 'Bảo mật thông tin',
    items: [
      'Chính sách bảo mật rõ ràng',
      'Quyền riêng tư người dùng',
      'Dữ liệu được mã hóa'
    ],
    icon: '🔒',
    gradient: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  }
];

export function FeaturesSection() {
  return (
    <section id='features' className='bg-background py-20'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <h2 className='text-foreground mb-4 text-3xl font-bold md:text-4xl'>
            Tính năng nổi bật
          </h2>
          <p className='text-muted-foreground mx-auto max-w-3xl text-lg'>
            Khám phá những tính năng giúp kết nối giáo viên và phụ huynh hiệu
            quả nhất
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <CardHeader className='pb-4 text-center'>
                {/* Icon with gradient background */}
                <div
                  className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <CardTitle className='text-foreground text-lg font-bold'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className='flex items-start gap-2'>
                      <span className='mt-1 flex-shrink-0 text-green-500'>
                        ✓
                      </span>
                      <span className='text-muted-foreground text-sm leading-relaxed'>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg'>
            <span>🚀</span>
            <span>Và còn nhiều tính năng khác đang phát triển...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
