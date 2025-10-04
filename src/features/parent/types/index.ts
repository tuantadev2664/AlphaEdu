// Parent Types based on database schema
// Extends student types for parent-specific functionality

export * from '@/features/student/types';

import type {
  Student,
  Teacher,
  User,
  Class,
  Term,
  Score,
  BehaviorNote,
  Announcement,
  Assessment,
  Message,
  Subject
} from '@/features/student/types';

// Parent-specific types
export interface ParentStudent {
  parent_id: string;
  student_id: string;
  relationship: string; // 'father', 'mother', 'guardian', etc.
  student?: Student;
}

export interface ParentUser extends User {
  role: 'parent';
  children?: Student[];
  relationships?: ParentStudent[];
}

// Parent Dashboard - shows overview of all children
export interface ParentDashboard {
  parent: ParentUser;
  children: Array<{
    student: Student;
    current_class: Class;
    current_term: Term;
    recent_scores: Score[];
    behavior_summary: {
      excellent_count: number;
      good_count: number;
      fair_count: number;
      needs_improvement_count: number;
      poor_count: number;
    };
    latest_behavior_note?: BehaviorNote | null;
    upcoming_assessments: Assessment[];
    overall_average: number;
    class_rank?: number;
  }>;
  recent_announcements: Announcement[];
  unread_messages_count: number;
}

// Child Detail View - detailed view of one child
export interface ChildDetailView {
  parent: ParentUser;
  child: Student;
  current_class: Class;
  current_term: Term;
  subjects: Array<{
    subject: Subject;
    teacher: Teacher;
    grade_components: any[];
    scores: Score[];
    average_score: number;
    letter_grade: string;
  }>;
  behavior_notes: BehaviorNote[];
  behavior_summary: {
    excellent_count: number;
    good_count: number;
    fair_count: number;
    needs_improvement_count: number;
    poor_count: number;
  };
  upcoming_assessments: Assessment[];
  recent_announcements: Announcement[];
  overall_average: number;
  class_rank?: number;
}

// Teacher Communication
export interface TeacherContact {
  teacher: Teacher;
  subjects: Subject[];
  class: Class;
  last_message?: Message;
  unread_count: number;
}

export interface ParentTeacherCommunication {
  parent: ParentUser;
  child: Student;
  teachers: TeacherContact[];
  recent_messages: Message[];
}

// Conversation thread
export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  last_message?: Message;
  unread_count: number;
  subject_context?: Subject;
  student_context?: Student;
}

// Parent-specific form types
export interface ParentProfileForm {
  full_name: string;
  email: string;
  phone: string;
  emergency_contact?: string;
}

export interface MessageForm {
  receiver_id: string;
  content: string;
  subject?: string;
  student_id?: string; // Context for which child
  subject_id?: string; // Context for which subject
}

// API: /api/Score/parent/children/full-info/{termId}
export interface ParentChildFullInfoScoreItem {
  id: string;
  studentId: string;
  assessmentId: string;
  score1: number;
  isAbsent: boolean;
  comment: string;
  assessmentName: string;
  gradeComponentName: string;
  weight: number;
}

export interface ParentChildFullInfoTranscriptSubjectItem {
  subjectName: string;
  averageScore: number;
}

export interface ParentChildFullInfoTranscript {
  termId: string;
  termName: string;
  subjects: ParentChildFullInfoTranscriptSubjectItem[];
}

export interface ParentChildFullInfoBehaviorNoteItem {
  id: string;
  note: string;
  level: string;
  createdAt: string;
  teacherId: string;
  teacherName: string;
}

export interface ParentChildFullInfoAnnouncementItem {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  createdAt: string;
  expiresAt: string | null;
  senderId: string;
  classId: string;
  subjectId: string;
}

export interface ParentChildFullInfoSubjectAssessmentItem {
  assessmentId: string;
  title: string;
  dueDate: string;
  score: number;
  isAbsent: boolean;
  comment: string;
}

export interface ParentChildFullInfoSubjectComponentItem {
  gradeComponentId: string;
  componentName: string;
  kind: string;
  weight: number;
  maxScore: number;
  assessments: ParentChildFullInfoSubjectAssessmentItem[];
}

export interface ParentChildFullInfoSubjectItem {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  components: ParentChildFullInfoSubjectComponentItem[];
}

export interface ParentChildFullInfoItem {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  scores: ParentChildFullInfoScoreItem[];
  transcript: ParentChildFullInfoTranscript;
  behaviorNotes: ParentChildFullInfoBehaviorNoteItem[];
  announcements: ParentChildFullInfoAnnouncementItem[];
  subjects: ParentChildFullInfoSubjectItem[];
  overallAverage?: number;
}

export type ParentChildrenFullInfoResponse = ParentChildFullInfoItem[];

export interface ParentServiceError {
  message: string;
  status?: number;
}

// Mock data for communication
export interface ParentCommunicationItem {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived';
}

export interface ParentCommunicationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}
