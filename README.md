# 🏥 Patient Management System (PMS)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

A comprehensive, enterprise-grade healthcare management platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This system features role-based access control, AI-powered clinical insights, dynamic medical templating, interactive reporting dashboards, and full bilingual support (English/Arabic).

---

## 📑 Table of Contents

- [🌟 Key Features](#-key-features)
- [🏗️ Architecture & Tech Stack](#-architecture--tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#-installation--setup)
- [🔧 Configuration](#-configuration)
- [📦 Core Modules](#-core-modules)
  - [Authentication & Users](#authentication--users)
  - [Patient Management](#patient-management)
  - [AI Integration](#ai-integration)
  - [Reporting Engine](#reporting-engine)
  - [Dynamic Templates](#dynamic-templates)
- [🌍 Internationalization (RTL/LTR)](#-internationalization)
- [🎨 UI & Theming](#-ui--theming)
- [🚀 Deployment](#-deployment)

---

## 🌟 Key Features

### 🔐 Security & Administration

- **Role-Based Access Control (RBAC):** Granular permissions for `Super Admin`, `Admin`, `Doctor`, `Nurse`, and `Staff`.
- **User Management:** Bulk actions (reset password, deactivate, delete), subscription tier management, and activity logging.
- **System Backups:** Integrated interface for creating, restoring, and downloading database backups.
- **Audit Logging:** Tracks user logins, profile updates, and system changes.

### 🏥 Clinical Operations

- **Patient Dashboard:** Real-time statistics on total patients, visits, and demographic trends.
- **Event Timeline:** Interactive visual timeline of patient history (Medications, Surgeries, Lab Results).
- **Visit Management:** Comprehensive visit recording with SOAP notes, vital signs, and follow-up scheduling.
- **Patient Status Flow:** Customizable status tracking (Active, On Treatment, Discharged) with history logs.

### 🤖 AI Capabilities

- **Clinical Assistant:** Auto-generates visit notes from raw symptoms and observations.
- **Template Generator:** Creates complex medical forms based on natural language descriptions (e.g., "Create a cardiology template").
- **Insight Engine:** Analyzes patient history to provide summaries and treatment suggestions.
- **Smart Reports:** AI-driven comparative analysis and trend forecasting.

### 📊 Analytics & Data

- **Interactive Charts:** Bar, Line, Pie, Scatter, and Heatmap visualizations using `Recharts`.
- **Custom Report Builder:** Drag-and-drop report configuration with filtering by demographics, status, or date.
- **Data Export:** robust export functionality to PDF, Excel, and CSV formats.

---

## 🏗️ Architecture & Tech Stack

This project uses a modern frontend stack designed for scalability and performance.

| Category          | Technology                    | Usage in Project                                          |
| :---------------- | :---------------------------- | :-------------------------------------------------------- |
| **Framework**     | **Next.js 14** (App Router)   | Server-side rendering, routing, layouts.                  |
| **Language**      | **TypeScript**                | Strict typing for `User`, `Patient`, `Template`, etc.     |
| **Styling**       | **Tailwind CSS**              | Utility-first styling with dark mode support.             |
| **UI Library**    | **Shadcn UI**                 | Reusable components (Dialogs, Cards, Tables, Forms).      |
| **State/Query**   | **TanStack Query (v5)**       | Server state management, caching, and optimistic updates. |
| **Forms**         | **React Hook Form** + **Zod** | Form handling and schema validation.                      |
| **Charts**        | **Recharts**                  | Data visualization for the Reports module.                |
| **Date Time**     | **date-fns**                  | Date formatting and manipulation.                         |
| **Animations**    | **Framer Motion**             | Page transitions and UI micro-interactions.               |
| **Notifications** | **React Hot Toast**           | User feedback and alerts.                                 |
| **HTTP Client**   | **Axios**                     | API communication with interceptors.                      |

---

## 📂 Project Structure

This directory structure reflects the exact organization of the provided codebase.

```bash
app/
├── _components/            # Global shared components
│   ├── header/             # Header, SearchBar, AuthButtons, Notifications
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── LoadingInsights.tsx # AI Loading UI
│   └── ...
├── _contexts/              # React Context Providers
│   └── LanguageContext.tsx # RTL/LTR and Translation logic
├── _hooks/                 # Custom Hooks & API Services
│   ├── AI/                 # useAI.ts, AIApi.ts
│   ├── appointment/        # Appointment logic
│   ├── auth/               # Authentication logic
│   ├── backup/             # System backup logic
│   ├── patient/            # Patient CRUD
│   ├── report/             # Reporting logic
│   ├── template/           # Template logic
│   └── userAdmin/          # User administration hooks
├── _locales/               # Translation dictionaries
│   ├── ar.ts               # Arabic translations
│   └── en.ts               # English translations
├── _providers/             # Context Wrappers (Auth, ReactQuery)
├── _types/                 # TypeScript Interfaces (User, Patient, Template)
├── admin/                  # Admin-specific routes
│   ├── backups/            # System backup interface
│   ├── notifications/      # System-wide notification management
│   └── users/              # User management & Stats
├── appointments/           # Appointment scheduling views
├── login/                  # Authentication pages
├── notifications/          # User notification center
├── patients/               # Patient module
│   ├── [id]/               # Patient Details (Tabs, History, Notes)
│   └── add-patient/        # Multi-step creation wizard
├── profile/                # User profile settings
├── reports/                # Analytics & Visualization
│   └── _components/charts/ # Recharts components (Bar, Pie, Line, Heatmap)
├── settings/               # App configuration (Theme, Export)
└── templates/              # Dynamic Template Builder
    └── [id]/               # Template Editor
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites

Ensure you have the following installed:

- Node.js (v18.17.0 or higher)
- npm, yarn, or pnpm

### 2. Clone the Repository

```bash
git clone https://github.com/Abdelaziz79/patient-system-frontend.git
cd patient-system-frontend
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Setup Environment Variables

Create a `.env.local` file in the root directory. This is critical for the `_hooks` to connect to your backend.

```env
# The base URL for your backend API (Express/NestJS/Django)
NEXT_PUBLIC_BACK_URL=http://localhost:5000

# Optional: Analytics or other keys
NEXT_PUBLIC_ANALYTICS_ID=
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Core Modules

### Authentication & Users

Located in `app/login`, `app/profile`, and `app/admin/users`.

- **Auth Hooks:** `useAuth.ts` handles login/logout and token storage in localStorage.
- **Components:** `UserTable.tsx`, `UserCards.tsx` (for mobile), `BulkActionBar.tsx`.
- **Features:**
  - Secure login with redirect logic.
  - Profile updates (avatar, contact info).
  - Super Admin capability to "Impersonate" or manage subscriptions.

### Patient Management

Located in `app/patients`.

- **List View:** Filterable table with sorting and search (`PatientTable.tsx`).
- **Add Patient Wizard:** A multi-step form (`TemplateSelection` -> `PersonalInfo` -> `DynamicData`).
- **Detail View:** Uses a tabbed interface (`PatientTabs.tsx`) to show:
  - **Info:** Dynamic fields based on the assigned template.
  - **Visits:** Chronological list of visits with expanding details.
  - **Events:** Medical timeline events.
  - **AI:** Treatment suggestions and insights.

### AI Integration

Located in `app/_hooks/AI` and `app/templates/_components`.

- **Services:** `AIApi.ts` connects to endpoints like `/api/ai/generate-template` and `/api/ai/visit-notes-assistant`.
- **Usage:**
  - **Template Generation:** Users type a condition ("Asthma"), AI builds the form structure.
  - **Visit Notes:** Users input shorthand observations, AI expands them into clinical SOAP notes.

### Reporting Engine

Located in `app/reports`.

- **Visualization:** Uses `ReportCharts.tsx` to dynamically render:
  - `BarChartComponent`
  - `LineChartComponent`
  - `PieChartComponent`
  - `HeatmapComponent` (e.g., for appointment density)
- **Logic:** `useReport.ts` handles fetching aggregate data and applying filters.

### Dynamic Templates

Located in `app/templates`.

- **Concept:** Allows admins to define custom medical forms without code changes.
- **Structure:** Templates consist of `Sections`, which contain `Fields` (Text, Number, Date, Select, etc.).
- **Components:** `FieldDialog.tsx`, `SectionDialog.tsx`, `TemplateCard.tsx`.

---

## 🌍 Internationalization

The system is fully localized for **English** and **Arabic**.

- **Context:** `LanguageContext.tsx` manages the state.
- **Translations:** Files located in `app/_locales/en.ts` and `ar.ts`.
- **RTL Support:** The `dir` attribute is dynamically applied to the `<body>` and specific components (like Dialogs and Tables) to ensure correct layout mirroring for Arabic users.

**Usage:**

```tsx
const { t, isRTL } = useLanguage();
return <div dir={isRTL ? "rtl" : "ltr"}>{t("welcomeMessage")}</div>;
```

---

## 🎨 UI & Theming

- **Dark Mode:** Built-in using `next-themes` and Tailwind's `dark:` classes. Toggled via `ThemeLanguageToggles.tsx`.
- **Responsive:** All components, including complex tables (`UserTable.tsx` vs `UserCards.tsx`), adapt to mobile views using the `useMobileView` hook.
- **Components:** Custom implementations of Shadcn UI components can be found in `components/ui`.

---

## 🚀 Deployment

To build the application for production:

1.  **Build:**
    ```bash
    npm run build
    ```
2.  **Start:**
    ```bash
    npm start
    ```

**Docker Support:**
You can containerize this application using a standard Next.js Dockerfile. Ensure `NEXT_PUBLIC_BACK_URL` is passed as a build argument or environment variable at runtime.

---

**Built with ❤️ by [Abdelaziz79](https://github.com/Abdelaziz79)**

---
