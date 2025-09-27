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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RosterStudent } from '@/features/teacher/types';
import {
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Star,
  Calendar,
  BarChart3,
  Users,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface GenerateReportDialogProps {
  student: RosterStudent;
  children: React.ReactNode;
}

const reportSections = [
  {
    id: 'academic',
    label: 'Academic Performance',
    description: 'Grades, test scores, and academic progress',
    icon: GraduationCap,
    included: true
  },
  {
    id: 'behavior',
    label: 'Behavior & Conduct',
    description: 'Behavior notes and classroom conduct',
    icon: Star,
    included: true
  },
  {
    id: 'attendance',
    label: 'Attendance Record',
    description: 'Attendance statistics and patterns',
    icon: Calendar,
    included: true
  },
  {
    id: 'participation',
    label: 'Class Participation',
    description: 'Participation in discussions and activities',
    icon: Users,
    included: false
  },
  {
    id: 'assignments',
    label: 'Assignment History',
    description: 'Detailed assignment submissions and scores',
    icon: FileText,
    included: false
  },
  {
    id: 'progress',
    label: 'Progress Tracking',
    description: 'Learning objectives and skill development',
    icon: BarChart3,
    included: false
  }
];

const reportFormats = [
  {
    id: 'pdf',
    label: 'PDF Document',
    description: 'Professional formatted report'
  },
  {
    id: 'excel',
    label: 'Excel Spreadsheet',
    description: 'Data in spreadsheet format'
  },
  {
    id: 'word',
    label: 'Word Document',
    description: 'Editable document format'
  }
];

export function GenerateReportDialog({
  student,
  children
}: GenerateReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    reportSections
      .filter((section) => section.included)
      .map((section) => section.id)
  );
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const initials = student.full_name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateReport = async () => {
    if (selectedSections.length === 0) {
      toast.error('No Sections Selected', {
        description:
          'Please select at least one section to include in the report.',
        duration: 3000
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation with progress
    const progressSteps = [
      { step: 20, message: 'Collecting academic data...' },
      { step: 40, message: 'Analyzing behavior records...' },
      { step: 60, message: 'Processing attendance data...' },
      { step: 80, message: 'Formatting report...' },
      { step: 100, message: 'Report generated successfully!' }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(step);
      if (step < 100) {
        toast.info('Generating Report', {
          description: message,
          duration: 3000
        });
      }
    }

    setIsGenerating(false);
    setProgress(0);
    setOpen(false);

    toast.success('Report Generated', {
      description: `Student report for ${student.full_name} has been generated and downloaded.`,
      duration: 3000
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ClipboardList className='h-5 w-5' />
            Generate Student Report
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive report for {student.full_name}
          </DialogDescription>
        </DialogHeader>

        {isGenerating && (
          <Card className='border-blue-200 bg-blue-50 dark:bg-blue-900/20'>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='mb-4'>
                  <div className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                    <ClipboardList className='h-8 w-8 text-blue-600' />
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-semibold'>
                  Generating Report...
                </h3>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Please wait while we compile the student report.
                </p>
                <Progress value={progress} className='w-full' />
                <p className='text-muted-foreground mt-2 text-xs'>
                  {progress}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isGenerating && (
          <div className='space-y-6'>
            {/* Student Info */}
            <div className='flex items-center gap-3 rounded-lg border p-3'>
              <Avatar className='h-10 w-10'>
                <AvatarFallback className='text-sm'>{initials}</AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <div className='font-medium'>{student.full_name}</div>
                <div className='text-muted-foreground text-sm'>
                  Student ID: {student.id} • {student.email}
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Report Sections</CardTitle>
                <DialogDescription>
                  Select the sections you want to include in the report.
                </DialogDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {reportSections.map((section) => {
                    const Icon = section.icon;
                    const isSelected = selectedSections.includes(section.id);

                    return (
                      <div
                        key={section.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleSectionToggle(section.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSectionToggle(section.id)}
                          className='mt-1'
                        />
                        <div className='rounded-full bg-gray-100 p-2 dark:bg-gray-800'>
                          <Icon className='h-4 w-4' />
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium'>{section.label}</div>
                          <div className='text-muted-foreground text-sm'>
                            {section.description}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className='mt-1 h-5 w-5 text-blue-600' />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Report Format */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Report Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {reportFormats.map((format) => (
                    <div
                      key={format.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        selectedFormat === format.id
                          ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          selectedFormat === format.id
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedFormat === format.id && (
                          <div className='mx-auto mt-0.5 h-2 w-2 rounded-full bg-white'></div>
                        )}
                      </div>
                      <div>
                        <div className='font-medium'>{format.label}</div>
                        <div className='text-muted-foreground text-sm'>
                          {format.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Summary */}
            <Card className='border-green-200 bg-green-50 dark:bg-green-900/20'>
              <CardContent className='pt-6'>
                <div className='mb-2 flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  <span className='font-medium'>Report Summary</span>
                </div>
                <div className='text-muted-foreground text-sm'>
                  Generating {selectedSections.length} sections in{' '}
                  {selectedFormat.toUpperCase()} format for {student.full_name}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating || selectedSections.length === 0}
          >
            {isGenerating ? (
              'Generating...'
            ) : (
              <>
                <Download className='mr-2 h-4 w-4' />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
