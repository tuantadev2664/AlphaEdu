'use client';

import { BehaviorTable } from './index';
import { groupedColumns, ExpandedNotes } from './grouped-columns';
import { groupNotesByStudent } from '@/features/teacher/utils/group-behavior-notes';
import type { BehaviorNote } from '@/features/teacher/types';

interface BehaviorTableWrapperProps {
  notes: BehaviorNote[];
  classId: string;
}

export function BehaviorTableWrapper({
  notes,
  classId
}: BehaviorTableWrapperProps) {
  // Group notes by student (client-side)
  const groupedData = groupNotesByStudent(notes);

  return (
    <BehaviorTable
      data={groupedData}
      totalItems={groupedData.length}
      columns={groupedColumns}
      classId={classId}
      expandedContent={ExpandedNotes}
    />
  );
}
