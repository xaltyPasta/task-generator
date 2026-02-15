# 🚀 Xaltypasta Task Generator

A production-ready AI-assisted feature planning system that converts product ideas into structured user stories and engineering tasks.

Built with Next.js App Router, Prisma ORM, Supabase PostgreSQL, Google OAuth, and Groq AI.

---

## 📌 Overview

Xaltypasta Task Generator is a full-stack SaaS-style application designed to help developers and product teams:

* Define feature ideas
* Automatically generate user stories & tasks via AI
* Edit and refine manually
* Drag & reorder tasks safely
* Export as Markdown
* Track recent specs
* Persist AI generation metadata for traceability

This project demonstrates modern full-stack architecture with strong backend validation, proper database modeling, and clean separation of concerns.

---

## 🏗 System Architecture

### High-Level Flow

```
User → Next.js UI → API Route → Service Layer → Prisma → PostgreSQL
                                  ↓
                                 Groq AI
```

### Architectural Principles

* **Thin API Routes** - Minimal logic in route handlers
* **Service-layer business logic** - Core operations in dedicated services
* **Ownership validation** - Every mutation verifies user permissions
* **Transaction-safe DB operations** - ACID compliance for critical updates
* **Strict JSON AI output enforcement** - Validated AI responses
* **Hydration-safe drag & drop UI** - No SSR/client mismatches
* **Controlled client components** - Predictable React rendering

---

## 🛠 Tech Stack

### Frontend
* **Next.js** (App Router)
* **React 18**
* **Bootstrap 5**
* **dnd-kit** (drag & drop)
* **TypeScript**

### Backend
* **Next.js Route Handlers**
* **Prisma ORM** (v6.19.0)
* **Supabase PostgreSQL**

### Authentication
* **NextAuth**
* **Google OAuth Provider**
* **JWT session strategy**
* **Per-user data isolation**

### AI Layer
* **Groq SDK**
* **Model:** `llama-3.3-70b-versatile`
* **Strict JSON-only output enforcement**
* **AI metadata persistence**

---

## 📂 Project Structure

```
xaltypasta-task-generator/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── specs/
│   │   │   ├── stories/
│   │   │   └── tasks/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── SpecDetailClient.tsx
│   │   ├── EditableField.tsx
│   │   ├── AuthButton.tsx
│   │   └── UserDropDown.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── services/
│   │       ├── ai.service.ts
│   │       ├── reorder.service.ts
│   │       ├── spec.service.ts
│   │       ├── story.service.ts
│   │       ├── task.service.ts
│   │       └── dashboard.service.ts
│   │
│   └── types/
```

---

## 🧠 Core Features

### 1️⃣ AI-Based Story & Task Generation

Given a feature specification with:
* Title
* Goal
* Target Users
* Constraints
* Risks

The AI generates:
* 4–6 User Stories
* 3–5 Engineering Tasks per story

#### AI Safety Measures
* Strict JSON-only responses
* JSON parsing validation
* Structured output verification
* Raw + parsed response stored
* Model + temperature recorded

#### Stored in DB:
* Prompt
* Model used
* Temperature
* Raw response
* Parsed output
* Timestamp

---

### 2️⃣ Manual Editing

Users can:
* Edit spec title inline
* Edit story titles inline
* Edit task titles inline
* Update task status:
  * `TODO`
  * `IN_PROGRESS`
  * `DONE`

All edits go through validated API routes with ownership verification.

---

### 3️⃣ Drag & Drop Reordering

Implemented using:
* **dnd-kit** library
* Controlled hydration-safe rendering
* Transaction-safe reorder service

#### Unique Constraint Strategy

Database constraint:
```prisma
@@unique([storyId, order])
```

To prevent collisions:
1. Temporarily move tasks to negative order
2. Apply final order values
3. Commit transaction

Ensures no `(storyId, order)` conflicts during reordering.

---

### 4️⃣ Markdown Export

Users can:
* Download spec as `.md` file
* Copy Markdown to clipboard

Generated Markdown is:
* GitHub compatible
* Notion compatible
* Cleanly structured

#### Example Output:

```md
# Feature Title

## Overview

Goal: Build a responsive dashboard
Target Users: Product managers and developers

---

## 1. User Story: Dashboard Overview

### Engineering Tasks

- [ ] Create dashboard layout component
- [ ] Implement data fetching logic
- [ ] Add responsive grid system
```

---

### 5️⃣ Dashboard

* Shows last 5 specs
* Per-user isolation
* Secure data access
* Server-side protected routes

---

## 🔐 Authentication Flow

1. User logs in via **Google OAuth**
2. **NextAuth** issues JWT session
3. User is stored in database (if new)
4. All API routes verify:
   * Authenticated session
   * Ownership of resource

**No cross-user data leakage.**

---

## 🗄 Database Models

### User
Stores Google-authenticated users.

### Spec
Represents a feature idea with full specification details.

### Story
Belongs to a Spec. Represents user stories.

### Task
Belongs to a Story. Has unique order within story.

### SpecGeneration
Stores AI generation metadata for auditing and traceability.

---

## 🔄 Reorder Algorithm (Safe Implementation)

**Problem:**  
Reordering tasks can violate unique constraint `(storyId, order)`.

**Solution:**

```typescript
1. Validate ownership
2. Start database transaction
3. Temporarily set order to negative values
4. Apply final order values
5. Commit transaction
```

This guarantees no collisions during concurrent reordering operations.

---

## 🧪 Local Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Environment Variables

Create `.env` file:

```env
DATABASE_URL=your_supabase_postgres_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
```

### 3️⃣ Run Prisma Migration

```bash
npx prisma migrate dev
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Production Considerations

* Uses **JWT sessions** (stateless)
* **Service-layer logic separation** for maintainability
* **Prisma connection pooling** via Supabase
* **Transaction-based reorder** for data integrity
* **Strict AI JSON validation** for reliability
* **Hydration-safe drag UI** for smooth UX
* **Controlled React components** for predictable rendering

---

## 🧱 Scalability Considerations

Future-ready enhancements:

* Cross-story drag grouping
* Spec version history
* Multi-user collaboration
* Optimistic UI updates
* WebSocket-based live updates
* Role-based access control (RBAC)
* AI refinement per story
* Export as PDF
* Rate-limited AI calls
* Caching layer (Redis)
* Background job processing

---

## 🎯 Engineering Highlights

This project demonstrates:

✅ Real-world full-stack architecture  
✅ Secure API design with ownership validation  
✅ Proper relational modeling with Prisma  
✅ AI integration with structured persistence  
✅ Hydration-safe React implementation  
✅ Production-ready transaction logic  
✅ Clean separation of concerns  
✅ Modern authentication patterns  

---

## 🚀 Deployment

This application is ready to deploy on:

* **Vercel** (recommended for Next.js)
* **Railway**
* **Render**
* **AWS** (EC2 + RDS)

Ensure environment variables are properly configured in your deployment platform.

---

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

---


## 🙏 Acknowledgments

* **Groq** for fast AI inference
* **Supabase** for managed PostgreSQL
* **NextAuth** for authentication
* **dnd-kit** for drag & drop

---

**⭐ If you find this project helpful, please consider giving it a star!**