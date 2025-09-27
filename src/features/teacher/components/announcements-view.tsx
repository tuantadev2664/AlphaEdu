'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Announcement, CreateAnnouncementForm } from '@/features/teacher/types';
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

interface AnnouncementsViewProps {
  announcements: Announcement[];
  classId: string;
}

export function AnnouncementsView({
  announcements,
  classId
}: AnnouncementsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const activeAnnouncements = announcements.filter((a) =>
    isAfter(new Date(a.expires_at), new Date())
  );

  const expiredAnnouncements = announcements.filter(
    (a) => !isAfter(new Date(a.expires_at), new Date())
  );

  const handleSubmit = (data: CreateAnnouncementForm) => {
    console.log('Announcement submitted:', data);
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  return (
    <div className='space-y-6 pb-36'>
      {/* Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Badge variant='outline' className='text-sm'>
            {activeAnnouncements.length} active
          </Badge>
          <Badge variant='secondary' className='text-sm'>
            {expiredAnnouncements.length} expired
          </Badge>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus className='mr-2 h-4 w-4' />
          New Announcement
        </Button>
      </div>

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
      {activeAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5' />
              Active Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {activeAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={() => setEditingAnnouncement(announcement)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Announcements */}
      {expiredAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Past Announcements
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
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {announcements.length === 0 && (
        <Card>
          <CardContent className='pt-6'>
            <div className='text-muted-foreground py-8 text-center'>
              <Bell className='mx-auto mb-4 h-12 w-12 opacity-50' />
              <h3 className='mb-2 font-medium'>No announcements yet</h3>
              <p className='mb-4 text-sm'>
                Create your first announcement to communicate with students and
                parents.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Create Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
  isExpired?: boolean;
  onEdit: () => void;
}

function AnnouncementCard({
  announcement,
  isExpired = false,
  onEdit
}: AnnouncementCardProps) {
  return (
    <div className={`rounded-lg border p-4 ${isExpired ? 'opacity-60' : ''}`}>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <h4 className='font-medium'>{announcement.title}</h4>
            {announcement.is_urgent && (
              <Badge variant='destructive' className='flex items-center gap-1'>
                <AlertTriangle className='h-3 w-3' />
                Urgent
              </Badge>
            )}
            {isExpired && <Badge variant='secondary'>Expired</Badge>}
          </div>

          <p className='text-muted-foreground text-sm'>
            {announcement.content}
          </p>

          <div className='text-muted-foreground flex items-center gap-4 text-xs'>
            <span>
              Created:{' '}
              {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
            </span>
            <span>
              Expires:{' '}
              {format(new Date(announcement.expires_at), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='sm' onClick={onEdit}>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm'>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
