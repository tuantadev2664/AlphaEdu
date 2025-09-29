import { cn } from '@/lib/utils';

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('bg-background text-foreground min-h-screen')}>
      {children}
    </div>
  );
}
