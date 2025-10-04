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

// Class Details API Types (new endpoint)
export type EduLevel = 'primary' | 'lower_secondary' | 'upper_secondary';

// Student info from class details
export type ClassDetailsStudent = {
  studentId: string;
  fullName: string;
};

// Subject info from class details
export type ClassSubject = {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
};

// Class details response from API
export type ClassDetails = {
  classId: string;
  className: string;
  gradeName: EduLevel;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  studentCount: number;
  students: ClassDetailsStudent[];
  subjects: ClassSubject[];
};

// API Parameters for class details
export type GetClassDetailsParams = {
  classId: string;
  academicYearId: string;
};

// API Response for class details
export type GetClassDetailsResponse = ClassDetails;

// UI-specific types for class details
export type ClassDetailsWithStats = ClassDetails & {
  averageClassSize?: number;
  totalSubjects?: number;
  activeStudents?: number;
};

// For detailed class view
export type ClassOverview = {
  classInfo: ClassDetails;
  stats: {
    totalStudents: number;
    totalSubjects: number;
    homeroomTeacher: string;
    gradeLevel: string;
  };
};

// Form types for class details
export type UpdateClassDetailsForm = {
  className: string;
  homeroomTeacherId: string;
};

export type AssignSubjectTeacherForm = {
  subjectId: string;
  teacherId: string;
  classId: string;
  academicYearId: string;
};
