# CipherSQLStudio

A modern, browser-based SQL learning platform for students. Practice SQL queries with an interactive editor, real PostgreSQL execution, sample data, and AI-powered progressive hints.

## Features

- **30 SQL Assignments** spanning 14+ categories (SELECT, WHERE, JOIN, GROUP BY, Subquery, Window Functions, CASE, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, UNION, String Functions, etc.)
- **Interactive SQL Editor** powered by Monaco Editor with syntax highlighting
- **Real PostgreSQL Sandbox** — queries execute against a live PostgreSQL database in an isolated, rolled-back transaction
- **AI-Powered Hints** via Google Gemini LLM with progressive prompt engineering (never reveals full solutions)
- **Assignment Storage** in MongoDB Atlas — easy to manage and extend
- **Responsive Design** — mobile-first SCSS with BEM naming, 4 breakpoints (320 / 641 / 1024 / 1281 px)
- **Query Validation** — blocks dangerous DDL while allowing DML experimentation

---

## Technology Choices & Rationale

| Layer | Technology | Why |
|---|---|---|
| **Frontend Framework** | React 19 (CRA) | Component-driven UI, fast dev cycle, massive ecosystem. CRA provides zero-config tooling for a student project. |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | Same editor engine as VS Code — gives students a professional, familiar editing experience with syntax highlighting, autocompletion, and line numbers. |
| **Routing** | React Router v7 | Declarative client-side routing, URL-driven navigation between assignment list and attempt views. |
| **Styling** | Vanilla SCSS + BEM | SCSS provides variables, mixins, and nesting. BEM gives predictable class naming. No CSS framework dependency — full control over responsive design. |
| **Backend Framework** | Express.js | Minimal, unopinionated Node.js web server. Easy to set up REST endpoints; widely documented. |
| **Assignment Database** | MongoDB (Mongoose) | Flexible document schema is ideal for heterogeneous assignment data (varying table schemas, hints, expected outputs). MongoDB Atlas provides free-tier cloud hosting. |
| **SQL Sandbox** | PostgreSQL (`pg` driver) | Industry-standard RDBMS. Queries execute inside a transaction that is always **ROLLED BACK**, so student experiments never pollute shared state. Each execution creates an isolated schema. |
| **LLM Hints** | Google Gemini 2.0 Flash API | Fast, cost-effective generative model. Prompt engineering ensures progressive hinting: gentle nudges first, structural guidance next, specific syntax last — but **never the full answer**. Falls back to stored hints if the API is unavailable. |
| **Environment Config** | dotenv | Keeps secrets (API keys, DB URIs) out of source code. `.env.example` files document every required variable. |

---

## Project Structure

```
cipher-sql-studio/
├── public/                          # Static assets
├── src/                             # React frontend
│   ├── components/
│   │   ├── AssignmentList.js        # Assignment listing page
│   │   ├── AssignmentList.scss
│   │   ├── AssignmentAttempt.js     # Attempt page (editor + results + hints)
│   │   └── AssignmentAttempt.scss
│   ├── data/
│   │   └── assignments.js           # 30 assignments (local fallback)
│   ├── services/
│   │   └── api.js                   # API client (fetch wrappers)
│   ├── styles/
│   │   ├── _variables.scss          # Design tokens
│   │   ├── _mixins.scss             # Reusable SCSS mixins
│   │   ├── _reset.scss              # CSS reset
│   │   └── App.scss                 # Global styles
│   ├── App.js                       # Router + layout
│   └── index.js                     # Entry point
│
├── server/                          # Node.js / Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB + PostgreSQL connections
│   ├── models/
│   │   ├── Assignment.js            # Mongoose assignment schema
│   │   └── UserProgress.js          # Mongoose user progress schema
│   ├── routes/
│   │   ├── assignments.js           # GET /api/assignments
│   │   ├── query.js                 # POST /api/query/execute
│   │   └── hint.js                  # POST /api/hint (LLM)
│   ├── utils/
│   │   └── queryValidator.js        # SQL safety checks
│   ├── seed.js                      # Seed MongoDB with assignments
│   ├── index.js                     # Express entry point
│   ├── package.json
│   └── .env.example
│
├── .env.example                     # Frontend env template
├── package.json                     # Frontend dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v16+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier
- **PostgreSQL** — local instance (v12+)
- **Google Gemini API key** — obtain from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone & install

```bash
cd cipher-sql-studio

# Frontend
npm install

# Backend
cd server
npm install
```

### 2. Configure environment

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, PostgreSQL URI, Gemini API key

# Frontend
cp .env.example .env
# Edit .env if your backend runs on a different port
```

### 3. Seed the database

```bash
cd server
npm run seed
```

### 4. Start both servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 3000)
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | List all assignments (optional `?difficulty=&category=` filters) |
| `GET` | `/api/assignments/:id` | Get single assignment details |
| `POST` | `/api/query/execute` | Execute SQL query in PostgreSQL sandbox |
| `POST` | `/api/hint` | Get progressive AI-powered hint |
| `GET` | `/api/health` | Health check |

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| xs | 320 px | Small mobile |
| sm | 641 px | Tablet |
| md | 1024 px | Desktop |
| lg | 1281 px | Large desktop |

## Design Principles

- Mobile-first responsive design
- Clean, minimal interface with clear visual hierarchy
- Touch-friendly interactions
- Consistent spacing and typography via SCSS design tokens
- Accessible color contrast ratios
- BEM naming convention for predictable CSS scoping

## Available Scripts

### Frontend

| Script | Description |
|---|---|
| `npm start` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm test` | Run tests |

### Backend

| Script | Description |
|---|---|
| `npm start` | Start server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run seed` | Seed MongoDB with 30 assignments |
- Code completion and syntax validation
- Performance analytics

## License

MIT
