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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GradebookEntry } from '@/features/teacher/types';
import {
  MoreHorizontal,
  Edit3,
  TrendingUp,
  FileText,
  Mail,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: GradebookEntry;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleEditGrades = () => {
    setEditOpen(true);
  };

  const handleViewProgress = () => {
    // Navigate to student progress page
    router.push(`/teacher/students/${data.student.id}/progress`);
  };

  const handleSendReport = () => {
    setReportOpen(true);
  };

  const handleContactParent = () => {
    setContactOpen(true);
  };

  const handleCalculateGrade = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    toast.success('Grade Recalculated', {
      description: `Average grade has been recalculated for ${data.student.full_name}`,
      duration: 3000
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setContactOpen(false);
    setMessage('');

    toast.success('Message Sent', {
      description: `Message sent to ${data.student.full_name}'s parents`,
      duration: 3000
    });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setReportOpen(false);

    toast.success('Report Generated', {
      description: `Grade report generated for ${data.student.full_name}`,
      duration: 3000
    });
  };

  return (
    <>
      {/* Edit Grades Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Edit3 className='h-5 w-5' />
              Edit Grades - {data.student.full_name}
            </DialogTitle>
            <DialogDescription>
              Edit individual grades for this student.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-muted-foreground text-sm'>
              Grade editing interface would be implemented here.
            </p>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Generate Report
            </DialogTitle>
            <DialogDescription>
              Generate a grade report for {data.student.full_name}.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-muted-foreground mb-4 text-sm'>
              This will generate a comprehensive grade report including:
            </p>
            <ul className='text-muted-foreground ml-4 space-y-1 text-sm'>
              <li>• Current grades for all assessments</li>
              <li>• Overall average and letter grade</li>
              <li>• Performance trends</li>
              <li>• Recommendations</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Parent Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Contact Parent
            </DialogTitle>
            <DialogDescription>
              Send a message to {data.student.full_name}&apos;s parents about
              their grades.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='subject'>Subject</Label>
              <Input
                id='subject'
                placeholder='Grade Update'
                defaultValue='Grade Update'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                placeholder='Enter your message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleEditGrades}>
            <Edit3 className='mr-2 h-4 w-4' />
            Edit All Grades
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleViewProgress}>
            <TrendingUp className='mr-2 h-4 w-4' />
            View Progress
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCalculateGrade} disabled={loading}>
            <Calculator className='mr-2 h-4 w-4' />
            {loading ? 'Calculating...' : 'Recalculate Average'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSendReport}>
            <FileText className='mr-2 h-4 w-4' />
            Generate Report
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleContactParent}>
            <Mail className='mr-2 h-4 w-4' />
            Contact Parent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
