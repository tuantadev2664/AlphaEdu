// Types for Teacher Feature
// Generated from db.txt

// Enums
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
  | 'excellent'
  | 'good'
  | 'fair'
  | 'needs_improvement'
  | 'poor';

// Core entities
export type School = {
  id: string;
  name: string;
  district: string;
  city: string;
  created_at: string;
};

export type AcademicYear = {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
};

export type Term = {
  id: string;
  academic_year_id: string;
  code: TermCode;
  start_date: string;
  end_date: string;
};

export type Grade = {
  id: string;
  school_id: string;
  level: EduLevel;
  grade_number: number;
};

export type Class = {
  id: string;
  grade_id: string;
  name: string;
  homeroom_teacher_id: string;
  grade?: Grade;
  homeroom_teacher?: Teacher;
  student_count?: number;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  level: EduLevel;
  is_active: boolean;
};

export type User = {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  school_id: string;
  created_at: string;
};

export type Teacher = User & {
  role: 'teacher';
  classes?: Class[];
  subjects?: Subject[];
};

export type Student = User & {
  role: 'student';
  class_id?: string;
  class?: Class;
  parents?: Parent[];
};

export type Parent = User & {
  role: 'parent';
  students?: Student[];
};

// Relationships
export type ParentStudent = {
  parent_id: string;
  student_id: string;
  relationship: string;
};

export type ClassEnrollment = {
  id: string;
  class_id: string;
  student_id: string;
  academic_year_id: string;
  class?: Class;
  student?: Student;
  academic_year?: AcademicYear;
};

export type TeacherAssignment = {
  id: string;
  teacher_id: string;
  class_id: string;
  subject_id: string;
  academic_year_id: string;
  teacher?: Teacher;
  class?: Class;
  subject?: Subject;
  academic_year?: AcademicYear;
};

// Assessment & Grading
export type GradeComponent = {
  id: string;
  class_id: string;
  subject_id: string;
  term_id: string;
  name: string;
  kind: AssessmentKind;
  weight: number;
  max_score: number;
  position: number;
  class?: Class;
  subject?: Subject;
  term?: Term;
};

export type Assessment = {
  id: string;
  grade_component_id: string;
  title: string;
  due_date: string;
  description: string;
  grade_component?: GradeComponent;
};

export type Score = {
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
};

// Behavior & Communication
export type BehaviorNote = {
  id: string;
  student_id: string;
  studentName?: string;
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
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
};

export type Announcement = {
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
};

// Composite types for UI
export type RosterStudent = Student & {
  enrollment?: ClassEnrollment;
  behavior_notes_count?: number;
  average_score?: number;
};

export type GradebookEntry = {
  student: Student;
  scores: Score[];
  average_score?: number;
  total_possible?: number;
};

export type TeacherDashboardStats = {
  total_classes: number;
  total_students: number;
  pending_assignments: number;
  unread_messages: number;
  recent_announcements: Announcement[];
  upcoming_assessments: Assessment[];
};

// Form types
export type CreateAnnouncementForm = {
  title: string;
  content: string;
  classId?: string;
  subjectId?: string;
  expiresAt: string;
  isUrgent: boolean;
};

// Announcement CRUD API types
export type CreateAnnouncementRequest = {
  title: string;
  content: string;
  classId: string;
  subjectId?: string;
  expiresAt: string;
  isUrgent: boolean;
};

export type CreateAnnouncementResponse = TeacherAnnouncementItem;

export type UpdateAnnouncementRequest = {
  id: string;
  title: string;
  content: string;
  classId: string;
  subjectId?: string;
  expiresAt: string;
  isUrgent: boolean;
};

export type UpdateAnnouncementResponse = TeacherAnnouncementItem;

export type DeleteAnnouncementResponse = {
  success: boolean;
  message: string;
};

export type CreateBehaviorNoteForm = {
  student_id: string;
  class_id: string;
  term_id: string;
  note: string;
  level: BehaviorLevel;
};

export type CreateScoreForm = {
  assessment_id: string;
  student_scores: Array<{
    student_id: string;
    score?: number;
    is_absent: boolean;
    comment?: string;
  }>;
};

export type CreateAssessmentForm = {
  grade_component_id: string;
  title: string;
  due_date: string;
  description: string;
};

// API Response types
export type TeacherClass = {
  id: string;
  gradeId: string;
  name: string;
  homeroomTeacherId: string;
  announcements?: Announcement[];
  behaviorNotes?: BehaviorNote[];
  classEnrollments?: ClassEnrollment[];
  grade?: Grade | null;
  gradeComponents?: GradeComponent[];
  homeroomTeacher?: Teacher | null;
  teacherAssignments?: TeacherAssignment[];
  studentCount?: number;
};

export type GetTeacherClassesParams = {
  academicYearId?: string;
};

export type GetTeacherClassesResponse = TeacherClass[];

// Student Detail API Response types
export type StudentDetailClass = {
  classId: string;
  className: string;
  gradeName: string;
  academicYearName: string;
};

export type StudentDetailParent = {
  fullName: string;
  phone: string;
};

export type StudentDetailScore = {
  subject: string;
  component: string;
  score: number;
  weight: number;
};

export type StudentDetailResponse = {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  classes: StudentDetailClass[];
  parents: StudentDetailParent[];
  behaviorNotes: string[];
  scores: StudentDetailScore[];
};

// Behavior Note API types
export type CreateBehaviorNoteRequest = {
  studentId: string;
  classId: string;
  termId: string;
  note: string;
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor';
};

export type CreateBehaviorNoteResponse = {
  id: string;
  studentId: string;
  classId: string;
  termId: string;
  note: string;
  level: string;
  createdBy: string;
  createdAt: string;
};

export type UpdateBehaviorNoteRequest = {
  id: string;
  note: string;
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs improvement' | 'Poor';
};

export type UpdateBehaviorNoteResponse = {
  id: string;
  studentId: string;
  classId: string;
  termId: string;
  note: string;
  level: string;
  createdBy: string;
  createdAt: string;
  // updatedAt?: string;
};

export type DeleteBehaviorNoteResponse = string;

// Teacher Announcement API types
export interface TeacherAnnouncementClass {
  id: string;
  gradeId: string;
  name: string;
  homeroomTeacherId: string;
  announcements: any[];
  behaviorNotes: any[];
  classEnrollments: any[];
  grade: any;
  gradeComponents: any[];
  homeroomTeacher: TeacherAnnouncementSender | null;
  teacherAssignments: any[];
}

export interface TeacherAnnouncementSender {
  id: string;
  role: 'teacher' | 'student' | 'parent' | 'admin' | string;
  fullName: string;
  email: string;
  phone: string;
  schoolId: string;
  createdAt: string;
  announcements: any[];
  behaviorNoteCreatedByNavigations: any[];
  behaviorNoteStudents: any[];
  classEnrollments: any[];
  classes: TeacherAnnouncementClass[];
  messageReceivers: any[];
  messageSenders: any[];
  parentStudentParents: any[];
  parentStudentStudents: any[];
  school: any;
  scoreCreatedByNavigations: any[];
  scoreStudents: any[];
  teacherAssignments: any[];
}

export interface TeacherAnnouncementSubject {
  id: string;
  code: string;
  name: string;
  level: string;
  isActive: boolean;
  announcements: any[];
  gradeComponents: any[];
  teacherAssignments: any[];
}

export interface TeacherAnnouncementItem {
  id: string;
  senderId: string;
  classId: string | null;
  subjectId: string | null;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string | null;
  isUrgent: boolean;
  class?: TeacherAnnouncementClass | null;
  sender?: TeacherAnnouncementSender | null;
  subject?: TeacherAnnouncementSubject | null;
}

export type TeacherAnnouncementResponse = TeacherAnnouncementItem[];
