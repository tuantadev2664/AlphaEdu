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
