'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ClassStudent } from '@/features/class/types';
import {
  MessageSquare,
  Send,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface SendMessageDialogProps {
  student: ClassStudent;
  children: React.ReactNode;
}

export function SendMessageDialog({
  student,
  children
}: SendMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>(
    'normal'
  );
  const [isLoading, setIsLoading] = useState(false);

  const initials = student.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Missing Information', {
        description: 'Please fill in both subject and message fields.',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setOpen(false);
    setSubject('');
    setMessage('');
    setPriority('normal');

    toast.success('Message Sent', {
      description: `Your message has been sent to ${student.fullName}.`,
      duration: 3000
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className='h-3 w-3' />;
      case 'high':
        return <Clock className='h-3 w-3' />;
      default:
        return <CheckCircle className='h-3 w-3' />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            Send Message
          </DialogTitle>
          <DialogDescription>
            Send a message to the student and their guardians.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Recipient Info */}
          <div className='flex items-center gap-3 rounded-lg border p-3'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='text-sm'>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='font-medium'>{student.fullName}</div>
              <div className='text-muted-foreground text-sm'>
                {student.email}
              </div>
            </div>
            <Badge variant='outline' className='text-xs'>
              Student & Guardians
            </Badge>
          </div>

          {/* Priority Selection */}
          <div className='space-y-2'>
            <Label htmlFor='priority'>Priority Level</Label>
            <div className='flex gap-2'>
              {(['normal', 'high', 'urgent'] as const).map((level) => (
                <Button
                  key={level}
                  type='button'
                  variant={priority === level ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setPriority(level)}
                  className='flex items-center gap-2'
                >
                  {getPriorityIcon(level)}
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              placeholder='Enter message subject...'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              placeholder='Type your message here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className='resize-none'
            />
            <div className='text-muted-foreground text-xs'>
              {message.length}/500 characters
            </div>
          </div>

          {/* Quick Templates */}
          <div className='space-y-2'>
            <Label>Quick Templates</Label>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSubject('Academic Performance Update');
                  setMessage(
                    `Dear ${student.fullName} and guardians,\n\nI wanted to share an update about ${student.fullName}'s academic performance in class. Please feel free to reach out if you have any questions or would like to schedule a meeting.\n\nBest regards,\nYour Teacher`
                  );
                }}
                className='justify-start text-xs'
              >
                Academic Update
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSubject('Behavior Notice');
                  setMessage(
                    `Dear ${student.fullName} and guardians,\n\nI wanted to discuss ${student.fullName}'s behavior in class. Let's work together to support their success.\n\nBest regards,\nYour Teacher`
                  );
                }}
                className='justify-start text-xs'
              >
                Behavior Notice
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSubject('Positive Recognition');
                  setMessage(
                    `Dear ${student.fullName} and guardians,\n\nI'm pleased to share that ${student.fullName} has been doing excellent work in class. Keep up the great effort!\n\nBest regards,\nYour Teacher`
                  );
                }}
                className='justify-start text-xs'
              >
                Positive Recognition
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSubject('Meeting Request');
                  setMessage(
                    `Dear ${student.fullName} and guardians,\n\nI would like to schedule a meeting to discuss ${student.fullName}'s progress. Please let me know your availability.\n\nBest regards,\nYour Teacher`
                  );
                }}
                className='justify-start text-xs'
              >
                Meeting Request
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                Sending...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
