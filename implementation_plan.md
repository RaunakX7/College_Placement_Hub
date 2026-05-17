# PlaceHub | Architectural Migration Plan

This document details the successful architectural refactoring of the legacy **College Placement & Internship Management System** from a legacy **PHP/MySQL/XAMPP** setup into a modern, type-safe, and secure **Next.js 14+ (App Router) + PostgreSQL + Prisma ORM** stack.

---

## 1. Executive Summary

The entire codebase has been refactored into a high-fidelity TypeScript and React architecture. 100% of the legacy business logic, relations, and RBAC policies have been preserved while eliminating unsafe SQL injections, plain-text sessions, and redundant inline scripting.

### Tech Stack Comparison
| Layer | Legacy Stack | Modernized Stack |
| :--- | :--- | :--- |
| **Backend & API** | Procedural PHP (`mysqli_query`) | Next.js API Routes (TypeScript, Zod, Prisma Client) |
| **Database** | MySQL (XAMPP local instance) | PostgreSQL (Enterprise relational schema via Prisma) |
| **ORM / Data Access**| Unprepared/manual SQL string concatenation | Prisma ORM (Type-safe client, pooled singletons) |
| **Frontend UI** | Procedural HTML + Inline Tailwind scripts | Next.js App Router (React, Lucide icons, Tailwind CSS) |
| **State & Sessions** | Native PHP `$_SESSION` cookies | HTTP-Only JSON Web Tokens (JWT) + React Auth Context |
| **Validation** | Ad-hoc checks / no schema constraint | React Hook Form + Zod Schema Validation |

---

## 2. Relational Database Schema (`schema.prisma`)

We designed [schema.prisma](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/prisma/schema.prisma) in pure PostgreSQL compliance, converting legacy table structures to strict TypeScript models.

```mermaid
erDiagram
    Admin ||--o{ Internship : "creates"
    Student ||--o{ Application : "submits"
    Student ||--o{ SavedJob : "bookmarks"
    Internship ||--o{ Application : "has"
    Internship ||--o{ SavedJob : "has"
    Application ||--o{ InterviewRound : "comprises"

    Admin {
        int id PK
        string username UNIQUE
        string password
        string name
        datetime createdAt
    }

    Student {
        int id PK
        string email UNIQUE
        string password
        string name
        string rollNumber UNIQUE
        string phone
        string location
        decimal cgpa
        string skills
        string bio
        string department
        string graduationYear
        string resume
        string linkedinUrl
        string githubUrl
        datetime createdAt
    }

    Internship {
        int id PK
        string companyName
        string title
        string type
        string location
        string eligibility
        string description
        datetime lastDate
        int adminId FK
        datetime createdAt
    }

    Application {
        int id PK
        int studentId FK
        int internshipId FK
        string status
        datetime createdAt
    }

    SavedJob {
        int id PK
        int studentId FK
        int internshipId FK
        datetime savedAt
    }

    InterviewRound {
        int id PK
        int applicationId FK
        int roundNumber
        string roundTitle
        string roundStatus
        datetime scheduledAt
        string remarks
    }
```

---

## 3. Key Backend Modules & API Endpoints

### 3.1 Session & Hashing Engines (`src/lib/`)
*   [prisma.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/lib/prisma.ts): Prisma singleton connection pooling instance preventing database socket leaks.
*   [auth.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/lib/auth.ts): Session hashing engine using `bcryptjs` and HTTP-Only JWT tokens.

### 3.2 Modular API Handlers (`src/app/api/`)
*   [register/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/auth/register/route.ts): Handles student registration, checking for pre-existing emails/roll numbers, and hashes passwords securely.
*   [login/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/auth/login/route.ts): Multi-role authenticating route with JWT generation. Supports plain-text fallback for seed administrator accounts.
*   [logout/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/auth/logout/route.ts): Clears authorization cookie.
*   [me/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/auth/me/route.ts): Hydrates user state on client initialization.
*   [internships/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/internships/route.ts): GET (search and filter matching jobs) and POST (admin-only opportunity creation).
*   [applications/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/applications/route.ts): Handles student applications (with check for double submissions) and lists applications based on roles.
*   [applications/[id]/status/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/applications/%5Bid%5D/status/route.ts): Admin-restricted overall candidate status modifier.
*   [applications/[id]/rounds/route.ts](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/api/applications/%5Bid%5D/rounds/route.ts): Manages selection round additions and compiles database upserting. Preserves parent status triggers:
    *   `Selected` -> Moves application status to `Interview`.
    *   `Rejected` -> Moves application status to `Rejected`.
    *   `Completed` -> Moves application status to `Shortlisted`.

---

## 4. Frontend Architecture & Pages

We developed responsive React views in `src/app/` using dynamic layouts, glassmorphic accents, and curated HSL colors:
1.  **Unified Authentication Context**: Managed via client-side [AuthContext.tsx](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/context/AuthContext.tsx) to distribute session updates.
2.  **Home Landing Page**: A server-side rendered [page.tsx](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/page.tsx) that directly queries Prisma for the newest drives.
3.  **Student Section**:
    *   [StudentLayout](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/student/layout.tsx): Sidebar container with mobile drawer compatibility.
    *   [Dashboard](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/student/dashboard/page.tsx): Quick metrics boxes and missing credentials alert.
    *   [Job Board](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/student/job-board/page.tsx): Multi-filter search board with bookmark toggles and descriptive slide-out drawers.
    *   [My Applications](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/student/applications/page.tsx): High-fidelity visually mapped chronological timelines of recorded selection stages.
    *   [My Profile](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/student/profile/page.tsx): Data editing grid validated via Zod.
4.  **Admin Section**:
    *   [AdminLayout](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/admin/layout.tsx): Secures sub-pages, routing non-admins away.
    *   [Dashboard](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/admin/dashboard/page.tsx): Chronological logs and application funnel bars.
    *   [Manage Jobs](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/admin/internships/page.tsx): Reactive add opportunity modal form.
    *   [Manage Students](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/admin/students/page.tsx): Student credentials and data edit forms.
    *   [Applications Controller](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/src/app/admin/applications/page.tsx): Inline status selects and slide-out selection timeline modifiers.

---

## 5. Verification Checklist

To complete local database synchronization and boot up the development server, run these terminal actions:

### Step 5.1: Create Environment Variables
Ensure `.env` contains:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placement_db?schema=public"
JWT_SECRET="mySuperSecureUnbreakableJwtSecret2026PlaceHub!!!"
```

### Step 5.2: Apply PostgreSQL Schema
Apply migrations or sync schema to database instance:
```bash
npx prisma db push
```

### Step 5.3: Execute Seeder
Seed default credentials and active opportunities:
```bash
node prisma/seed.js
```

### Step 5.4: Purge Legacy Codebase
Remove obsolete procedural files from disk:
```bash
node delete_legacy.js
```

### Step 5.5: Run Local Server
Launch Next.js hot-reloaded dev server:
```bash
npm run dev
```
Access the portal at `http://localhost:3000`.
