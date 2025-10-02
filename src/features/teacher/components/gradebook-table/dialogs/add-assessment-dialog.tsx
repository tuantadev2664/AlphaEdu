'use client';

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AssessmentKind } from '@/features/score/type';
import { useCreateAssessment } from '@/features/score/hooks/use-score.query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  subjectId: string;
  termId: string;
  academicYearId: string;
}

const assessmentKinds: { value: AssessmentKind; label: string }[] = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'test', label: 'Test' },
  { value: 'midterm', label: 'Midterm' },
  { value: 'final', label: 'Final' },
  { value: 'project', label: 'Project' },
  { value: 'oral', label: 'Oral' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'other', label: 'Other' }
];

export function AddAssessmentDialog({
  open,
  onOpenChange,
  classId,
  subjectId,
  termId,
  academicYearId
}: AddAssessmentDialogProps) {
  const createAssessmentMutation = useCreateAssessment();

  const [formData, setFormData] = useState({
    name: '',
    kind: 'quiz' as AssessmentKind,
    weight: 1.0,
    maxScore: 10,
    title: '',
    dueDate: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.title || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const result = await createAssessmentMutation.mutateAsync({
        classId,
        subjectId,
        termId,
        academicYearId,
        gradeComponent: {
          name: formData.name,
          kind: formData.kind,
          weight: formData.weight,
          maxScore: formData.maxScore,
          position: 1 // TODO: Calculate based on existing assessments
        },
        assessment: {
          title: formData.title,
          dueDate: formData.dueDate,
          description: formData.description
        },
        initializeScores: true
      });

      if (result.success) {
        toast.success('Assessment Created', {
          description: `${formData.title} has been created successfully`,
          duration: 3000
        });

        // Reset form
        setFormData({
          name: '',
          kind: 'quiz',
          weight: 1.0,
          maxScore: 10,
          title: '',
          dueDate: '',
          description: ''
        });

        onOpenChange(false);
      } else {
        toast.error('Creation Failed', {
          description: result.message,
          duration: 3000
        });
      }
    } catch (error) {
      toast.error('Creation Failed', {
        description: 'Failed to create assessment. Please try again.',
        duration: 3000
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            Add New Assessment
          </DialogTitle>
          <DialogDescription>
            Create a new assessment for this class and subject. Scores will be
            initialized for all students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Grade Component Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Grade Component</h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Component Name *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='e.g., Quiz 1, Midterm Exam'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='kind'>Assessment Type *</Label>
                <Select
                  value={formData.kind}
                  onValueChange={(value: AssessmentKind) =>
                    setFormData((prev) => ({ ...prev, kind: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentKinds.map((kind) => (
                      <SelectItem key={kind.value} value={kind.value}>
                        {kind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='weight'>Weight (%)</Label>
                <Input
                  id='weight'
                  type='number'
                  min='1'
                  max='100'
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weight: Number(e.target.value)
                    }))
                  }
                  placeholder='10'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='maxScore'>Max Score</Label>
                <Input
                  id='maxScore'
                  type='number'
                  min='1'
                  value={formData.maxScore}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxScore: Number(e.target.value)
                    }))
                  }
                  placeholder='10'
                />
              </div>
            </div>
          </div>

          {/* Assessment Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Assessment Details</h3>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Assessment Title *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder='e.g., Quiz 1 - Chapter 5'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dueDate'>Due Date *</Label>
                <Input
                  id='dueDate'
                  type='date'
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value
                    }))
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description (Optional)</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder='Additional notes about this assessment...'
                  rows={3}
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={createAssessmentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createAssessmentMutation.isPending}
          >
            {createAssessmentMutation.isPending
              ? 'Creating...'
              : 'Create Assessment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
