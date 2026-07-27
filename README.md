# Student Progress Tracker — Bodhrik Session Evaluation Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](bodhrik-dashboard-y5ok.vercel.app)

A responsive, production-ready Next.js dashboard built to review coach-submitted tutoring session evaluations. The application features live filtering by student name, date range, and status, dynamic time-series metric computation, interactive Recharts visualization, mobile-responsive layouts, and native handling for all UI states (loading skeletons, data view, empty states, and error handling).

---

## 🚀 Quick Start & Setup

### Prerequisites
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher

### Local Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/JoyceUbale/bodhrik-dashboard.git](https://github.com/JoyceUbale/bodhrik-dashboard.git)
   cd bodhrik-dashboard

2. **Install dependencies:**
    `npm install`

3. **Run the development server:**
    `npm run dev`

# Architectural Reflection & Technical Decisions

### 1. Choice of State Management & Data Fetching
For this dashboard, I chose **Next.js App Router API Route Handlers** combined with **SWR (`useSWR`)** for asynchronous data fetching and client-side lifecycle management.

* **Automated Lifecycle Handling:** SWR natively manages `isLoading`, `isError`, request deduplication, caching, and automatic revalidation. This eliminated the need for complex global state management (e.g., Redux or Zustand) or manual state boilerplate.
* **Decoupled Architecture:** Business logic—such as string query searching, date range filtering, and dynamic metric calculations—was encapsulated inside the Next.js API route (`/api/evaluations`). This decouples UI presentation components from data processing and mirrors a real-world API architecture.
* **Optimized UI Transitions:** Leveraging SWR's `keepPreviousData: true` option ensures smooth UI rendering during debounced search inputs, preventing jarring layout shifts or blank loading flashes.

---

### 2. Time-Box Trade-offs & Simplifications
To deliver a fully functional, polished, and edge-case-resilient interface within the given timeframe, several strategic trade-offs were made:

* **Mock Authentication:** Implemented lightweight client-side auth context guards instead of a full NextAuth.js or JWT/OAuth setup, allowing core engineering time to be focused on table controls, charts, and state handling.
* **Static Storage Engine:** Used a local `sessions.json` file served via Next.js API routes instead of setting up a PostgreSQL instance with an ORM like Prisma or Drizzle.
* **Deterministic Field Mapping:** Metadata such as evaluator names and focus areas were generated dynamically using session ID modulus arithmetic rather than relational database joins.
* **Date Manipulation:** Performed string-based ISO date comparisons (`YYYY-MM-DD`) directly rather than introducing external date libraries like `date-fns` or `Day.js`.

---

### 3. Scaling to 10,000+ Sessions
If the system needed to scale from 20 to 10,000+ session evaluations, the architecture would evolve in four key areas:

1. **Database-Level Querying & Indexing:** Shift array operations out of server memory into database-level SQL queries (`WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`). Add B-Tree indexes on `studentName`, `date`, and `status` columns to maintain sub-10ms query execution times.
2. **Table Virtualization:** Implement windowed/virtualized lists using `@tanstack/react-virtual`. Instead of mounting thousands of rows into the DOM, only the 10–20 visible rows in the viewport would be rendered, keeping DOM nodes minimal and frame rates high.
3. **Pre-computed Aggregations:** Computing metric averages from large time-series arrays per request becomes an expensive bottleneck. Pre-calculate metrics and overall status badges via background jobs or database triggers upon session completion.
4. **Cursor-Based Pagination:** Replace offset-based pagination with cursor-based (keyset) pagination (`WHERE id > last_seen_id`) to prevent severe query degradation on deep pagination pages.
