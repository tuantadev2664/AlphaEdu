////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

////////////////////////////////////////////////////////////////////////////////
// Teacher Feature Mock Data
////////////////////////////////////////////////////////////////////////////////

import {
  Teacher,
  Student,
  Class,
  Subject,
  Announcement,
  Message,
  BehaviorNote,
  Score,
  Assessment,
  GradeComponent,
  TeacherDashboardStats,
  RosterStudent,
  GradebookEntry,
  EduLevel,
  AssessmentKind,
  BehaviorLevel,
  Term,
  AcademicYear
} from '@/features/teacher/types';

// Mock teacher data store
export const fakeTeacher = {
  // Current teacher (logged in)
  currentTeacher: {
    id: 'teacher-1',
    role: 'teacher' as const,
    full_name: 'Ms. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1-555-0123',
    school_id: 'school-1',
    created_at: '2023-08-15T08:00:00Z'
  } as Teacher,

  // Classes data
  classes: [
    {
      id: 'class-1',
      grade_id: 'grade-7',
      name: '7A',
      homeroom_teacher_id: 'teacher-1',
      student_count: 28,
      grade: {
        id: 'grade-7',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 7
      }
    },
    {
      id: 'class-2',
      grade_id: 'grade-7',
      name: '7B',
      homeroom_teacher_id: 'teacher-2',
      student_count: 26,
      grade: {
        id: 'grade-7',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 7
      }
    },
    {
      id: 'class-3',
      grade_id: 'grade-8',
      name: '8A Mathematics',
      homeroom_teacher_id: 'teacher-1',
      student_count: 32,
      grade: {
        id: 'grade-8',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 8
      }
    },
    {
      id: 'class-4',
      grade_id: 'grade-8',
      name: '8B Science',
      homeroom_teacher_id: 'teacher-1',
      student_count: 29,
      grade: {
        id: 'grade-8',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 8
      }
    },
    {
      id: 'class-5',
      grade_id: 'grade-9',
      name: '9A Advanced Math',
      homeroom_teacher_id: 'teacher-1',
      student_count: 25,
      grade: {
        id: 'grade-9',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 9
      }
    },
    {
      id: 'class-6',
      grade_id: 'grade-6',
      name: '6C English',
      homeroom_teacher_id: 'teacher-1',
      student_count: 30,
      grade: {
        id: 'grade-6',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 6
      }
    },
    {
      id: 'class-7',
      grade_id: 'grade-7',
      name: '7C Honors',
      homeroom_teacher_id: 'teacher-1',
      student_count: 24,
      grade: {
        id: 'grade-7',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 7
      }
    },
    {
      id: 'class-8',
      grade_id: 'grade-8',
      name: '8C Literature',
      homeroom_teacher_id: 'teacher-1',
      student_count: 27,
      grade: {
        id: 'grade-8',
        school_id: 'school-1',
        level: 'lower_secondary' as EduLevel,
        grade_number: 8
      }
    }
  ] as Class[],

  // Students data - distributed across all classes
  students: Array.from({ length: 195 }, (_, i) => {
    // Distribute students across classes based on student_count
    let classId = 'class-1';
    if (i < 28)
      classId = 'class-1'; // 28 students
    else if (i < 54)
      classId = 'class-2'; // 26 students
    else if (i < 86)
      classId = 'class-3'; // 32 students
    else if (i < 115)
      classId = 'class-4'; // 29 students
    else if (i < 140)
      classId = 'class-5'; // 25 students
    else if (i < 170)
      classId = 'class-6'; // 30 students
    else if (i < 194)
      classId = 'class-7'; // 24 students
    else classId = 'class-8'; // 27 students

    return {
      id: `student-${i + 1}`,
      role: 'student' as const,
      full_name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      school_id: 'school-1',
      created_at: faker.date.past().toISOString(),
      class_id: classId
    };
  }) as Student[],

  // Subjects
  subjects: [
    {
      id: 'math-7',
      code: 'MATH7',
      name: 'Mathematics Grade 7',
      level: 'lower_secondary' as EduLevel,
      is_active: true
    },
    {
      id: 'english-7',
      code: 'ENG7',
      name: 'English Grade 7',
      level: 'lower_secondary' as EduLevel,
      is_active: true
    },
    {
      id: 'science-7',
      code: 'SCI7',
      name: 'Science Grade 7',
      level: 'lower_secondary' as EduLevel,
      is_active: true
    },
    {
      id: 'history-7',
      code: 'HIST7',
      name: 'History Grade 7',
      level: 'lower_secondary' as EduLevel,
      is_active: true
    }
  ] as Subject[],

  // Terms
  terms: [
    {
      id: 'term-s1-2024',
      academic_year_id: 'ay-2024',
      code: 'S1' as const,
      start_date: '2024-09-01',
      end_date: '2024-12-20'
    },
    {
      id: 'term-s2-2024',
      academic_year_id: 'ay-2024',
      code: 'S2' as const,
      start_date: '2025-01-06',
      end_date: '2025-05-30'
    }
  ] as Term[],

  // Academic Year
  academicYear: {
    id: 'ay-2024',
    school_id: 'school-1',
    name: '2024-2025',
    start_date: '2024-09-01',
    end_date: '2025-05-30'
  } as AcademicYear,

  // Announcements
  announcements: Array.from({ length: 15 }, (_, i) => ({
    id: `announcement-${i + 1}`,
    sender_id: 'teacher-1',
    class_id: i % 3 === 0 ? 'class-1' : i % 3 === 1 ? 'class-2' : undefined,
    subject_id: i % 4 === 0 ? 'math-7' : undefined,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(2),
    created_at: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_urgent: faker.datatype.boolean(0.2)
  })) as Announcement[],

  // Messages
  messages: Array.from({ length: 35 }, (_, i) => ({
    id: `message-${i + 1}`,
    sender_id:
      i % 2 === 0
        ? 'teacher-1'
        : `student-${faker.number.int({ min: 1, max: 195 })}`,
    receiver_id:
      i % 2 === 0
        ? `student-${faker.number.int({ min: 1, max: 195 })}`
        : 'teacher-1',
    content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    created_at: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    is_read: faker.datatype.boolean(0.7)
  })) as Message[],

  // Behavior Notes
  behaviorNotes: Array.from({ length: 45 }, (_, i) => ({
    id: `behavior-${i + 1}`,
    student_id: `student-${faker.number.int({ min: 1, max: 195 })}`,
    class_id: faker.helpers.arrayElement([
      'class-1',
      'class-2',
      'class-3',
      'class-4',
      'class-5',
      'class-6',
      'class-7',
      'class-8'
    ]),
    term_id: 'term-s1-2024',
    note: faker.lorem.sentence(),
    level: faker.helpers.arrayElement([
      'excellent',
      'good',
      'fair',
      'needs_improvement',
      'poor'
    ]) as BehaviorLevel,
    created_by: 'teacher-1',
    created_at: new Date(
      Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
    ).toISOString()
  })) as BehaviorNote[],

  // API methods
  async getTeacherClasses(teacherId: string = 'teacher-1') {
    await delay(500);
    return {
      success: true,
      classes: this.classes.filter((c) => c.homeroom_teacher_id === teacherId)
    };
  },

  async getClassStudents(classId: string) {
    await delay(500);
    const students = this.students.filter((s) => s.class_id === classId);
    const rosterStudents: RosterStudent[] = students.map((student) => ({
      ...student,
      behavior_notes_count: this.behaviorNotes.filter(
        (n) => n.student_id === student.id
      ).length,
      average_score: faker.number.int({ min: 65, max: 95 })
    }));

    return {
      success: true,
      students: rosterStudents,
      total: rosterStudents.length
    };
  },

  async getTeacherAnnouncements(
    teacherId: string = 'teacher-1',
    filters: any = {}
  ) {
    await delay(500);
    let announcements = this.announcements.filter(
      (a) => a.sender_id === teacherId
    );

    if (filters.class_id) {
      announcements = announcements.filter(
        (a) => a.class_id === filters.class_id || !a.class_id
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    return {
      success: true,
      announcements: announcements.slice(offset, offset + limit),
      total: announcements.length
    };
  },

  async getTeacherMessages(teacherId: string = 'teacher-1', filters: any = {}) {
    await delay(500);
    let messages = this.messages.filter(
      (m) => m.sender_id === teacherId || m.receiver_id === teacherId
    );

    if (filters.unread_only) {
      messages = messages.filter(
        (m) => !m.is_read && m.receiver_id === teacherId
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    return {
      success: true,
      messages: messages.slice(offset, offset + limit),
      total: messages.length
    };
  },

  async getBehaviorNotes(classId?: string, studentId?: string) {
    await delay(500);
    let notes = [...this.behaviorNotes];

    if (classId) {
      notes = notes.filter((n) => n.class_id === classId);
    }

    if (studentId) {
      notes = notes.filter((n) => n.student_id === studentId);
    }

    return {
      success: true,
      notes,
      total: notes.length
    };
  },

  async getTeacherDashboardStats(
    teacherId: string = 'teacher-1'
  ): Promise<TeacherDashboardStats> {
    await delay(500);
    const teacherClasses = this.classes.filter(
      (c) => c.homeroom_teacher_id === teacherId
    );
    const totalStudents = this.students.filter((s) =>
      teacherClasses.some((c) => c.id === s.class_id)
    ).length;

    return {
      total_classes: teacherClasses.length,
      total_students: totalStudents,
      pending_assignments: faker.number.int({ min: 3, max: 12 }),
      unread_messages: this.messages.filter(
        (m) => m.receiver_id === teacherId && !m.is_read
      ).length,
      recent_announcements: this.announcements.slice(0, 5),
      upcoming_assessments: [] // Will be populated when we create assessments
    };
  },

  // Generate gradebook data
  generateGradebookData(classId: string, subjectId: string): GradebookEntry[] {
    const students = this.students.filter((s) => s.class_id === classId);

    return students.map((student) => {
      const numScores = faker.number.int({ min: 3, max: 8 });
      const scores: Score[] = Array.from({ length: numScores }, (_, i) => ({
        id: `score-${student.id}-${i}`,
        assessment_id: `assessment-${i + 1}`,
        student_id: student.id,
        score: faker.number.int({ min: 60, max: 100 }),
        is_absent: faker.datatype.boolean(0.05),
        comment: faker.datatype.boolean(0.3)
          ? faker.lorem.sentence()
          : undefined,
        created_by: 'teacher-1',
        created_at: faker.date.recent().toISOString(),
        updated_at: faker.date.recent().toISOString()
      }));

      const totalScore = scores.reduce(
        (sum, score) => sum + (score.is_absent ? 0 : score.score),
        0
      );
      const validScores = scores.filter((s) => !s.is_absent);

      return {
        student,
        scores,
        average_score:
          validScores.length > 0
            ? Math.round(totalScore / validScores.length)
            : 0,
        total_possible: scores.length * 100
      };
    });
  }
};

// Import student types
import type {
  Student as StudentType,
  StudentDashboard,
  StudentGrades,
  StudentSchedule,
  Score as StudentScore,
  Assessment as StudentAssessment,
  BehaviorNote as StudentBehaviorNote,
  Announcement as StudentAnnouncement,
  Message as StudentMessage
} from '@/features/student/types';

// Mock student data store
export const fakeStudent = {
  // Current student (logged in)
  currentStudent: {
    id: 'student-1',
    role: 'student' as const,
    full_name: 'Alex Johnson',
    email: 'alex.johnson@student.school.edu',
    phone: '+1-555-0199',
    school_id: 'school-1',
    created_at: '2024-08-15T08:00:00Z',
    class_id: 'class-1',
    parent_id: 'parent-1'
  } as StudentType,

  // Get student dashboard data
  async getStudentDashboard(studentId: string): Promise<StudentDashboard> {
    await delay(300);

    const student =
      fakeTeacher.students.find((s) => s.id === studentId) ||
      fakeStudent.currentStudent;
    const currentClass = fakeTeacher.classes.find(
      (c) => c.id === student.class_id
    );
    const currentTerm = fakeTeacher.terms[0]; // Current term S1

    // Generate recent scores (0-10 point system)
    const recentScores: StudentScore[] = Array.from({ length: 8 }, (_, i) => ({
      id: `score-${studentId}-${i + 1}`,
      assessment_id: `assessment-${i + 1}`,
      student_id: studentId,
      score: Math.round(faker.number.float({ min: 5.0, max: 10.0 }) * 10) / 10, // 0-10 point system
      is_absent: faker.datatype.boolean(0.1), // 10% chance of being absent
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.3
      }),
      created_by: 'teacher-1',
      created_at: faker.date.recent({ days: 30 }).toISOString(),
      updated_at: faker.date.recent({ days: 5 }).toISOString(),
      assessment: {
        id: `assessment-${i + 1}`,
        grade_component_id: `component-${i + 1}`,
        title: `${faker.helpers.arrayElement(['Kiểm tra 15 phút', 'Kiểm tra 1 tiết', 'Bài tập', 'Thực hành'])} ${i + 1}`,
        due_date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
        description: faker.lorem.sentence(),
        grade_component: {
          id: `component-${i + 1}`,
          class_id: student.class_id || 'class-1',
          subject_id: faker.helpers.arrayElement([
            'math-7',
            'english-7',
            'science-7',
            'history-7'
          ]),
          term_id: currentTerm.id,
          name: faker.helpers.arrayElement([
            'Kiểm tra miệng',
            'Kiểm tra 15 phút',
            'Kiểm tra 1 tiết',
            'Thi học kỳ'
          ]),
          kind: faker.helpers.arrayElement([
            'oral',
            'quiz',
            'test',
            'final'
          ]) as any,
          weight:
            Math.round(faker.number.float({ min: 1.0, max: 10.0 }) * 2) / 2, // Weight from 1.0 to 10.0
          max_score: 10,
          position: i + 1,
          subject: fakeTeacher.subjects.find(
            (s) =>
              s.id ===
              faker.helpers.arrayElement([
                'math-7',
                'english-7',
                'science-7',
                'history-7'
              ])
          )
        }
      }
    }));

    // Generate recent announcements
    const recentAnnouncements: StudentAnnouncement[] = Array.from(
      { length: 5 },
      (_, i) => ({
        id: `announcement-${i + 1}`,
        sender_id: 'teacher-1',
        class_id: student.class_id,
        subject_id: faker.helpers.maybe(
          () =>
            faker.helpers.arrayElement([
              'math-7',
              'english-7',
              'science-7',
              'history-7'
            ]),
          { probability: 0.7 }
        ),
        title: faker.lorem.words(4),
        content: faker.lorem.paragraphs(2),
        created_at: faker.date.recent({ days: 14 }).toISOString(),
        expires_at: faker.date.future().toISOString(),
        is_urgent: faker.datatype.boolean(0.2),
        sender: fakeTeacher.currentTeacher,
        class: currentClass,
        subject: faker.helpers.maybe(() =>
          fakeTeacher.subjects.find(
            (s) =>
              s.id ===
              faker.helpers.arrayElement([
                'math-7',
                'english-7',
                'science-7',
                'history-7'
              ])
          )
        )
      })
    );

    // Generate behavior summary
    const behaviorSummary = {
      excellent_count: faker.number.int({ min: 5, max: 15 }),
      good_count: faker.number.int({ min: 8, max: 20 }),
      fair_count: faker.number.int({ min: 2, max: 8 }),
      needs_improvement_count: faker.number.int({ min: 0, max: 3 }),
      poor_count: faker.number.int({ min: 0, max: 1 })
    };

    // Generate upcoming assessments
    const upcomingAssessments: StudentAssessment[] = Array.from(
      { length: 6 },
      (_, i) => ({
        id: `upcoming-assessment-${i + 1}`,
        grade_component_id: `component-${i + 1}`,
        title: `${faker.helpers.arrayElement(['Quiz', 'Test', 'Project', 'Presentation'])} - ${faker.lorem.words(2)}`,
        due_date: faker.date.future().toISOString().split('T')[0],
        description: faker.lorem.sentence(),
        grade_component: {
          id: `component-${i + 1}`,
          class_id: student.class_id || 'class-1',
          subject_id: faker.helpers.arrayElement([
            'math-7',
            'english-7',
            'science-7',
            'history-7'
          ]),
          term_id: currentTerm.id,
          name: faker.helpers.arrayElement(['Quiz', 'Test', 'Project']),
          kind: faker.helpers.arrayElement(['quiz', 'test', 'project']) as any,
          weight: faker.number.float({ min: 0.1, max: 0.3 }),
          max_score: 100,
          position: i + 1,
          subject: fakeTeacher.subjects.find(
            (s) =>
              s.id ===
              faker.helpers.arrayElement([
                'math-7',
                'english-7',
                'science-7',
                'history-7'
              ])
          )
        }
      })
    );

    // Generate recent behavior notes for early warning
    const recentBehaviorNotes = [
      {
        id: 'behavior-recent-1',
        student_id: studentId,
        class_id: student.class_id || 'class-1',
        term_id: currentTerm.id,
        note: 'Học sinh tích cực tham gia hoạt động nhóm và giúp đỡ bạn bè trong dự án khoa học',
        level: 'excellent' as const,
        created_by: 'teacher-1',
        created_at: faker.date.recent({ days: 2 }).toISOString(),
        created_by_user: {
          id: 'teacher-1',
          role: 'teacher' as const,
          full_name: 'Cô Nguyễn Thị Lan',
          email: 'lan.nguyen@school.edu',
          phone: '+84-123-456-789',
          school_id: 'school-1',
          created_at: '2023-08-01T00:00:00Z'
        }
      },
      {
        id: 'behavior-recent-2',
        student_id: studentId,
        class_id: student.class_id || 'class-1',
        term_id: currentTerm.id,
        note: 'Cần cải thiện thái độ tập trung trong giờ học và tránh làm ồn',
        level: faker.helpers.arrayElement(['needs_improvement', 'poor']),
        created_by: 'teacher-2',
        created_at: faker.date.recent({ days: 1 }).toISOString(),
        created_by_user: {
          id: 'teacher-2',
          role: 'teacher' as const,
          full_name: 'Thầy Trần Văn Nam',
          email: 'nam.tran@school.edu',
          phone: '+84-123-456-790',
          school_id: 'school-1',
          created_at: '2023-08-01T00:00:00Z'
        }
      }
    ];

    // Get the most recent significant behavior note (excellent or poor/needs_improvement)
    const latestSignificantBehavior = recentBehaviorNotes
      .filter((note) =>
        ['excellent', 'poor', 'needs_improvement'].includes(note.level)
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

    return {
      student,
      current_class: currentClass!,
      current_term: currentTerm,
      recent_scores: recentScores,
      recent_announcements: recentAnnouncements,
      behavior_summary: behaviorSummary,
      upcoming_assessments: upcomingAssessments,
      latest_behavior_note: latestSignificantBehavior as any
    };
  },

  // Get student grades for a term
  async getStudentGrades(
    studentId: string,
    termId?: string
  ): Promise<StudentGrades> {
    await delay(400);

    const student =
      fakeTeacher.students.find((s) => s.id === studentId) ||
      fakeStudent.currentStudent;
    const term =
      fakeTeacher.terms.find((t) => t.id === termId) || fakeTeacher.terms[0];

    // Generate grades for each subject
    const subjects = fakeTeacher.subjects.map((subject) => {
      const gradeComponents = Array.from({ length: 4 }, (_, i) => ({
        id: `component-${subject.id}-${i + 1}`,
        class_id: student.class_id || 'class-1',
        subject_id: subject.id,
        term_id: term.id,
        name: [
          'Kiểm tra miệng',
          'Kiểm tra 15 phút',
          'Kiểm tra 1 tiết',
          'Thi học kỳ'
        ][i],
        kind: ['oral', 'quiz', 'test', 'final'][i] as any,
        weight: [1.0, 2.0, 3.0, 4.0][i], // Weight from 1.0 to 10.0
        max_score: 10,
        position: i + 1,
        subject
      }));

      const scores = gradeComponents.map((component) => ({
        id: `score-${studentId}-${component.id}`,
        assessment_id: `assessment-${component.id}`,
        student_id: studentId,
        score:
          Math.round(faker.number.float({ min: 6.0, max: 10.0 }) * 10) / 10, // 0-10 point system
        is_absent: faker.datatype.boolean(0.05),
        created_by: 'teacher-1',
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        assessment: {
          id: `assessment-${component.id}`,
          grade_component_id: component.id,
          title: `${component.name} - ${subject.name}`,
          due_date: faker.date.past().toISOString().split('T')[0],
          description: faker.lorem.sentence(),
          grade_component: component
        }
      }));

      const validScores = scores.filter((s) => !s.is_absent);
      const weightedAverage =
        validScores.reduce((sum, score, index) => {
          return sum + score.score * gradeComponents[index].weight;
        }, 0) /
        validScores.reduce(
          (sum, _, index) => sum + gradeComponents[index].weight,
          0
        );

      const letterGrade =
        weightedAverage >= 9.0
          ? 'A'
          : weightedAverage >= 8.0
            ? 'B'
            : weightedAverage >= 6.5
              ? 'C'
              : weightedAverage >= 5.0
                ? 'D'
                : 'F';

      return {
        subject,
        grade_components: gradeComponents,
        scores,
        average_score: Math.round(weightedAverage),
        letter_grade: letterGrade
      };
    });

    const overallAverage = Math.round(
      subjects.reduce((sum, subj) => sum + subj.average_score, 0) /
        subjects.length
    );

    return {
      student,
      term,
      subjects,
      overall_average: overallAverage,
      class_rank: faker.number.int({ min: 1, max: 30 })
    };
  }
};

// Parent API
export const fakeParent = {
  // Get parent dashboard data
  async getParentDashboard(parentId: string) {
    await delay(1000);

    // Mock parent data
    const parent = {
      id: parentId,
      role: 'parent' as const,
      full_name: 'Nguyễn Văn An',
      email: 'an.nguyen@parent.com',
      phone: '+84-123-456-789',
      school_id: 'school-1',
      created_at: '2023-08-01T00:00:00Z'
    };

    // Mock children data
    const children = [
      {
        student: {
          id: 'student-1',
          role: 'student' as const,
          full_name: 'Nguyễn Minh Khang',
          email: 'khang.nguyen@student.edu',
          phone: '+84-987-654-321',
          school_id: 'school-1',
          created_at: '2023-08-01T00:00:00Z',
          class_id: 'class-1'
        },
        current_class: {
          id: 'class-1',
          grade_id: 'grade-1',
          name: '10A1',
          homeroom_teacher_id: 'teacher-1',
          grade: {
            id: 'grade-1',
            school_id: 'school-1',
            level: 'upper_secondary' as const,
            grade_number: 10
          }
        },
        current_term: {
          id: 'term-1',
          academic_year_id: 'year-1',
          code: 'S1' as const,
          start_date: '2024-09-01',
          end_date: '2025-01-15'
        },
        recent_scores: Array.from({ length: 6 }, (_, i) => ({
          id: `score-${i + 1}`,
          assessment_id: `assessment-${i + 1}`,
          student_id: 'student-1',
          score:
            Math.round(faker.number.float({ min: 6.0, max: 10.0 }) * 10) / 10,
          is_absent: faker.datatype.boolean(0.1),
          comment: faker.helpers.maybe(() => faker.lorem.sentence(), {
            probability: 0.3
          }),
          created_by: 'teacher-1',
          created_at: faker.date.recent({ days: 30 }).toISOString(),
          updated_at: faker.date.recent({ days: 30 }).toISOString(),
          assessment: {
            id: `assessment-${i + 1}`,
            grade_component_id: `component-${i + 1}`,
            title: faker.helpers.arrayElement([
              'Kiểm tra 15 phút',
              'Kiểm tra 1 tiết',
              'Bài tập về nhà',
              'Thực hành',
              'Kiểm tra miệng'
            ]),
            due_date: faker.date
              .recent({ days: 30 })
              .toISOString()
              .split('T')[0],
            description: faker.lorem.sentence(),
            grade_component: {
              id: `component-${i + 1}`,
              class_id: 'class-1',
              subject_id: faker.helpers.arrayElement([
                'math',
                'literature',
                'english',
                'physics',
                'chemistry'
              ]),
              term_id: 'term-1',
              name: faker.helpers.arrayElement([
                'Kiểm tra miệng',
                'Kiểm tra 15 phút',
                'Kiểm tra 1 tiết',
                'Thi học kỳ'
              ]),
              kind: faker.helpers.arrayElement([
                'oral',
                'quiz',
                'test',
                'midterm',
                'final'
              ]) as any,
              weight:
                Math.round(faker.number.float({ min: 1.0, max: 4.0 }) * 2) / 2,
              max_score: 10,
              position: i + 1
            }
          }
        })),
        behavior_summary: {
          excellent_count: faker.number.int({ min: 5, max: 15 }),
          good_count: faker.number.int({ min: 8, max: 20 }),
          fair_count: faker.number.int({ min: 2, max: 8 }),
          needs_improvement_count: faker.number.int({ min: 0, max: 3 }),
          poor_count: faker.number.int({ min: 0, max: 1 })
        },
        latest_behavior_note: faker.helpers.maybe(
          () => ({
            id: 'behavior-latest-1',
            student_id: 'student-1',
            class_id: 'class-1',
            term_id: 'term-1',
            note: faker.helpers.arrayElement([
              'Học sinh tích cực tham gia hoạt động nhóm và giúp đỡ bạn bè',
              'Em cần chú ý tập trung hơn trong giờ học',
              'Thái độ học tập rất tốt, luôn hoàn thành bài tập đúng hạn',
              'Cần cải thiện việc tương tác với bạn bè trong lớp'
            ]),
            level: faker.helpers.arrayElement([
              'excellent',
              'good',
              'needs_improvement',
              'poor'
            ]) as any,
            created_by: 'teacher-1',
            created_at: faker.date.recent({ days: 7 }).toISOString(),
            created_by_user: {
              id: 'teacher-1',
              role: 'teacher' as const,
              full_name: 'Cô Nguyễn Thị Lan',
              email: 'lan.nguyen@school.edu',
              phone: '+84-123-456-789',
              school_id: 'school-1',
              created_at: '2023-08-01T00:00:00Z'
            }
          }),
          { probability: 0.8 }
        ),
        upcoming_assessments: Array.from({ length: 3 }, (_, i) => ({
          id: `upcoming-${i + 1}`,
          grade_component_id: `component-${i + 1}`,
          title: faker.helpers.arrayElement([
            'Kiểm tra Toán học chương 3',
            'Bài kiểm tra Ngữ văn',
            'Thực hành Hóa học',
            'Kiểm tra Tiếng Anh'
          ]),
          due_date: faker.date.future({ years: 1 }).toISOString().split('T')[0],
          description: faker.lorem.sentence()
        })),
        overall_average:
          Math.round(faker.number.float({ min: 6.5, max: 9.5 }) * 10) / 10,
        class_rank: faker.number.int({ min: 1, max: 35 })
      },
      // Second child
      {
        student: {
          id: 'student-2',
          role: 'student' as const,
          full_name: 'Nguyễn Minh Anh',
          email: 'anh.nguyen@student.edu',
          phone: '+84-987-654-322',
          school_id: 'school-1',
          created_at: '2023-08-01T00:00:00Z',
          class_id: 'class-2'
        },
        current_class: {
          id: 'class-2',
          grade_id: 'grade-2',
          name: '8A2',
          homeroom_teacher_id: 'teacher-2',
          grade: {
            id: 'grade-2',
            school_id: 'school-1',
            level: 'lower_secondary' as const,
            grade_number: 8
          }
        },
        current_term: {
          id: 'term-1',
          academic_year_id: 'year-1',
          code: 'S1' as const,
          start_date: '2024-09-01',
          end_date: '2025-01-15'
        },
        recent_scores: Array.from({ length: 4 }, (_, i) => ({
          id: `score-2-${i + 1}`,
          assessment_id: `assessment-2-${i + 1}`,
          student_id: 'student-2',
          score:
            Math.round(faker.number.float({ min: 7.0, max: 9.5 }) * 10) / 10,
          is_absent: faker.datatype.boolean(0.05),
          comment: faker.helpers.maybe(() => faker.lorem.sentence(), {
            probability: 0.3
          }),
          created_by: 'teacher-2',
          created_at: faker.date.recent({ days: 30 }).toISOString(),
          updated_at: faker.date.recent({ days: 30 }).toISOString(),
          assessment: {
            id: `assessment-2-${i + 1}`,
            grade_component_id: `component-2-${i + 1}`,
            title: faker.helpers.arrayElement([
              'Kiểm tra 15 phút',
              'Kiểm tra 1 tiết',
              'Bài tập về nhà',
              'Thực hành'
            ]),
            due_date: faker.date
              .recent({ days: 30 })
              .toISOString()
              .split('T')[0],
            description: faker.lorem.sentence(),
            grade_component: {
              id: `component-2-${i + 1}`,
              class_id: 'class-2',
              subject_id: faker.helpers.arrayElement([
                'math',
                'literature',
                'english',
                'history'
              ]),
              term_id: 'term-1',
              name: faker.helpers.arrayElement([
                'Kiểm tra miệng',
                'Kiểm tra 15 phút',
                'Kiểm tra 1 tiết'
              ]),
              kind: faker.helpers.arrayElement(['oral', 'quiz', 'test']) as any,
              weight:
                Math.round(faker.number.float({ min: 1.0, max: 3.0 }) * 2) / 2,
              max_score: 10,
              position: i + 1
            }
          }
        })),
        behavior_summary: {
          excellent_count: faker.number.int({ min: 8, max: 18 }),
          good_count: faker.number.int({ min: 10, max: 25 }),
          fair_count: faker.number.int({ min: 1, max: 5 }),
          needs_improvement_count: faker.number.int({ min: 0, max: 2 }),
          poor_count: 0
        },
        latest_behavior_note: faker.helpers.maybe(
          () => ({
            id: 'behavior-latest-2',
            student_id: 'student-2',
            class_id: 'class-2',
            term_id: 'term-1',
            note: 'Em rất chăm chỉ và có tinh thần trách nhiệm cao trong học tập',
            level: 'excellent' as const,
            created_by: 'teacher-2',
            created_at: faker.date.recent({ days: 5 }).toISOString(),
            created_by_user: {
              id: 'teacher-2',
              role: 'teacher' as const,
              full_name: 'Thầy Trần Văn Nam',
              email: 'nam.tran@school.edu',
              phone: '+84-123-456-790',
              school_id: 'school-1',
              created_at: '2023-08-01T00:00:00Z'
            }
          }),
          { probability: 0.9 }
        ),
        upcoming_assessments: Array.from({ length: 2 }, (_, i) => ({
          id: `upcoming-2-${i + 1}`,
          grade_component_id: `component-2-${i + 1}`,
          title: faker.helpers.arrayElement([
            'Kiểm tra Toán học',
            'Bài kiểm tra Lịch sử',
            'Kiểm tra Tiếng Anh'
          ]),
          due_date: faker.date.future({ years: 1 }).toISOString().split('T')[0],
          description: faker.lorem.sentence()
        })),
        overall_average:
          Math.round(faker.number.float({ min: 7.5, max: 9.0 }) * 10) / 10,
        class_rank: faker.number.int({ min: 1, max: 30 })
      }
    ];

    // Mock recent announcements
    const recent_announcements = Array.from({ length: 5 }, (_, i) => ({
      id: `announcement-${i + 1}`,
      sender_id: 'teacher-1',
      class_id: faker.helpers.maybe(() => 'class-1', { probability: 0.6 }),
      subject_id: faker.helpers.maybe(
        () => faker.helpers.arrayElement(['math', 'literature', 'english']),
        { probability: 0.4 }
      ),
      title: faker.helpers.arrayElement([
        'Thông báo lịch thi học kỳ 1',
        'Họp phụ huynh cuối tháng',
        'Hoạt động ngoại khóa tuần tới',
        'Thay đổi thời khóa biểu',
        'Chương trình tham quan học tập'
      ]),
      content: faker.lorem.paragraphs(2),
      created_at: faker.date.recent({ days: 14 }).toISOString(),
      expires_at: faker.date.future({ years: 1 }).toISOString(),
      is_urgent: faker.datatype.boolean(0.2),
      sender: {
        id: 'teacher-1',
        role: 'teacher' as const,
        full_name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        school_id: 'school-1',
        created_at: '2023-08-01T00:00:00Z'
      }
    }));

    return {
      parent,
      children,
      recent_announcements,
      unread_messages_count: faker.number.int({ min: 0, max: 8 })
    };
  },

  // Get detailed child information
  async getChildDetail(parentId: string, childId: string) {
    await delay(800);

    // This would fetch detailed information about a specific child
    // For now, return mock data similar to student dashboard but from parent perspective
    return {
      // Implementation would be similar to student dashboard but with parent context
    };
  },

  // Get parent-teacher communication data
  async getTeacherCommunication(parentId: string, childId?: string) {
    await delay(600);

    // Mock teacher communication data
    return {
      // Implementation for teacher communication
    };
  }
};
