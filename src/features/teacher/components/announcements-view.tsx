'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreateAnnouncementForm,
  TeacherAnnouncementItem
} from '@/features/teacher/types';
import {
  Plus,
  Bell,
  Calendar,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { useState } from 'react';
import { AnnouncementForm } from './announcement-form';
import { toast } from 'sonner';
import {
  useCurrentClassAnnouncements,
  useDeleteAnnouncement
} from '@/features/teacher/hooks/use-teacher.query';

interface AnnouncementsViewProps {
  classId: string;
}

export function AnnouncementsView({ classId }: AnnouncementsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<TeacherAnnouncementItem | null>(null);

  const { data: announcements, isLoading } =
    useCurrentClassAnnouncements(classId);
  const deleteMutation = useDeleteAnnouncement();

  const activeAnnouncements = (announcements || []).filter((a) => {
    if (!a.expiresAt) return true; // No expiry means still active
    return isAfter(new Date(a.expiresAt), new Date());
  });

  const expiredAnnouncements = (announcements || []).filter((a) => {
    if (!a.expiresAt) return false; // No expiry means not expired
    return !isAfter(new Date(a.expiresAt), new Date());
  });

  const handleSubmit = (data: CreateAnnouncementForm) => {
    console.log('Announcement submitted:', data);
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const handleDelete = async (announcementId: string) => {
    try {
      await deleteMutation.mutateAsync(announcementId);
      toast.success('Announcement Deleted', {
        description: 'The announcement has been deleted successfully.',
        duration: 3000
      });
    } catch (error: any) {
      toast.error('Failed to Delete Announcement', {
        description: error.message || 'Something went wrong. Please try again.',
        duration: 3000
      });
    }
  };

  return (
    <div className='space-y-6 pb-36'>
      {/* Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Badge variant='outline' className='text-sm'>
            {activeAnnouncements.length} hoạt động
          </Badge>
          <Badge variant='secondary' className='text-sm'>
            {expiredAnnouncements.length} hết hạn
          </Badge>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Thêm Thông Báo
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>Đang tải thông báo...</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcement Form Modal */}
      {(showForm || editingAnnouncement) && (
        <AnnouncementForm
          classId={classId}
          initialData={editingAnnouncement}
          onClose={() => {
            setShowForm(false);
            setEditingAnnouncement(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Active Announcements */}
      {!isLoading && activeAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5' />
              Thông Báo Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {activeAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={() => setEditingAnnouncement(announcement)}
                  onDelete={() => handleDelete(announcement.id)}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Announcements */}
      {!isLoading && expiredAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Thông Báo Hết Hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {expiredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isExpired
                  onEdit={() => setEditingAnnouncement(announcement)}
                  onDelete={() => handleDelete(announcement.id)}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && (announcements || []).length === 0 && (
        <Card>
          <CardContent className='pt-6'>
            <div className='text-muted-foreground py-8 text-center'>
              <Bell className='mx-auto mb-4 h-12 w-12 opacity-50' />
              <h3 className='mb-2 font-medium'>Không có thông báo nào</h3>
              <p className='mb-4 text-sm'>
                Tạo thông báo đầu tiên để liên hệ với học sinh và phụ huynh.
                parents.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Tạo Thông Báo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: TeacherAnnouncementItem;
  isExpired?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

function AnnouncementCard({
  announcement,
  isExpired = false,
  onEdit,
  onDelete,
  isDeleting = false
}: AnnouncementCardProps) {
  return (
    <div className={`rounded-lg border p-4 ${isExpired ? 'opacity-60' : ''}`}>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <h4 className='font-medium'>{announcement.title}</h4>
            {announcement.isUrgent && (
              <Badge variant='destructive' className='flex items-center gap-1'>
                <AlertTriangle className='h-3 w-3' />
                Gấp
              </Badge>
            )}
            {isExpired && <Badge variant='secondary'>Hết Hạn</Badge>}
          </div>

          <p className='text-muted-foreground text-sm'>
            {announcement.content}
          </p>

          <div className='text-muted-foreground flex items-center gap-4 text-xs'>
            <span>
              Created:{' '}
              {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
            </span>
            {announcement.expiresAt && (
              <span>
                Expires:{' '}
                {format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}
              </span>
            )}
            {!announcement.expiresAt && (
              <span className='text-green-600'>Không hết hạn</span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onEdit}
            disabled={isDeleting}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={onDelete}
            disabled={isDeleting}
            className='text-destructive hover:text-destructive'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
