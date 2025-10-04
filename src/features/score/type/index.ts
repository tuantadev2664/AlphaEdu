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

// Ranking API Types
export type ClassRankingItem = {
  studentId: string;
  fullName: string;
  average: number;
  rank: number;
};

export type ClassRankingResponse = ClassRankingItem[];

export type GetClassRankingParams = {
  classId: string;
  termId: string;
};

// Student Transcript API Types
export type StudentTranscriptResponse = Record<string, number | null>;

export type GetStudentTranscriptParams = {
  studentId: string;
  termId: string;
};

// Student Analysis API Types
export interface StudentAnalysisComponent {
  gradeComponentId: string;
  gradeComponentName: string;
  kind: string;
  weight: number;
  maxScore: number;
  average: number;
  count: number;
  belowThresholdCount: number;
  riskLevel: string;
  comment: string;
  scores: number[];
}

export interface StudentAnalysisSubject {
  subjectId: string;
  subjectName: string;
  average: number;
  assignmentsCount: number;
  belowThresholdCount: number;
  riskLevel: string;
  comment: string;
  components: StudentAnalysisComponent[];
}

export interface StudentAnalysisResponse {
  studentId: string;
  termId: string;
  fullName: string;
  average: number;
  belowCount: number;
  riskLevel: string;
  comment: string;
  subjects: StudentAnalysisSubject[];
  summary: string;
}

export type GetStudentAnalysisParams = {
  studentId: string;
  termId: string;
};
