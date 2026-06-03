# 🪐 CyberSprint — Premium Study Operating System

CyberSprint is a high-performance, developer-centric study dashboard and learning roadmap planner. Designed to optimize cognitive output, it helps you manage your learning pathways, schedule daily targets, and track intensive study blocks with an integrated focus cockpit and live telemetry.

---

## 🚀 Key Features

*   **🧭 Adaptive Roadmaps:** Map out your learning curriculum into multi-week pathways, broken down into day-by-day objectives and granular tasks.
*   **⏱️ Focus Cockpit:** A live, persistent focus timer that syncs directly with your database, allowing you to track active study blocks against specific tasks and learning resources.
*   **📊 Analytics Engine:** Real-time statistics tracking your current study streak, daily focus hours, weekly activity trends (via custom Recharts sparklines), and task completion metrics.
*   **📚 Resource Reference Library:** A centralized repository for books, documentation links, cheatsheets, and tutorials, categorized by difficulty and connected directly to related study tasks.
*   **🗄️ Task Backlog & Queue:** A streamlined prioritization system categorized by urgency (High, Medium, Low) and estimated minutes.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org) (App Router, Server Actions)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM:** [Prisma Client v6](https://www.prisma.io/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Charts & Visuals:** [Recharts v3](https://recharts.org/)
*   **State & Client Utilities:** React 19

---

## ⚙️ Project Setup

Follow these instructions to set up and run CyberSprint locally:

### 1. Prerequisites
Ensure you have Node.js and a package manager (npm, yarn, pnpm, or bun) installed. This project uses `bun` by default but works with any standard package manager.

### 2. Install Dependencies
Clone the repository, navigate to the directory, and run:
```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure your PostgreSQL database connection:
```env
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?schema=public"
```

### 4. Push Database Schema
Sync the Prisma schema with your PostgreSQL database:
```bash
npx prisma db push
```

### 5. Seed the Database
Populate the database with a starter cybersecurity learning curriculum (OWASP Top 10, Network Security, and Active Directory):
```bash
npx tsx seed.ts
```

### 6. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access CyberSprint.

---

## 📂 Project Architecture

```
study-track/
├── app/                  # Next.js App Router pages, layouts, and server actions
│   ├── analytics/        # Analytics logic and charts view
│   ├── components/       # Core UI components (ProgressBar, TaskListItem, etc.)
│   ├── dashboard/        # Main workspace dashboard
│   ├── resources/        # Library management routes
│   ├── roadmaps/         # Learning pathway planner routes
│   ├── study-sessions/   # Timer and session management logic
│   └── tasks/            # Task backlog and tracking routes
├── components/           # Reusable generic UI elements
├── lib/                  # Shared utility code, schema validators, and Prisma Client
├── prisma/               # Prisma database schema and migrations
│   └── schema.prisma     # Core domain models (Roadmap, Week, Day, Task, Resource, StudySession)
└── seed.ts               # Starter database seeding script
```
