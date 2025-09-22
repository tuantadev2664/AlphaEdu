'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { Class } from '@/features/teacher/types';

interface ClassHeaderProps {
  classData: Class;
}

export function ClassHeader({ classData }: ClassHeaderProps) {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
              <GraduationCap className='text-primary h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>{classData.name}</h1>
              <div className='text-muted-foreground flex items-center gap-2'>
                <span>Grade {classData.grade?.grade_number}</span>
                <span>•</span>
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  <span>{classData.student_count} students</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>
              {classData.grade?.level.replace('_', ' ')}
            </Badge>
            <Button variant='outline' size='sm'>
              <BookOpen className='mr-2 h-4 w-4' />
              Class Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
