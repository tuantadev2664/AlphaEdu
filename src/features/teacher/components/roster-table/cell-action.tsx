'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { RosterStudent } from '@/features/teacher/types';
import {
  MoreHorizontal,
  User,
  MessageSquare,
  FileText,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import { StudentProfileDialog } from '../dialogs/student-profile-dialog';
import { SendMessageDialog } from '../dialogs/send-message-dialog';
import { ViewGradesDialog } from '../dialogs/view-grades-dialog';
import { BehaviorNotesDialog } from '../dialogs/behavior-notes-dialog';
import { GenerateReportDialog } from '../dialogs/generate-report-dialog';

interface CellActionProps {
  data: RosterStudent;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <StudentProfileDialog student={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <User className='mr-2 h-4 w-4' />
            View Profile
          </DropdownMenuItem>
        </StudentProfileDialog>

        <SendMessageDialog student={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <MessageSquare className='mr-2 h-4 w-4' />
            Send Message
          </DropdownMenuItem>
        </SendMessageDialog>

        <ViewGradesDialog student={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <GraduationCap className='mr-2 h-4 w-4' />
            View Grades
          </DropdownMenuItem>
        </ViewGradesDialog>

        <BehaviorNotesDialog student={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FileText className='mr-2 h-4 w-4' />
            Behavior Notes
          </DropdownMenuItem>
        </BehaviorNotesDialog>

        <DropdownMenuSeparator />

        <GenerateReportDialog student={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ClipboardList className='mr-2 h-4 w-4' />
            Generate Report
          </DropdownMenuItem>
        </GenerateReportDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
