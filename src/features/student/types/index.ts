// Student Types based on database schema

export type EduLevel = 'primary' | 'lower_secondary' | 'upper_secondary';
export type TermCode = 'S1' | 'S2';
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type AssessmentKind =
  | 'quiz'
  | 'test'
  | 'midterm'
  | 'final'
  | 'project'
  | 'oral'
  | 'attendance'
  | 'other';
export type BehaviorLevel =
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Needs improvement'
  | 'Poor';

// Core entities
export interface School {
  id: string;
  name: string;
  district: string;
  city: string;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface Term {
  id: string;
  academic_year_id: string;
  code: TermCode;
  start_date: string;
  end_date: string;
}

export interface Grade {
  id: string;
  school_id: string;
  level: EduLevel;
  grade_number: number;
}

export interface Class {
  id: string;
  grade_id: string;
  name: string;
  homeroom_teacher_id: string;
  grade?: Grade;
  student_count?: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: EduLevel;
  is_active: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  school_id: string;
  created_at: string;
}

export interface Student extends User {
  role: 'student';
  class_id?: string;
  class?: Class;
  parent_id?: string;
}

export interface Teacher extends User {
  role: 'teacher';
}

export interface Parent extends User {
  role: 'parent';
  children?: Student[];
}

// Academic entities
export interface ClassEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  academic_year_id: string;
  class?: Class;
  student?: Student;
}

export interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_id: string;
  subject_id: string;
  academic_year_id: string;
  teacher?: Teacher;
  class?: Class;
  subject?: Subject;
}

export interface GradeComponent {
  id: string;
  class_id: string;
  subject_id: string;
  term_id: string;
  name: string;
  kind: AssessmentKind;
  weight: number;
  max_score: number;
  position: number;
  subject?: Subject;
}

export interface Assessment {
  id: string;
  grade_component_id: string;
  title: string;
  due_date: string;
  description: string;
  grade_component?: GradeComponent;
}

export interface Score {
  id: string;
  assessment_id: string;
  student_id: string;
  score: number;
  is_absent: boolean;
  comment?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assessment?: Assessment;
  student?: Student;
  created_by_user?: Teacher;
}

export interface BehaviorNote {
  id: string;
  student_id: string;
  class_id: string;
  term_id: string;
  note: string;
  level: BehaviorLevel;
  created_by: string;
  created_at: string;
  student?: Student;
  class?: Class;
  term?: Term;
  created_by_user?: Teacher;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
}

export interface Announcement {
  id: string;
  sender_id: string;
  class_id?: string;
  subject_id?: string;
  title: string;
  content: string;
  created_at: string;
  expires_at: string;
  is_urgent: boolean;
  sender?: Teacher;
  class?: Class;
  subject?: Subject;
}

// Student-specific view types
export interface StudentDashboard {
  student: Student;
  current_class: Class;
  current_term: Term;
  recent_scores: Score[];
  recent_announcements: Announcement[];
  behavior_summary: {
    excellent_count: number;
    good_count: number;
    fair_count: number;
    needs_improvement_count: number;
    poor_count: number;
  };
  upcoming_assessments: Assessment[];
  latest_behavior_note?: BehaviorNote | null;
}

export interface StudentGrades {
  student: Student;
  term: Term;
  subjects: Array<{
    subject: Subject;
    grade_components: GradeComponent[];
    scores: Score[];
    average_score: number;
    letter_grade: string;
  }>;
  overall_average: number;
  class_rank?: number;
}

export interface StudentSchedule {
  student: Student;
  class: Class;
  subjects: Array<{
    subject: Subject;
    teacher: Teacher;
    schedule_time?: string;
  }>;
}

// Form types
export interface StudentProfileForm {
  full_name: string;
  email: string;
  phone: string;
}

// API Response types for /api/Subject/student/{studentId}
export interface StudentSubjectAssessment {
  assessmentId: string;
  title: string;
  dueDate: string;
  score: number;
  isAbsent: boolean;
  comment: string;
}

export interface StudentSubjectComponent {
  gradeComponentId: string;
  componentName: string;
  kind: AssessmentKind;
  weight: number;
  maxScore: number;
  assessments: StudentSubjectAssessment[];
}

export interface StudentSubjectData {
  subjectId: string;
  subjectName: string;
  components: StudentSubjectComponent[];
}

export type StudentSubjectsResponse = StudentSubjectData[];

// Behavior API response and computed types
export interface BehaviorNoteData {
  id: string;
  note: string;
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor' | string;
  createdAt: string;
  term?: {
    termId: string;
    termName: string;
  } | null;
  teacher?: {
    createdBy: string;
    teacherName: string;
  } | null;
}

export interface BehaviorSummary {
  excellent_count: number;
  good_count: number;
  fair_count: number;
  needs_improvement_count: number;
  poor_count: number;
}

export type BehaviorNoteResponse = BehaviorNoteData[];

// Student Overview API types (/api/Student/{id})
export interface StudentOverviewClassInfo {
  classId: string;
  className: string;
  gradeName: string; // matches API values like 'primary'
  academicYearName: string; // e.g., '2025-2026'
}

export interface StudentOverviewParentInfo {
  fullName: string;
  phone: string;
}

export interface StudentOverviewScoreItem {
  subject: string;
  component: string;
  score: number;
  weight: number;
}

export interface StudentOverviewResponse {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  classes: StudentOverviewClassInfo[];
  parents: StudentOverviewParentInfo[];
  behaviorNotes: string[];
  scores: StudentOverviewScoreItem[];
}

// Announcement API response types (/api/Announcement/class/{classId})
export interface AnnouncementSender {
  id: string;
  role: 'teacher' | 'student' | 'parent' | 'admin' | string;
  fullName: string;
  email: string;
  phone: string;
  schoolId: string;
  createdAt: string;
}

export interface AnnouncementSubject {
  id: string;
  code: string;
  name: string;
  level: string;
  isActive: boolean;
}

export interface AnnouncementItem {
  id: string;
  senderId: string;
  classId: string | null;
  subjectId: string | null;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string | null;
  isUrgent: boolean;
  class?: unknown | null;
  sender?: AnnouncementSender | null;
  subject?: AnnouncementSubject | null;
}

export type AnnouncementItemResponse = AnnouncementItem[];
