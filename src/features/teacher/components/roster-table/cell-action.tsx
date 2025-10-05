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
import { ClassStudentWithStats, ClassStudent } from '@/features/class/types';
import {
  MoreHorizontal,
  User,
  MessageSquare,
  FileText,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import { StudentProfileDialog } from './dialogs/student-profile-dialog';
import { SendMessageDialog } from './dialogs/send-message-dialog';
import { ViewGradesDialog } from './dialogs/view-grades-dialog';
import { BehaviorNotesDialog } from './dialogs/behavior-notes-dialog';
import { GenerateReportDialog } from './dialogs/generate-report-dialog';

interface CellActionProps {
  data: ClassStudentWithStats;
}

// Helper function to convert ClassStudentWithStats to ClassStudent for dialog compatibility
const mapToClassStudent = (data: ClassStudentWithStats): ClassStudent => ({
  id: data.studentId,
  role: 'student' as const,
  fullName: data.studentName,
  email: '', // Not available in ClassStudentWithStats
  phone: '', // Not available in ClassStudentWithStats
  schoolId: '', // Not available in ClassStudentWithStats
  createdAt: new Date().toISOString(), // Default value
  announcements: [],
  behaviorNoteCreatedByNavigations: [],
  behaviorNoteStudents: [],
  classEnrollments: [],
  classes: [],
  messageReceivers: [],
  messageSenders: [],
  parentStudentParents: [],
  parentStudentStudents: [],
  school: null,
  scoreCreatedByNavigations: [],
  scoreStudents: [],
  teacherAssignments: []
});

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const studentData = mapToClassStudent(data);

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

        <StudentProfileDialog
          student={studentData}
          ranking={data.ranking}
          averageScore={data.averageScore}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <User className='mr-2 h-4 w-4' />
            View Profile
          </DropdownMenuItem>
        </StudentProfileDialog>

        <SendMessageDialog student={studentData}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <MessageSquare className='mr-2 h-4 w-4' />
            Send Message
          </DropdownMenuItem>
        </SendMessageDialog>

        <ViewGradesDialog
          student={studentData}
          ranking={data.ranking}
          averageScore={data.averageScore}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <GraduationCap className='mr-2 h-4 w-4' />
            View Grades
          </DropdownMenuItem>
        </ViewGradesDialog>

        <BehaviorNotesDialog student={studentData}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FileText className='mr-2 h-4 w-4' />
            Behavior Notes
          </DropdownMenuItem>
        </BehaviorNotesDialog>

        <DropdownMenuSeparator />

        <GenerateReportDialog student={studentData}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ClipboardList className='mr-2 h-4 w-4' />
            Generate Report
          </DropdownMenuItem>
        </GenerateReportDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
