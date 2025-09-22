// Fake data for teacher feature
// Add to mock-api.ts

import { faker } from '@faker-js/faker';
import {
  Teacher,
  Class,
  Student,
  Subject,
  RosterStudent,
  GradebookEntry,
  BehaviorNote,
  Announcement,
  Message
} from '@/features/teacher/types';

export const fakeTeachers: Teacher[] = Array.from({ length: 3 }).map(
  (_, i) => ({
    id: faker.string.uuid(),
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    school_id: 'school-1',
    created_at: faker.date.past().toISOString(),
    role: 'teacher'
  })
);

export const fakeClasses: Class[] = Array.from({ length: 4 }).map((_, i) => ({
  id: faker.string.uuid(),
  grade_id: 'grade-1',
  name: `Class ${i + 1}A`,
  homeroom_teacher_id: fakeTeachers[0].id
}));

export const fakeStudents: Student[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: faker.string.uuid(),
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    school_id: 'school-1',
    created_at: faker.date.past().toISOString(),
    role: 'student'
  })
);

export const fakeSubjects: Subject[] = [
  {
    id: 'subj-1',
    code: 'MATH',
    name: 'Mathematics',
    level: 'primary',
    is_active: true
  },
  {
    id: 'subj-2',
    code: 'ENG',
    name: 'English',
    level: 'primary',
    is_active: true
  },
  {
    id: 'subj-3',
    code: 'SCI',
    name: 'Science',
    level: 'primary',
    is_active: true
  }
];

export const fakeRoster: RosterStudent[] = fakeStudents
  .slice(0, 10)
  .map((s, i) => ({
    ...s,
    class_id: fakeClasses[0].id,
    academic_year_id: 'year-1'
  }));

// export const fakeGradebook: GradebookEntry[] = fakeRoster.map((student) => ({
//   student_id: student.id,
//   student_name: student.full_name,
//   subject_id: fakeSubjects[0].id,
//   subject_name: fakeSubjects[0].name,
//   class_id: student.class_id,
//   scores: [
//     {
//       assessment_id: faker.string.uuid(),
//       assessment_title: 'Quiz 1',
//       score: faker.number.int({ min: 5, max: 10 }),
//       max_score: 10,
//       kind: 'quiz',
//       comment: 'Good job'
//     },
//     {
//       assessment_id: faker.string.uuid(),
//       assessment_title: 'Test 1',
//       score: faker.number.int({ min: 5, max: 10 }),
//       max_score: 10,
//       kind: 'test'
//     }
//   ],
// }));

// export const fakeBehaviorNotes: BehaviorNote[] = fakeRoster.map((student) => ({
//   id: faker.string.uuid(),
//   student_id: student.id,
//   class_id: student.class_id,
//   term_id: 'term-1',
//   note: 'Participated actively in class.',
//   level: 'positive',
//   created_by: fakeTeachers[0].id,
//   created_at: faker.date.recent().toISOString()
// }));

export const fakeAnnouncements: Announcement[] = [
  {
    id: faker.string.uuid(),
    sender_id: fakeTeachers[0].id,
    class_id: fakeClasses[0].id,
    subject_id: fakeSubjects[0].id,
    title: 'Welcome to the new semester!',
    content: 'Let’s have a great year together.',
    created_at: faker.date.recent().toISOString(),
    expires_at: faker.date.soon().toISOString(),
    is_urgent: false
  }
];

export const fakeMessages: Message[] = [
  {
    id: faker.string.uuid(),
    sender_id: fakeTeachers[0].id,
    receiver_id: fakeStudents[0].id,
    content: 'Please remember to submit your homework.',
    created_at: faker.date.recent().toISOString(),
    is_read: false
  }
];
