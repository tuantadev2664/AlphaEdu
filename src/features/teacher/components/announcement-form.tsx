'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSwitch } from '@/components/forms/form-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  TeacherAnnouncementItem,
  CreateAnnouncementForm
} from '@/features/teacher/types';
import {
  useCreateAnnouncement,
  useUpdateAnnouncement
} from '@/features/teacher/hooks/use-teacher.query';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  expiresAt: z.string().min(1, 'Expiration date is required'),
  isUrgent: z.boolean().default(false)
});

interface AnnouncementFormProps {
  classId: string;
  initialData?: TeacherAnnouncementItem | null;
  onClose: () => void;
  onSubmit: (data: CreateAnnouncementForm) => void;
}

export function AnnouncementForm({
  classId,
  initialData,
  onClose,
  onSubmit
}: AnnouncementFormProps) {
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isEditing = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      expiresAt: initialData?.expiresAt
        ? new Date(initialData.expiresAt).toISOString().slice(0, 16)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16),
      isUrgent: initialData?.isUrgent || false
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const announcementData = {
        title: values.title,
        content: values.content,
        classId: classId,
        expiresAt: new Date(values.expiresAt).toISOString(),
        isUrgent: values.isUrgent
      };

      if (isEditing && initialData) {
        // Update existing announcement
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...announcementData
        });

        toast.success('Announcement Updated', {
          description: 'Your announcement has been updated successfully.',
          duration: 3000
        });
      } else {
        // Create new announcement
        await createMutation.mutateAsync(announcementData);

        toast.success('Announcement Created', {
          description: 'Your announcement has been created successfully.',
          duration: 3000
        });
      }

      // Call the original onSubmit callback
      onSubmit(announcementData);

      // Close the form
      onClose();
    } catch (error: any) {
      toast.error(
        isEditing
          ? 'Failed to Update Announcement'
          : 'Failed to Create Announcement',
        {
          description:
            error.message || 'Something went wrong. Please try again.',
          duration: 3000
        }
      );
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <Card className='max-h-[90vh] w-full max-w-2xl overflow-y-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>
              {initialData ? 'Edit Announcement' : 'Create New Announcement'}
            </CardTitle>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <FormInput
              control={form.control}
              name='title'
              label='Title'
              placeholder='Enter announcement title'
              required
            />

            <FormTextarea
              control={form.control}
              name='content'
              label='Content'
              placeholder='Write your announcement content...'
              required
              config={{
                maxLength: 1000,
                showCharCount: true,
                rows: 6
              }}
            />

            <FormInput
              control={form.control}
              name='expiresAt'
              label='Expiration Date'
              // type='datetime-local'
              required
            />

            <FormSwitch
              control={form.control}
              name='isUrgent'
              label='Mark as Urgent'
              description='Urgent announcements will be highlighted and may send notifications'
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : (isEditing ? 'Update' : 'Create') + ' Announcement'}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
