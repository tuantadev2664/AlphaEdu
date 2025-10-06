'use client';

import { BehaviorTable } from './index';
import { groupedColumns, ExpandedNotes } from './grouped-columns';
import { groupNotesByStudent } from '@/features/teacher/utils/group-behavior-notes';
import type { BehaviorNote as TeacherBehaviorNote } from '@/features/teacher/types';
import type { BehaviorNote as StudentBehaviorNote } from '@/features/student/types';
import type { GroupedBehaviorNote } from '@/features/teacher/utils/group-behavior-notes';
import { useClassStudents } from '@/features/class/hooks/use-class.query';
import {
  getStudentBehaviorNotes,
  transformBehaviorNotes
} from '@/features/student/services/behavior.service';
import { useState, useEffect } from 'react';

interface BehaviorTableWrapperProps {
  classId: string;
  termId?: string;
}

export function BehaviorTableWrapper({
  classId,
  termId = '33333333-3333-3333-3333-333333333333' // Default termId
}: BehaviorTableWrapperProps) {
  const [allBehaviorNotes, setAllBehaviorNotes] = useState<
    GroupedBehaviorNote[]
  >([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Get students data
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError
  } = useClassStudents({
    classId,
    academicYearId: '22222222-2222-2222-2222-222222222222',
    termId
  });

  // Fetch behavior notes for all students and group them
  useEffect(() => {
    if (!studentsData?.data?.length) return;

    const fetchAndGroupBehaviorNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const groupedStudentsData = await Promise.all(
          studentsData.data.map(async (student) => {
            try {
              const response = await getStudentBehaviorNotes(student.studentId);
              const studentNotes = transformBehaviorNotes(response || []);

              // Convert student behavior notes to teacher behavior notes format
              const teacherNotes: TeacherBehaviorNote[] = studentNotes.map(
                (note) => ({
                  ...note,
                  student_id: student.studentId,
                  student: {
                    id: student.studentId,
                    full_name: student.studentName,
                    role: 'student' as const,
                    email: '',
                    phone: '',
                    school_id: '',
                    created_at: new Date().toISOString()
                  },
                  level: note.level.toLowerCase().replace(' ', '_') as any
                })
              );

              // Group notes for this student
              const groupedStudent = groupNotesByStudent(teacherNotes);
              return (
                groupedStudent[0] || {
                  student_id: student.studentId,
                  student_name: student.studentName,
                  student: {
                    id: student.studentId,
                    full_name: student.studentName,
                    role: 'student' as const,
                    email: '',
                    phone: '',
                    school_id: '',
                    created_at: new Date().toISOString()
                  },
                  notes: [],
                  latest_note: {
                    id: '',
                    student_id: student.studentId,
                    class_id: '',
                    term_id: '',
                    note: '',
                    level: 'fair' as any,
                    created_by: '',
                    created_at: new Date().toISOString()
                  },
                  note_count: 0,
                  excellent_count: 0,
                  good_count: 0,
                  fair_count: 0,
                  needs_improvement_count: 0,
                  poor_count: 0
                }
              );
            } catch (error) {
              console.error(
                `Failed to fetch notes for student ${student.studentId}:`,
                error
              );
              // Return empty grouped data for this student
              return {
                student_id: student.studentId,
                student_name: student.studentName,
                student: {
                  id: student.studentId,
                  full_name: student.studentName,
                  role: 'student' as const,
                  email: '',
                  phone: '',
                  school_id: '',
                  created_at: new Date().toISOString()
                },
                notes: [],
                latest_note: {
                  id: '',
                  student_id: student.studentId,
                  class_id: '',
                  term_id: '',
                  note: '',
                  level: 'fair' as any,
                  created_by: '',
                  created_at: new Date().toISOString()
                },
                note_count: 0,
                excellent_count: 0,
                good_count: 0,
                fair_count: 0,
                needs_improvement_count: 0,
                poor_count: 0
              };
            }
          })
        );

        setAllBehaviorNotes(groupedStudentsData);
      } catch (error) {
        console.error('Error fetching behavior notes:', error);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    fetchAndGroupBehaviorNotes();
  }, [studentsData?.data]);

  console.log(allBehaviorNotes);

  // Use the already grouped data
  const groupedData = allBehaviorNotes;

  console.log(groupedData);

  const isLoading = isLoadingStudents || isLoadingNotes;
  const error = studentsError;

  return (
    <BehaviorTable
      data={groupedData}
      totalItems={groupedData.length}
      columns={groupedColumns}
      classId={classId}
      termId={termId}
      expandedContent={ExpandedNotes}
      isLoading={isLoading}
      error={error}
    />
  );
}
