'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StudentScore } from '@/features/score/type';
import {
  MoreHorizontal,
  Edit3,
  FileText,
  Mail,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface CellActionProps {
  data: StudentScore;
  onViewDetails?: (student: StudentScore) => void;
  onEditDetails?: (student: StudentScore) => void;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onViewDetails,
  onEditDetails
}) => {
  const [contactOpen, setContactOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCalculateGrade = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    toast.success('Grade Recalculated', {
      description: `Average grade has been recalculated for ${data.fullName}`,
      duration: 3000
    });
  };

  const handleContactParent = () => {
    setContactOpen(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setContactOpen(false);
    setMessage('');
    toast.success('Message Sent', {
      description: `Message sent to ${data.fullName}'s parents`,
      duration: 3000
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onViewDetails?.(data)}>
            <FileText className='mr-2 h-4 w-4' />
            View Details Score
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onEditDetails?.(data)}>
            <Edit3 className='mr-2 h-4 w-4' />
            Edit Details Score
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleCalculateGrade} disabled={loading}>
            <Calculator className='mr-2 h-4 w-4' />
            {loading ? 'Calculating...' : 'Recalculate Average'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleContactParent}>
            <Mail className='mr-2 h-4 w-4' />
            Contact Parent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Contact Parent Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Contact Parent
            </DialogTitle>
            <DialogDescription>
              Send a message to {data.fullName}&apos;s parents about their
              grades.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Textarea
              placeholder='Enter your message here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
