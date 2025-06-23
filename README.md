# Patient Management System - Frontend

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/abdelmoumen-soukehal/patient-sys/main/assets/dashboard.png" alt="Patient System Dashboard" />
</p>

This repository contains the source code for the frontend of the Patient Management System, a modern, feature-rich web application designed to help healthcare professionals manage patient information, appointments, and medical data with efficiency and ease.

## Table of Contents

- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🏁 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

This application provides a comprehensive suite of tools for healthcare management:

- **👤 Patient Management**

  - Complete CRUD (Create, Read, Update, Delete) functionality for patient records.
  - A detailed patient view that includes personal information, a timeline of medical events, clinical notes, and treatment history.
  - Advanced search and filtering capabilities to quickly find patients.

- **🤖 AI-Powered Assistance**

  - **AI Analysis**: An integrated AI module analyzes patient events and notes to provide insights and summaries.
  - **Treatment Suggestions**: The system offers AI-based treatment suggestions based on the available patient data.
  - **AI Template Generation**: Automatically generate patient data forms and templates based on a simple prompt.

- **🗓️ Appointment Scheduling**

  - An intuitive interface for scheduling, viewing, and managing patient appointments.
  - Multiple views, including a comprehensive table and mobile-friendly cards.

- **📝 Dynamic Template Engine**

  - A powerful built-in template builder allows administrators to create and customize dynamic forms for patient data collection.
  - Define sections, fields of various types (text, date, dropdown), and status options to tailor forms to specific needs.

- **📊 Reporting & Analytics**

  - A dedicated reporting module to visualize key healthcare metrics.
  - Generate insightful charts, including bar, line, pie, and heatmaps, to analyze patient demographics, appointment statistics, and more.

- **🔐 Admin & User Management**

  - **Role-Based Access Control**: Secure user authentication with distinct roles (e.g., Admin, Clinician).
  - **Admin Dashboard**: A central dashboard for administrators to monitor system activity, manage users, and configure system settings.
  - **System-wide Notifications**: Admins can broadcast notifications to all users.
  - **Data Backups**: Functionality for creating and managing system data backups.

- **⚙️ User Profile & Settings**
  - Users can manage their personal profile information and change their passwords.
  - Personalize the application experience with theme (light/dark mode) and language settings.

---

## 🚀 Tech Stack

The application is built with a modern and robust set of technologies to ensure a high-quality user experience and developer productivity.

- **Framework**: **[Next.js](https://nextjs.org/)** is used for its powerful features like Server-Side Rendering (SSR), the App Router, and optimized performance.
- **Language**: **[TypeScript](https://www.typescriptlang.org/)** ensures type safety, which improves code quality and long-term maintainability.
- **Styling**: **[Tailwind CSS](https://tailwindcss.com/)** enables rapid UI development with a utility-first approach, coupled with **[Shadcn/UI](https://ui.shadcn.com/)** for a set of pre-built, accessible components.
- **Data Fetching & State Management**: **[TanStack Query (React Query)](https://tanstack.com/query)** handles all server state, simplifying data fetching, caching, and synchronization.
- **Forms**: **[React Hook Form](https://react-hook-form.com/)** and **[Zod](https://zod.dev/)** work together to create performant, type-safe forms with robust validation.
- **HTTP Client**: **[Axios](https://axios-http.com/)** is used for making promise-based HTTP requests to the backend API.
- **Charting**: **[Recharts](https://recharts.org/)** provides a rich library of composable chart components for data visualization.

---

## 📂 Project Structure

The project follows the standard Next.js App Router structure, promoting a clean and organized codebase.

```
/app
├── (routes)                  # Application routes (e.g., admin, patients, appointments)
│   ├── admin/                # Admin-only pages and components
│   ├── appointments/         # Appointment management pages
│   ├── patients/             # Patient management, including creation, details, and editing
│   │   ├── [id]/             # Dynamic route for a single patient's detail view
│   │   └── add-patient/      # Page for creating a new patient
│   └── ...
├── _components/              # Shared, reusable components used across multiple pages
├── _contexts/                # Global React contexts (e.g., LanguageContext)
├── _hooks/                   # Custom hooks for business logic and data fetching
│   ├── patient/
│   │   ├── patientApi.ts     # API request functions for patients
│   │   └── usePatient.ts     # TanStack Query hooks related to patients
│   └── ...
├── _lib/                     # General utility functions
├── _locales/                 # Internationalization (i18n) translation files
├── _providers/               # Global context providers (e.g., AuthProvider, ReactQueryProvider)
└── _types/                   # TypeScript type definitions and interfaces
/components/ui                # Core UI components from Shadcn/UI
/public                       # Static assets like images and icons
```

---

## 🏁 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project. This file will hold your environment-specific variables.

```env
# URL of the backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Add any other required environment variables
```

### Running the Development Server

Start the Next.js development server (with Turbopack for high-performance):

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using ESLint to identify and fix issues.

---

## 🚀 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
