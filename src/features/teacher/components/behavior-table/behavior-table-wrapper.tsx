'use client';

import React from 'react';
import { BehaviorTable } from './index';
import { groupedColumns, ExpandedNotes } from './grouped-columns';
import { useClassStudents } from '@/features/class/hooks/use-class.query';
import { useClassBehaviorNotes } from '@/features/teacher/hooks/use-behavior.query';
import { groupNotesByStudent } from '@/features/teacher/utils/group-behavior-notes';
import type { BehaviorNote as TeacherBehaviorNote } from '@/features/teacher/types';
import type { BehaviorNote as StudentBehaviorNote } from '@/features/student/types';
import type { GroupedBehaviorNote } from '@/features/teacher/utils/group-behavior-notes';

interface BehaviorTableWrapperProps {
  classId: string;
  termId?: string;
}

export function BehaviorTableWrapper({
  classId,
  termId = '33333333-3333-3333-3333-333333333333' // Default termId
}: BehaviorTableWrapperProps) {
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

  // Get student IDs for behavior notes query
  const studentIds =
    studentsData?.data?.map((student) => student.studentId) || [];

  // Fetch behavior notes for all students using React Query
  const {
    data: allBehaviorNotesData,
    isLoading: isLoadingNotes,
    error: notesError
  } = useClassBehaviorNotes(studentIds, {
    enabled: studentIds.length > 0
  });

  // Process behavior notes data and group them
  const groupedData = React.useMemo(() => {
    if (!studentsData?.data || !allBehaviorNotesData) return [];

    const groupedStudentsData = studentsData.data.map((student) => {
      // Find notes for this student
      const studentNotes = allBehaviorNotesData.filter(
        (note) => note.student_id === student.studentId
      );

      // Convert student behavior notes to teacher behavior notes format
      const teacherNotes: TeacherBehaviorNote[] = studentNotes.map((note) => ({
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
      }));

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
    });

    return groupedStudentsData;
  }, [studentsData?.data, allBehaviorNotesData]);

  console.log(groupedData);

  const isLoading = isLoadingStudents || isLoadingNotes;
  const error = studentsError || notesError;

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
