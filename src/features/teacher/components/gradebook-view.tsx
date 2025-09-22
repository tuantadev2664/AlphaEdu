'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { GradebookEntry, Subject } from '@/features/teacher/types';
import {
  Plus,
  Download,
  Calculator,
  Edit3,
  Save,
  X,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Award,
  BookOpen,
  Upload,
  Zap,
  Grid3X3,
  FileSpreadsheet,
  CheckSquare,
  Hash,
  FileDown,
  FileUp,
  Eye,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface GradebookViewProps {
  data: GradebookEntry[];
  subjects: Subject[];
  selectedSubject: string;
  classId: string;
}

export function GradebookView({
  data,
  subjects,
  selectedSubject,
  classId
}: GradebookViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    assessmentIndex: number;
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [gradebookData, setGradebookData] = useState(data);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: '',
    type: 'quiz' as 'quiz' | 'test' | 'assignment' | 'project',
    maxScore: 100
  });
  const [showBulkEntry, setShowBulkEntry] = useState(false);
  const [bulkGrades, setBulkGrades] = useState<{ [studentId: string]: string }>(
    {}
  );
  const [selectedAssessmentForBulk, setSelectedAssessmentForBulk] = useState(0);
  const [bulkGradeValue, setBulkGradeValue] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [importPreview, setImportPreview] = useState<{ [key: string]: any }>(
    {}
  );
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  const handleSubjectChange = (subjectId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('subject', subjectId);
    router.push(`/teacher/classes/${classId}/gradebook?${params.toString()}`);
  };

  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);

  const startEdit = (
    studentId: string,
    assessmentIndex: number,
    currentScore: number
  ) => {
    setEditingCell({ studentId, assessmentIndex });
    setEditValue(currentScore.toString());
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    const score = parseFloat(editValue);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error('Invalid Score', {
        description: 'Please enter a valid score between 0 and 100.',
        duration: 3000
      });
      return;
    }

    // Update gradebook data
    const updatedData = gradebookData.map((entry) => {
      if (entry.student.id === editingCell.studentId) {
        const updatedScores = [...entry.scores];
        if (updatedScores[editingCell.assessmentIndex]) {
          updatedScores[editingCell.assessmentIndex] = {
            ...updatedScores[editingCell.assessmentIndex],
            score: score
          };
        }

        // Recalculate average
        const validScores = updatedScores.filter((s) => !s.is_absent);
        const newAverage =
          validScores.length > 0
            ? Math.round(
                validScores.reduce((sum, s) => sum + s.score, 0) /
                  validScores.length
              )
            : 0;

        return {
          ...entry,
          scores: updatedScores,
          average_score: newAverage
        };
      }
      return entry;
    });

    setGradebookData(updatedData);
    setEditingCell(null);
    setEditValue('');

    toast.success('Grade Updated', {
      description: 'The grade has been updated successfully.',
      duration: 3000
    });
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddAssessment = async () => {
    if (!newAssessment.name.trim()) {
      toast.error('Missing Information', {
        description: 'Please enter an assessment name.',
        duration: 3000
      });
      return;
    }

    // Add new assessment column to all students
    const updatedData = gradebookData.map((entry) => ({
      ...entry,
      scores: [
        ...entry.scores,
        {
          id: `new-${Date.now()}-${entry.student.id}`,
          assessment_id: `assessment-${Date.now()}`,
          student_id: entry.student.id,
          score: 0,
          is_absent: false,
          created_by: 'teacher-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }));

    setGradebookData(updatedData);
    setShowAddAssessment(false);
    setNewAssessment({ name: '', type: 'quiz', maxScore: 100 });

    toast.success('Assessment Added', {
      description: `${newAssessment.name} has been added to the gradebook.`,
      duration: 3000
    });
  };

  // Bulk grading functions
  const handleBulkGradeEntry = () => {
    if (Object.keys(bulkGrades).length === 0) {
      toast.error('No Grades Entered', {
        description: 'Please enter grades for at least one student.',
        duration: 3000
      });
      return;
    }

    // Update gradebook data with bulk grades
    const updatedData = gradebookData.map((entry) => {
      const newGrade = bulkGrades[entry.student.id];
      if (newGrade && !isNaN(parseFloat(newGrade))) {
        const updatedScores = [...entry.scores];
        if (updatedScores[selectedAssessmentForBulk]) {
          updatedScores[selectedAssessmentForBulk] = {
            ...updatedScores[selectedAssessmentForBulk],
            score: parseFloat(newGrade)
          };
        }

        // Recalculate average
        const validScores = updatedScores.filter((s) => !s.is_absent);
        const newAverage =
          validScores.length > 0
            ? Math.round(
                validScores.reduce((sum, s) => sum + s.score, 0) /
                  validScores.length
              )
            : 0;

        return {
          ...entry,
          scores: updatedScores,
          average_score: newAverage
        };
      }
      return entry;
    });

    setGradebookData(updatedData);
    setShowBulkEntry(false);
    setBulkGrades({});
    setSelectedStudents(new Set());

    toast.success('Bulk Grades Updated', {
      description: `Grades updated for ${Object.keys(bulkGrades).length} students.`,
      duration: 3000
    });
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.size === gradebookData.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(
        new Set(gradebookData.map((entry) => entry.student.id))
      );
    }
  };

  const handleStudentSelect = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const applyGradeToSelected = (grade: string) => {
    const newBulkGrades = { ...bulkGrades };
    selectedStudents.forEach((studentId) => {
      newBulkGrades[studentId] = grade;
    });
    setBulkGrades(newBulkGrades);
  };

  const applyLetterGradeToSelected = (letterGrade: string) => {
    const gradeMap: { [key: string]: string } = {
      A: '95',
      B: '85',
      C: '75',
      D: '65',
      F: '50'
    };
    applyGradeToSelected(gradeMap[letterGrade] || '0');
  };

  // Excel Import/Export functions
  const handleExportExcel = () => {
    // Create CSV data for Excel template
    const headers = [
      'Student ID',
      'Student Name',
      ...assessments.map((a) => a.name),
      'Current Average'
    ];
    const csvData = [
      headers.join(','),
      ...gradebookData.map((entry) => {
        const row = [
          entry.student.id,
          `"${entry.student.full_name}"`,
          ...assessments.map((_, index) => entry.scores[index]?.score || ''),
          entry.average_score || 0
        ];
        return row.join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${selectedSubjectData?.name || 'Gradebook'}_Template.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Excel Template Exported', {
      description: 'Download the template, fill in grades, and import it back.',
      duration: 4000
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Invalid File Format', {
        description: 'Please upload a CSV or Excel file.',
        duration: 3000
      });
      return;
    }

    setIsProcessingImport(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        toast.error('Invalid File', {
          description: 'File must contain headers and at least one data row.',
          duration: 3000
        });
        setIsProcessingImport(false);
        return;
      }

      // Parse CSV data
      const headers = lines[0]
        .split(',')
        .map((h) => h.trim().replace(/"/g, ''));
      const dataRows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });
        return rowData;
      });

      setImportedData(dataRows);

      // Create preview data
      const preview: { [key: string]: any } = {};
      dataRows.forEach((row) => {
        const studentId = row['Student ID'];
        if (studentId) {
          preview[studentId] = row;
        }
      });
      setImportPreview(preview);
      setIsProcessingImport(false);

      toast.success('File Processed', {
        description: `Found ${dataRows.length} student records. Review and import.`,
        duration: 3000
      });
    };

    reader.onerror = () => {
      toast.error('File Read Error', {
        description: 'Failed to read the uploaded file.',
        duration: 3000
      });
      setIsProcessingImport(false);
    };

    reader.readAsText(file);
  };

  const handleImportGrades = () => {
    if (Object.keys(importPreview).length === 0) {
      toast.error('No Data to Import', {
        description: 'Please upload and process a file first.',
        duration: 3000
      });
      return;
    }

    let importCount = 0;
    const updatedData = gradebookData.map((entry) => {
      const importRow = importPreview[entry.student.id];
      if (importRow) {
        const updatedScores = [...entry.scores];
        let hasChanges = false;

        // Update scores from imported data
        assessments.forEach((assessment, index) => {
          const importedGrade = importRow[assessment.name];
          if (
            importedGrade &&
            !isNaN(parseFloat(importedGrade)) &&
            updatedScores[index]
          ) {
            updatedScores[index] = {
              ...updatedScores[index],
              score: parseFloat(importedGrade)
            };
            hasChanges = true;
          }
        });

        if (hasChanges) {
          // Recalculate average
          const validScores = updatedScores.filter((s) => !s.is_absent);
          const newAverage =
            validScores.length > 0
              ? Math.round(
                  validScores.reduce((sum, s) => sum + s.score, 0) /
                    validScores.length
                )
              : 0;

          importCount++;
          return {
            ...entry,
            scores: updatedScores,
            average_score: newAverage
          };
        }
      }
      return entry;
    });

    setGradebookData(updatedData);
    setShowExcelImport(false);
    setImportedData([]);
    setImportPreview({});

    toast.success('Grades Imported Successfully', {
      description: `Updated grades for ${importCount} students.`,
      duration: 4000
    });
  };

  // Mock assessments for display
  const assessments = [
    { name: 'Quiz 1', type: 'quiz', maxScore: 100 },
    { name: 'Test 1', type: 'test', maxScore: 100 },
    { name: 'Quiz 2', type: 'quiz', maxScore: 100 },
    { name: 'Midterm', type: 'test', maxScore: 100 },
    { name: 'Project', type: 'project', maxScore: 100 }
  ];

  // Calculate class statistics
  const classAverage =
    gradebookData.length > 0
      ? Math.round(
          gradebookData.reduce(
            (sum, entry) => sum + (entry.average_score || 0),
            0
          ) / gradebookData.length
        )
      : 0;
  const passingStudents = gradebookData.filter(
    (entry) => (entry.average_score || 0) >= 70
  ).length;
  const highPerformers = gradebookData.filter(
    (entry) => (entry.average_score || 0) >= 90
  ).length;

  return (
    <div className='space-y-8'>
      {/* Enhanced Header Section */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-2xl'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10'></div>
        <div className='absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5'></div>

        <div className='relative p-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='rounded-2xl bg-white/20 p-3'>
                <Calculator className='h-8 w-8' />
              </div>
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>Gradebook</h1>
                <p className='mt-1 text-lg text-emerald-100'>
                  {selectedSubjectData?.name} - Manage student grades
                </p>
              </div>
            </div>
          </div>

          {/* Subject Selector and Actions */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger className='w-64 border-white/20 bg-white/10 text-white'>
                  <SelectValue placeholder='Select subject' />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge className='border-white/30 bg-white/20 text-white'>
                {selectedSubjectData?.code}
              </Badge>
            </div>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  className='border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                  onClick={handleExportExcel}
                >
                  <FileDown className='mr-2 h-4 w-4' />
                  Export Template
                </Button>
                <Dialog
                  open={showExcelImport}
                  onOpenChange={setShowExcelImport}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                    >
                      <FileUp className='mr-2 h-4 w-4' />
                      Import Excel
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              <Dialog open={showBulkEntry} onOpenChange={setShowBulkEntry}>
                <DialogTrigger asChild>
                  <Button className='border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'>
                    <Grid3X3 className='mr-2 h-4 w-4' />
                    Bulk Grade Entry
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Dialog
                open={showAddAssessment}
                onOpenChange={setShowAddAssessment}
              >
                <DialogTrigger asChild>
                  <Button className='bg-white/20 text-white hover:bg-white/30'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Assessment</DialogTitle>
                    <DialogDescription>
                      Create a new assessment for {selectedSubjectData?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='assessment-name'>Assessment Name</Label>
                      <Input
                        id='assessment-name'
                        placeholder='Enter assessment name...'
                        value={newAssessment.name}
                        onChange={(e) =>
                          setNewAssessment((prev) => ({
                            ...prev,
                            name: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='assessment-type'>Type</Label>
                      <Select
                        value={newAssessment.type}
                        onValueChange={(
                          value: 'quiz' | 'test' | 'assignment' | 'project'
                        ) =>
                          setNewAssessment((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='quiz'>Quiz</SelectItem>
                          <SelectItem value='test'>Test</SelectItem>
                          <SelectItem value='assignment'>Assignment</SelectItem>
                          <SelectItem value='project'>Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='max-score'>Maximum Score</Label>
                      <Input
                        id='max-score'
                        type='number'
                        placeholder='100'
                        value={newAssessment.maxScore}
                        onChange={(e) =>
                          setNewAssessment((prev) => ({
                            ...prev,
                            maxScore: parseInt(e.target.value) || 100
                          }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setShowAddAssessment(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddAssessment}>
                      <Plus className='mr-2 h-4 w-4' />
                      Add Assessment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Bulk Grade Entry Dialog */}
          <Dialog open={showBulkEntry} onOpenChange={setShowBulkEntry}>
            <DialogContent className='max-h-[80vh] max-w-5xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-3'>
                  <div className='rounded-full bg-orange-100 p-2 dark:bg-orange-900'>
                    <Grid3X3 className='h-5 w-5 text-orange-600' />
                  </div>
                  Bulk Grade Entry
                </DialogTitle>
                <DialogDescription>
                  Enter grades for multiple students at once for{' '}
                  {assessments[selectedAssessmentForBulk]?.name}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
                {/* Assessment Selection */}
                <Card className='border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <Label className='text-base font-semibold'>
                        Select Assessment
                      </Label>
                      <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
                        {assessments.map((assessment, index) => (
                          <button
                            key={index}
                            type='button'
                            onClick={() => setSelectedAssessmentForBulk(index)}
                            className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                              selectedAssessmentForBulk === index
                                ? 'border-blue-300 bg-blue-100 text-blue-800 ring-2 ring-blue-200'
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className='font-semibold'>
                              {assessment.name}
                            </div>
                            <div className='text-xs opacity-75'>
                              {assessment.type}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className='border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50'>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-base font-semibold'>
                          Quick Actions
                        </Label>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleSelectAllStudents}
                          className='text-xs'
                        >
                          <CheckSquare className='mr-1 h-3 w-3' />
                          {selectedStudents.size === gradebookData.length
                            ? 'Deselect All'
                            : 'Select All'}
                        </Button>
                      </div>

                      {/* Letter Grade Buttons */}
                      <div className='flex flex-wrap gap-2'>
                        <span className='mr-2 text-sm font-medium text-gray-600'>
                          Apply to selected:
                        </span>
                        {[
                          {
                            grade: 'A',
                            score: '95',
                            color: 'bg-green-500 hover:bg-green-600'
                          },
                          {
                            grade: 'B',
                            score: '85',
                            color: 'bg-blue-500 hover:bg-blue-600'
                          },
                          {
                            grade: 'C',
                            score: '75',
                            color: 'bg-yellow-500 hover:bg-yellow-600'
                          },
                          {
                            grade: 'D',
                            score: '65',
                            color: 'bg-orange-500 hover:bg-orange-600'
                          },
                          {
                            grade: 'F',
                            score: '50',
                            color: 'bg-red-500 hover:bg-red-600'
                          }
                        ].map((item) => (
                          <Button
                            key={item.grade}
                            size='sm'
                            onClick={() =>
                              applyLetterGradeToSelected(item.grade)
                            }
                            className={`${item.color} border-0 px-3 py-1 text-white`}
                            disabled={selectedStudents.size === 0}
                          >
                            {item.grade} ({item.score})
                          </Button>
                        ))}
                      </div>

                      {/* Custom Grade Input */}
                      <div className='flex items-center gap-2'>
                        <Input
                          type='number'
                          placeholder='Custom grade (0-100)'
                          value={bulkGradeValue}
                          onChange={(e) => setBulkGradeValue(e.target.value)}
                          className='w-48'
                          min='0'
                          max='100'
                        />
                        <Button
                          variant='outline'
                          onClick={() => applyGradeToSelected(bulkGradeValue)}
                          disabled={
                            selectedStudents.size === 0 || !bulkGradeValue
                          }
                        >
                          Apply Custom Grade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student Grade Entry */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      <span>Student Grades</span>
                      <Badge variant='outline'>
                        {Object.keys(bulkGrades).length} grades entered
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='max-h-96 space-y-3 overflow-y-auto'>
                      {gradebookData.map((entry) => {
                        const initials = entry.student.full_name
                          .split(' ')
                          .map((name) => name[0])
                          .join('')
                          .toUpperCase();
                        const isSelected = selectedStudents.has(
                          entry.student.id
                        );
                        const currentGrade =
                          entry.scores[selectedAssessmentForBulk]?.score || 0;

                        return (
                          <div
                            key={entry.student.id}
                            className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                              isSelected
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type='checkbox'
                              checked={isSelected}
                              onChange={() =>
                                handleStudentSelect(entry.student.id)
                              }
                              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <Avatar className='h-8 w-8'>
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-xs text-white'>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='font-medium'>
                                {entry.student.full_name}
                              </div>
                              <div className='text-muted-foreground text-sm'>
                                Current: {currentGrade}/100
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Input
                                type='number'
                                placeholder='Grade'
                                value={bulkGrades[entry.student.id] || ''}
                                onChange={(e) =>
                                  setBulkGrades((prev) => ({
                                    ...prev,
                                    [entry.student.id]: e.target.value
                                  }))
                                }
                                className='w-20 text-center'
                                min='0'
                                max='100'
                              />
                              <span className='text-muted-foreground text-sm'>
                                /100
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setShowBulkEntry(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkGradeEntry}
                  className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                >
                  <Save className='mr-2 h-4 w-4' />
                  Save All Grades ({Object.keys(bulkGrades).length})
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Excel Import Dialog */}
          <Dialog open={showExcelImport} onOpenChange={setShowExcelImport}>
            <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-3'>
                  <div className='rounded-full bg-green-100 p-2 dark:bg-green-900'>
                    <FileSpreadsheet className='h-5 w-5 text-green-600' />
                  </div>
                  Import Excel Grades
                </DialogTitle>
                <DialogDescription>
                  Upload your filled Excel template to import grades for
                  multiple students
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
                {/* Instructions */}
                <Card className='border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <h4 className='flex items-center gap-2 font-semibold'>
                        <AlertCircle className='h-4 w-4 text-blue-600' />
                        How to Import Grades
                      </h4>
                      <div className='space-y-2 text-sm text-gray-700'>
                        <div className='flex items-center gap-2'>
                          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600'>
                            1
                          </span>
                          <span>
                            Click "Export Template" to download the Excel
                            template
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600'>
                            2
                          </span>
                          <span>
                            Fill in the grades in the appropriate columns
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600'>
                            3
                          </span>
                          <span>Save as CSV format and upload here</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600'>
                            4
                          </span>
                          <span>
                            Review the preview and click "Import Grades"
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Upload File</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
                        <FileUp className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                        <div className='space-y-2'>
                          <p className='text-lg font-medium'>
                            Upload your Excel file
                          </p>
                          <p className='text-sm text-gray-500'>
                            Supports CSV and Excel files
                          </p>
                        </div>
                        <input
                          type='file'
                          accept='.csv,.xlsx,.xls'
                          onChange={handleFileUpload}
                          className='mt-4'
                          disabled={isProcessingImport}
                        />
                        {isProcessingImport && (
                          <div className='mt-4 flex items-center justify-center gap-2'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
                            <span className='text-sm'>Processing file...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Data */}
                {Object.keys(importPreview).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center justify-between'>
                        <span className='flex items-center gap-2'>
                          <Eye className='h-5 w-5' />
                          Import Preview
                        </span>
                        <Badge variant='outline'>
                          {Object.keys(importPreview).length} students found
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='max-h-64 space-y-3 overflow-y-auto'>
                        {Object.entries(importPreview)
                          .slice(0, 10)
                          .map(([studentId, data]) => {
                            const student = gradebookData.find(
                              (s) => s.student.id === studentId
                            );
                            if (!student) return null;

                            const initials = student.student.full_name
                              .split(' ')
                              .map((name) => name[0])
                              .join('')
                              .toUpperCase();

                            return (
                              <div
                                key={studentId}
                                className='flex items-center gap-4 rounded-lg border bg-gray-50 p-3'
                              >
                                <Avatar className='h-8 w-8'>
                                  <AvatarFallback className='bg-gradient-to-br from-green-500 to-emerald-600 text-xs text-white'>
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                  <div className='font-medium'>
                                    {student.student.full_name}
                                  </div>
                                  <div className='text-muted-foreground text-sm'>
                                    ID: {studentId}
                                  </div>
                                </div>
                                <div className='flex gap-2'>
                                  {assessments.map((assessment, index) => {
                                    const grade = data[assessment.name];
                                    const isValid =
                                      grade && !isNaN(parseFloat(grade));
                                    return (
                                      <div key={index} className='text-center'>
                                        <div className='text-xs text-gray-500'>
                                          {assessment.name}
                                        </div>
                                        <div
                                          className={`text-sm font-medium ${
                                            isValid
                                              ? 'text-green-600'
                                              : 'text-gray-400'
                                          }`}
                                        >
                                          {isValid ? grade : '-'}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <CheckCircle2 className='h-5 w-5 text-green-600' />
                              </div>
                            );
                          })}
                        {Object.keys(importPreview).length > 10 && (
                          <div className='py-2 text-center text-sm text-gray-500'>
                            ... and {Object.keys(importPreview).length - 10}{' '}
                            more students
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Import Summary */}
                {Object.keys(importPreview).length > 0 && (
                  <Card className='border-green-200 bg-green-50 dark:bg-green-900/20'>
                    <CardContent className='pt-6'>
                      <div className='mb-2 flex items-center gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600' />
                        <span className='font-medium'>Ready to Import</span>
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {Object.keys(importPreview).length} students will have
                        their grades updated
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setShowExcelImport(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportGrades}
                  disabled={Object.keys(importPreview).length === 0}
                  className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                >
                  <Upload className='mr-2 h-4 w-4' />
                  Import Grades ({Object.keys(importPreview).length})
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Quick Stats */}
          <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
              <div className='flex items-center gap-2 text-emerald-100'>
                <Users className='h-4 w-4' />
                <span className='text-sm font-medium'>Total Students</span>
              </div>
              <div className='mt-1 text-2xl font-bold'>
                {gradebookData.length}
              </div>
            </div>
            <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
              <div className='flex items-center gap-2 text-emerald-100'>
                <BarChart3 className='h-4 w-4' />
                <span className='text-sm font-medium'>Class Average</span>
              </div>
              <div className='mt-1 text-2xl font-bold'>{classAverage}%</div>
            </div>
            <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
              <div className='flex items-center gap-2 text-emerald-100'>
                <Target className='h-4 w-4' />
                <span className='text-sm font-medium'>Passing</span>
              </div>
              <div className='mt-1 text-2xl font-bold'>{passingStudents}</div>
            </div>
            <div className='rounded-xl bg-white/10 p-4 backdrop-blur-sm'>
              <div className='flex items-center gap-2 text-emerald-100'>
                <Award className='h-4 w-4' />
                <span className='text-sm font-medium'>High Performers</span>
              </div>
              <div className='mt-1 text-2xl font-bold'>{highPerformers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Gradebook Table */}
      <Card className='border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl'>
        <CardHeader className='border-b bg-gradient-to-r from-blue-50 to-indigo-50'>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-blue-100 p-2'>
                <BookOpen className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>
                  {selectedSubjectData?.name}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Interactive Grade Records
                </p>
              </div>
            </div>
            <Badge className='bg-blue-100 text-blue-800'>
              Click to edit grades
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr className='border-b-2 border-gray-200'>
                  <th className='sticky left-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 p-4 text-left font-semibold text-gray-700'>
                    Student
                  </th>
                  {assessments.map((assessment, index) => (
                    <th
                      key={index}
                      className='min-w-[120px] p-4 text-center font-semibold text-gray-700'
                    >
                      <div className='flex flex-col items-center gap-1'>
                        <span>{assessment.name}</span>
                        <Badge
                          variant='outline'
                          className={`text-xs ${
                            assessment.type === 'test'
                              ? 'border-red-200 text-red-700'
                              : assessment.type === 'quiz'
                                ? 'border-blue-200 text-blue-700'
                                : assessment.type === 'project'
                                  ? 'border-purple-200 text-purple-700'
                                  : 'border-green-200 text-green-700'
                          }`}
                        >
                          {assessment.type}
                        </Badge>
                      </div>
                    </th>
                  ))}
                  <th className='min-w-[100px] p-4 text-center font-semibold text-gray-700'>
                    Average
                  </th>
                  <th className='min-w-[80px] p-4 text-center font-semibold text-gray-700'>
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {gradebookData.map((entry, rowIndex) => {
                  const initials = entry.student.full_name
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={entry.student.id}
                      className={`border-b transition-colors hover:bg-blue-50/50 ${
                        rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      {/* Student Info */}
                      <td className='sticky left-0 z-10 bg-inherit p-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-10 w-10 ring-2 ring-blue-100'>
                            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white'>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-semibold text-gray-900'>
                              {entry.student.full_name}
                            </div>
                            <div className='text-muted-foreground text-xs'>
                              ID: {entry.student.id.slice(-4)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Individual Scores - Editable */}
                      {entry.scores.slice(0, 5).map((score, index) => (
                        <td key={index} className='p-4 text-center'>
                          {score.is_absent ? (
                            <Badge
                              variant='outline'
                              className='border-yellow-200 bg-yellow-50 text-xs text-yellow-700'
                            >
                              Absent
                            </Badge>
                          ) : editingCell?.studentId === entry.student.id &&
                            editingCell?.assessmentIndex === index ? (
                            <div className='flex items-center justify-center gap-2'>
                              <Input
                                type='number'
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className='h-8 w-16 text-center text-sm'
                                min='0'
                                max='100'
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit();
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <div className='flex gap-1'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='h-6 w-6 p-0 text-green-600 hover:bg-green-100'
                                  onClick={saveEdit}
                                >
                                  <Save className='h-3 w-3' />
                                </Button>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='h-6 w-6 p-0 text-red-600 hover:bg-red-100'
                                  onClick={cancelEdit}
                                >
                                  <X className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className='group cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-100'
                              onClick={() =>
                                startEdit(entry.student.id, index, score.score)
                              }
                            >
                              <div className='flex flex-col items-center gap-1'>
                                <div className='flex items-center gap-1'>
                                  <span className='text-lg font-semibold'>
                                    {score.score}
                                  </span>
                                  <Edit3 className='h-3 w-3 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100' />
                                </div>
                                <span className='text-muted-foreground text-xs'>
                                  /100
                                </span>
                              </div>
                            </div>
                          )}
                        </td>
                      ))}

                      {/* Fill empty cells if fewer than 5 scores */}
                      {Array.from({
                        length: Math.max(0, 5 - entry.scores.length)
                      }).map((_, index) => (
                        <td key={`empty-${index}`} className='p-4 text-center'>
                          <div className='text-muted-foreground rounded-lg bg-gray-100 p-2'>
                            <span className='text-sm'>-</span>
                          </div>
                        </td>
                      ))}

                      {/* Average Score */}
                      <td className='p-4 text-center'>
                        <Badge
                          className={`px-3 py-1 text-sm font-semibold ${
                            (entry.average_score || 0) >= 90
                              ? 'border-green-200 bg-green-100 text-green-800'
                              : (entry.average_score || 0) >= 80
                                ? 'border-blue-200 bg-blue-100 text-blue-800'
                                : (entry.average_score || 0) >= 70
                                  ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                                  : 'border-red-200 bg-red-100 text-red-800'
                          }`}
                        >
                          {entry.average_score || 0}%
                        </Badge>
                      </td>

                      {/* Letter Grade */}
                      <td className='p-4 text-center'>
                        <Badge
                          variant='outline'
                          className={`px-3 py-1 text-lg font-bold ${
                            (entry.average_score || 0) >= 90
                              ? 'border-green-300 bg-green-50 text-green-700'
                              : (entry.average_score || 0) >= 80
                                ? 'border-blue-300 bg-blue-50 text-blue-700'
                                : (entry.average_score || 0) >= 70
                                  ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                  : (entry.average_score || 0) >= 60
                                    ? 'border-orange-300 bg-orange-50 text-orange-700'
                                    : 'border-red-300 bg-red-50 text-red-700'
                          }`}
                        >
                          {(entry.average_score || 0) >= 90
                            ? 'A'
                            : (entry.average_score || 0) >= 80
                              ? 'B'
                              : (entry.average_score || 0) >= 70
                                ? 'C'
                                : (entry.average_score || 0) >= 60
                                  ? 'D'
                                  : 'F'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {gradebookData.length === 0 && (
            <div className='text-muted-foreground py-12 text-center'>
              <BookOpen className='mx-auto mb-4 h-16 w-16 opacity-50' />
              <h3 className='mb-2 text-lg font-semibold'>
                No grade records found
              </h3>
              <p className='text-sm'>
                Start by adding assessments to track student progress.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Summary Stats */}
      <div className='grid gap-6 md:grid-cols-4'>
        <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transition-shadow hover:shadow-xl'>
          <CardContent className='pt-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='rounded-full bg-blue-100 p-3'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
              <TrendingUp className='h-4 w-4 text-blue-500' />
            </div>
            <div className='mb-1 text-3xl font-bold text-blue-900'>
              {gradebookData.length}
            </div>
            <p className='text-sm font-medium text-blue-700'>Total Students</p>
            <p className='mt-1 text-xs text-blue-600'>Enrolled in class</p>
          </CardContent>
        </Card>

        <Card className='border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg transition-shadow hover:shadow-xl'>
          <CardContent className='pt-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='rounded-full bg-emerald-100 p-3'>
                <BarChart3 className='h-6 w-6 text-emerald-600' />
              </div>
              <TrendingUp className='h-4 w-4 text-emerald-500' />
            </div>
            <div className='mb-1 text-3xl font-bold text-emerald-900'>
              {classAverage}%
            </div>
            <p className='text-sm font-medium text-emerald-700'>
              Class Average
            </p>
            <p className='mt-1 text-xs text-emerald-600'>
              {classAverage >= 80
                ? 'Excellent performance'
                : classAverage >= 70
                  ? 'Good performance'
                  : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card className='border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 shadow-lg transition-shadow hover:shadow-xl'>
          <CardContent className='pt-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='rounded-full bg-amber-100 p-3'>
                <Target className='h-6 w-6 text-amber-600' />
              </div>
              <TrendingUp className='h-4 w-4 text-amber-500' />
            </div>
            <div className='mb-1 text-3xl font-bold text-amber-900'>
              {passingStudents}
            </div>
            <p className='text-sm font-medium text-amber-700'>
              Passing Students
            </p>
            <p className='mt-1 text-xs text-amber-600'>
              {gradebookData.length > 0
                ? Math.round((passingStudents / gradebookData.length) * 100)
                : 0}
              % pass rate
            </p>
          </CardContent>
        </Card>

        <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg transition-shadow hover:shadow-xl'>
          <CardContent className='pt-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Award className='h-6 w-6 text-purple-600' />
              </div>
              <TrendingUp className='h-4 w-4 text-purple-500' />
            </div>
            <div className='mb-1 text-3xl font-bold text-purple-900'>
              {highPerformers}
            </div>
            <p className='text-sm font-medium text-purple-700'>
              High Performers
            </p>
            <p className='mt-1 text-xs text-purple-600'>90%+ average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution Chart */}
      <Card className='border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl'>
        <CardHeader className='border-b bg-gradient-to-r from-indigo-50 to-purple-50'>
          <CardTitle className='flex items-center gap-3'>
            <div className='rounded-full bg-indigo-100 p-2'>
              <BarChart3 className='h-5 w-5 text-indigo-600' />
            </div>
            <div>
              <h3 className='text-xl font-bold'>Grade Distribution</h3>
              <p className='text-muted-foreground text-sm'>
                Performance overview across all students
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-5 gap-4'>
            {[
              {
                grade: 'A',
                range: '90-100%',
                count: gradebookData.filter((e) => (e.average_score || 0) >= 90)
                  .length,
                color: 'bg-green-500'
              },
              {
                grade: 'B',
                range: '80-89%',
                count: gradebookData.filter(
                  (e) =>
                    (e.average_score || 0) >= 80 && (e.average_score || 0) < 90
                ).length,
                color: 'bg-blue-500'
              },
              {
                grade: 'C',
                range: '70-79%',
                count: gradebookData.filter(
                  (e) =>
                    (e.average_score || 0) >= 70 && (e.average_score || 0) < 80
                ).length,
                color: 'bg-yellow-500'
              },
              {
                grade: 'D',
                range: '60-69%',
                count: gradebookData.filter(
                  (e) =>
                    (e.average_score || 0) >= 60 && (e.average_score || 0) < 70
                ).length,
                color: 'bg-orange-500'
              },
              {
                grade: 'F',
                range: '0-59%',
                count: gradebookData.filter((e) => (e.average_score || 0) < 60)
                  .length,
                color: 'bg-red-500'
              }
            ].map((item) => (
              <div key={item.grade} className='text-center'>
                <div className='mb-3'>
                  <div
                    className={`h-32 w-full ${item.color} relative overflow-hidden rounded-lg`}
                  >
                    <div
                      className='absolute bottom-0 left-0 w-full bg-white/20 transition-all duration-500'
                      style={{
                        height:
                          gradebookData.length > 0
                            ? `${(item.count / gradebookData.length) * 100}%`
                            : '0%'
                      }}
                    />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <span className='text-2xl font-bold text-white'>
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='text-lg font-bold'>{item.grade}</div>
                  <div className='text-muted-foreground text-xs'>
                    {item.range}
                  </div>
                  <div className='text-sm font-medium'>
                    {gradebookData.length > 0
                      ? Math.round((item.count / gradebookData.length) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
