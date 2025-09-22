# Teacher Feature

This feature provides a comprehensive teacher dashboard and class management system based on the database schema defined in `db.txt`.

## Features Implemented

### 1. Teacher Home Dashboard (`/teacher`)
- Overview of teacher's classes and students
- Quick stats (total classes, students, pending assignments, unread messages)
- Recent announcements display
- Quick action buttons for common tasks

### 2. Class Management (`/teacher/classes/[classId]`)
- **Roster**: Student list with contact information, average scores, and behavior notes count
- **Gradebook**: Grade management with subject selection, score entry, and class statistics
- **Behavior**: Behavior note tracking with forms to add new notes and view student behavior history
- **Announcements**: Class-specific announcements with creation, editing, and expiration management

### 3. Inbox (`/teacher/inbox`)
- Message management system
- Unread message tracking
- Message search and filtering
- Reply and forward functionality

## File Structure

```
src/features/teacher/
├── components/
│   ├── announcement-form.tsx       # Form for creating/editing announcements
│   ├── announcements-view.tsx      # Announcements listing and management
│   ├── behavior-note-form.tsx      # Form for adding behavior notes
│   ├── behavior-view.tsx           # Behavior notes management
│   ├── class-header.tsx            # Class information header
│   ├── gradebook-view.tsx          # Gradebook with scores display
│   ├── inbox-view.tsx              # Message inbox interface
│   ├── roster-table/               # Student roster table components
│   │   ├── index.tsx
│   │   ├── columns.tsx
│   │   └── cell-action.tsx
│   ├── teacher-dashboard.tsx       # Main dashboard component
│   └── index.ts                    # Component exports
├── types/
│   └── index.ts                    # TypeScript type definitions
└── README.md                       # This file
```

## Routes

```
/teacher                                    # Teacher dashboard home
/teacher/classes/[classId]/roster           # Student roster
/teacher/classes/[classId]/gradebook        # Grade management
/teacher/classes/[classId]/behavior         # Behavior notes
/teacher/classes/[classId]/announcements    # Class announcements
/teacher/inbox                              # Message inbox
```

## Data Types

All types are defined in `types/index.ts` and include:
- Core entities (Teacher, Student, Class, Subject)
- Assessment types (Score, Assessment, GradeComponent)
- Communication types (Message, Announcement, BehaviorNote)
- Form types for creating/editing data

## Mock Data

Mock data is provided in `src/constants/mock-api.ts` with the `fakeTeacher` object that includes:
- Sample teachers, students, and classes
- Generated behavior notes and announcements
- Mock API methods for data fetching
- Realistic fake data using Faker.js

## UI Components Used

The feature reuses existing UI components from the design system:
- Tables with sorting, filtering, and pagination
- Forms with validation using React Hook Form and Zod
- Cards, badges, and buttons following the existing design patterns
- Modal dialogs for forms
- Avatar components for user display

## Key Features

1. **Responsive Design**: All components work on mobile and desktop
2. **Form Validation**: Comprehensive validation using Zod schemas
3. **Data Tables**: Sortable, filterable tables with pagination
4. **Real-time Updates**: Mock API with realistic delays
5. **Type Safety**: Full TypeScript support with comprehensive types
6. **Accessibility**: Following best practices for screen readers and keyboard navigation

## Usage

The teacher feature is designed to be used within the existing Next.js app structure. All components are server-side rendered where possible, with client-side interactivity for forms and dynamic content.

To extend the feature:
1. Add new types to `types/index.ts`
2. Create new components in the `components/` directory
3. Add mock data to the `fakeTeacher` object
4. Create new pages in the `app/(teacher)/teacher/` directory
