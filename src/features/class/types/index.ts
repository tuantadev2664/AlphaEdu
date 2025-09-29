// Types for Class Feature
// Based on API response and db.txt structure

// Enums
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

// Base types from API response
export type ClassStudent = {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  schoolId: string;
  createdAt: string;
  announcements: any[];
  behaviorNoteCreatedByNavigations: any[];
  behaviorNoteStudents: any[];
  classEnrollments: any[];
  classes: any[];
  messageReceivers: any[];
  messageSenders: any[];
  parentStudentParents: any[];
  parentStudentStudents: any[];
  school: any | null;
  scoreCreatedByNavigations: any[];
  scoreStudents: any[];
  teacherAssignments: any[];
};

// API Parameters
export type GetClassStudentsParams = {
  classId: string;
  academicYearId: string;
};

// API Response
export type GetClassStudentsResponse = ClassStudent[];

// UI-specific types
export type ClassStudentWithStats = ClassStudent & {
  averageScore?: number;
  attendanceRate?: number;
  behaviorNotesCount?: number;
  totalAssignments?: number;
  completedAssignments?: number;
};

// For roster/gradebook display
export type StudentRosterEntry = {
  student: ClassStudent;
  enrollment?: {
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'transferred';
  };
  performance?: {
    currentGrade: number;
    trend: 'improving' | 'declining' | 'stable';
    lastUpdated: string;
  };
};

// Form types
export type AddStudentToClassForm = {
  studentId: string;
  classId: string;
  academicYearId: string;
};

export type RemoveStudentFromClassForm = {
  studentId: string;
  classId: string;
  academicYearId: string;
};
