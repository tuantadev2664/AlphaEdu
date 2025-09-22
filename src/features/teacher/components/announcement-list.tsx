// Announcements List for a Class
import { fakeAnnouncements } from '@/constants/mock-api-teacher';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AnnouncementList({ classId }: { classId: string }) {
  const announcements = fakeAnnouncements.filter((a) => a.class_id === classId);
  return (
    <div className='space-y-4'>
      {announcements.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{a.content}</div>
            <div className='text-muted-foreground text-xs'>
              {new Date(a.created_at).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
      {announcements.length === 0 && <div>No announcements.</div>}
    </div>
  );
}
