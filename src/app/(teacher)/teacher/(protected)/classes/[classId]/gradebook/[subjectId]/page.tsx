import { fakeTeacher } from '@/constants/mock-api';
import { Button } from '@/components/ui/button';
import { GradebookTable } from '@/features/teacher/components/gradebook-table/index';
import { columns } from '@/features/teacher/components/gradebook-table/columns';
import { Plus, Download, Upload } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

interface GradebookSubjectPageProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export default async function GradebookSubjectPage({
  params
}: GradebookSubjectPageProps) {
  const { classId, subjectId } = await params;

  // Get gradebook data for specific subject
  const gradebookData = fakeTeacher.generateGradebookData(classId, subjectId);
  const subjectData = fakeTeacher.subjects.find((s) => s.id === subjectId);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>
          Gradebook - {subjectData?.name} ({subjectData?.code})
        </h2>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Upload className='mr-2 h-4 w-4' />
            Import Grades
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='mr-2 h-4 w-4' />
            Export Grades
          </Button>
          <Button variant='outline' size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            Add Assessment
          </Button>
        </div>

        <div className='text-muted-foreground text-sm'>
          Showing {gradebookData.length} students
        </div>
      </div>

      {/* Gradebook Table */}
      <GradebookTable
        data={gradebookData}
        totalItems={gradebookData.length}
        columns={columns}
        classId={classId}
        subjectId={subjectId}
      />
    </div>
  );
}
