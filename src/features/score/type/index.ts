// Score API Types

export type AssessmentKind =
  | 'quiz'
  | 'test'
  | 'midterm'
  | 'final'
  | 'project'
  | 'oral'
  | 'attendance'
  | 'other';

export type Score = {
  scoreId: string;
  gradeComponentId: string;
  gradeComponentName: string;
  kind: AssessmentKind;
  weight: number;
  maxScore: number;
  assessmentId: string;
  assessmentName: string;
  score: number;
  isAbsent: boolean;
  comment: string | null;
  position?: number;
};

export type StudentScore = {
  studentId: string;
  fullName: string;
  scores: Score[];
};

export type GetScoresParams = {
  classId: string;
  subjectId: string;
  termId: string;
};

export type GetScoresResponse = StudentScore[];

// Utility types for score calculations
export type ScoreStats = {
  average: number;
  highest: number;
  lowest: number;
  totalStudents: number;
  passedStudents: number;
  passRate: number;
};

export type StudentScoreStats = {
  studentId: string;
  fullName: string;
  totalScore: number;
  averageScore: number;
  completedAssessments: number;
  totalAssessments: number;
  completionRate: number;
};

// Update Score Types
export type UpdateScoreRequest = {
  id: string;
  score1: number;
  isAbsent: boolean;
  comment?: string;
};

export type UpdateScoreResponse = {
  success: boolean;
  message: string;
  data?: Score;
};

// Add Assessment Types
export type CreateAssessmentRequest = {
  classId: string;
  subjectId: string;
  termId: string;
  academicYearId: string;
  gradeComponent: {
    name: string;
    kind: AssessmentKind;
    weight: number;
    maxScore: number;
    position: number;
  };
  assessment: {
    title: string;
    dueDate: string;
    description?: string;
  };
  initializeScores: boolean;
};

export type CreateAssessmentResponse = {
  success: boolean;
  message: string;
  data?: {
    gradeComponentId: string;
    assessmentId: string;
  };
};
