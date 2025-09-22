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
