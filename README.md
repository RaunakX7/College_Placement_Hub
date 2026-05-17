# PlaceHub Portal - College Placement & Internship Management System

A centralized platform for managing student records, job postings, and application tracking using Next.js 14 and Prisma. This is a state-of-the-art, fully modernized, type-safe web portal designed for educational institutions to digitalize, streamline, and manage student campus placement and internship selection lifecycles.

This project represents a senior architectural migration from a legacy procedural PHP/MySQL model to a high-performance **Next.js 14+ / React 19 / TypeScript** framework utilizing a local, zero-config **SQLite** database via **Prisma ORM**.

---

## 🛠️ Tech Stack
*   **Framework**: Next.js 14+ (App Router, React 19 Client & Server Components)
*   **Language**: TypeScript (Strict Mode)
*   **Database & ORM**: SQLite + Prisma ORM (v5.22.0+)
*   **Styling**: Tailwind CSS & Vanilla CSS (Sleek Glassmorphic UI Design)
*   **Authentication**: Secure JSON Web Tokens (JWT) inside HttpOnly Cookies + BCrypt.js password hashing
*   **Validation**: Zod + React Hook Form

---

## 🚀 Features
*   **Role-Based Access Control (Student/Admin)**: Strict segregation of controls and panels for Students and Campus Administrators.
*   **Real-time Application Tracking**: Interactive, multi-round selection pipeline tracking candidate progress (Scheduled, Passed, Failed, Pending).
*   **Secure Authentication (JWT/HttpOnly Cookies)**: High-security session management preventing XSS and CSRF attacks.
*   **Glassmorphic UI Design**: Stunning responsive layouts built with premium color palettes, vibrant gradients, and smooth hover effects.

---

## ⚙️ Installation Guide

Follow these step-by-step instructions to get the PlaceHub Portal running locally on your machine:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/RaunakX7/College_Placement_Hub.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd College_Placement_Hub
   ```

3. **Install Project Dependencies:**
   ```bash
   npm install
   ```

4. **Configure Environment Variables:**
   Copy the example environment configuration into a local file:
   ```bash
   copy .env.example .env
   ```
   *(For Unix-like systems, run `cp .env.example .env`)*

5. **Generate Prisma Client Client Hooks:**
   ```bash
   npx prisma generate
   ```

6. **Initialize and Push Database Schema:**
   Instantly build your local SQLite database file (`dev.db`) and synchronize the Prisma schema:
   ```bash
   npx prisma db push
   ```

7. **Seed Sample Data (Admin Credentials & Corporate Drives):**
   ```bash
   npx prisma db seed
   ```

8. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the running application!

---

## 🔑 Default Credentials

Once you seed the database, you can log in immediately using the root credentials:

### 🛡️ Campus Administrator
*   **Role**: Administrator
*   **Username**: `admin`
*   **Password**: `admin123`

### 🎓 Student Profile
*   Register a new student account using the **Create Account** button on the registration page to explore the active job board, configure your academic profile (CGPA, resume link, department), and track internship applications!

---

## 💻 Windows Launcher Scripts

For Windows users, two helper scripts are provided to streamline local setup and development:

*   **`run_server.bat`**: A first-time setup utility. It checks or creates a default `.env` file, runs `npm install`, synchronizes the SQLite schema using `npx prisma db push`, seeds mock data via `npx prisma db seed`, compiles Prisma Client, cleans obsolete legacy source files, and opens the application in your browser.
*   **`quick_server.bat`**: A fast developer bootloader. It verifies the presence of `.env`, generates Prisma client hooks, opens your default browser to `localhost:3000`, and fires up the Next.js local development server.

---

## 📂 Project Structure
```
├── prisma
│   ├── schema.prisma   # Relational Prisma Database Schema (SQLite)
│   └── seed.js         # Database seeder (Default Admin & Mock Corporate Drives)
├── src
│   ├── app
│   │   ├── api         # Type-safe Route Handlers (Auth, Internships, Rounds)
│   │   ├── admin       # Administrator Dashboard and Panels
│   │   ├── student     # Student Applications & Edit Profile Panel
│   │   └── about       # System Synopsis Page
│   ├── context         # Global Auth Context Provider
│   └── lib             # Shared utilities (JWT Verification, Prisma instance)
├── run_server.bat      # Windows First-time Initialization script
├── quick_server.bat    # Windows Quick launch script
└── delete_legacy.js    # Script to clean up legacy procedural files
```

---

## 🌐 Production Environment Configuration

When deploying the **PlaceHub Portal** to production hosting platforms like **Render.com** or **Vercel**:

> [!IMPORTANT]
> **Do NOT upload or use a local `.env` file for production secrets.** 
> The `.env` file is strictly ignored via [.gitignore](file:///d:/college-placement-internship-management-system-main_legacy/college-placement-internship-management-system-main_legacy/.gitignore) to protect credentials and prevent security breaches.

### How to configure `DATABASE_URL`:
1. Navigate to your hosting dashboard (e.g., Render Web Service Settings).
2. Under the **Environment Variables** (or **Config Vars**) tab, add a new environment variable:
   *   **Key**: `DATABASE_URL`
   *   **Value**: `postgresql://<user>:<password>@<host>:<port>/<database>` (your live production PostgreSQL connection string)
3. Set your production `JWT_SECRET` key in the environment variables as well.
4. Trigger a new deployment. Render will automatically run the `postinstall` script to compile the Prisma client against your PostgreSQL schema cleanly!

---

## 👥 Contributors
Developed in partial fulfillment of the award of **Bachelor of Computer Application (BCA)**, Session 2025-26.
*   **Rohitash Gar**
*   **Raunak Kumar**
*   **Rishabh Parashar**

*Under the guidance of Ms. Diksha Verma (Assistant Professor), School of Computer and System Sciences, **Jaipur National University**, Jaipur.*
