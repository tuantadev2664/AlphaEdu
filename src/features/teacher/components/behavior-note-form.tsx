'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  RosterStudent,
  CreateBehaviorNoteForm,
  BehaviorLevel
} from '@/features/teacher/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const behaviorLevels: { label: string; value: BehaviorLevel }[] = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs Improvement', value: 'needs_improvement' },
  { label: 'Poor', value: 'poor' }
];

const formSchema = z.object({
  student_id: z.string().min(1, 'Please select a student'),
  level: z.enum(['excellent', 'good', 'fair', 'needs_improvement', 'poor']),
  note: z.string().min(10, 'Note must be at least 10 characters')
});

interface BehaviorNoteFormProps {
  students: RosterStudent[];
  classId: string;
  onClose: () => void;
  onSubmit: (data: CreateBehaviorNoteForm) => void;
}

export function BehaviorNoteForm({
  students,
  classId,
  onClose,
  onSubmit
}: BehaviorNoteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: '',
      level: 'good',
      note: ''
    }
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      student_id: values.student_id,
      class_id: classId,
      term_id: 'term-s1-2024', // This would come from context in real app
      note: values.note,
      level: values.level
    });
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Add Behavior Note</CardTitle>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormSelect
              control={form.control}
              name='student_id'
              label='Student'
              placeholder='Select a student'
              required
              options={students.map((student) => ({
                label: student.full_name,
                value: student.id
              }))}
            />

            <FormSelect
              control={form.control}
              name='level'
              label='Behavior Level'
              placeholder='Select behavior level'
              required
              options={behaviorLevels}
            />

            <FormTextarea
              control={form.control}
              name='note'
              label='Note'
              placeholder='Describe the behavior or incident...'
              required
              config={{
                maxLength: 500,
                showCharCount: true,
                rows: 4
              }}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>Save Note</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
