# To-Do App

A full-stack Todo List application built using **Go**, **Next.js**, and **PostgreSQL**.  
This project is created to fulfill all core & technical requirements of the **Industrix Coding Challenge**.


**Name**: Fanny Rizqi Yudhistira

**Domicile**: Padurenan, Mustikajaya, Bekasi City, West Java

---

## Features

- **Todo Management (CRUD):** Create, view, update, and delete tasks.
- **Todo Categories:** Create custom categories with colors and attach them to tasks.
- **Search & Filter:** Search todos by title and filter them by category.
- **Completion Status:** Mark tasks as completed or not completed.
- **Responsive Design:** Mobile & desktop UI using Ant Design.

---

## Tech Stack

### Backend
- Go (Golang)
- Gin Framework
- GORM (ORM)

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Ant Design

### Database
- PostgreSQL

---

## Setup & Installation

Follow these steps to run the application locally.

---

## 1. Backend Setup (Go)

Go to the backend folder:

```bash
cd todo-be
```

### Environment Configuration (IMPORTANT)

1. Create a `.env` file inside the `todo-be` folder.  
2. Copy the content of `.env.example` into `.env`.  
3. Fill in your database password in the `DB_DSN` variable.

Example `.env`:

```
DB_DSN="host=localhost user=postgres password=YOUR_ACTUAL_PASSWORD dbname=postgres port=5432 sslmode=disable"
```

### Install dependencies

```bash
go mod tidy
```

### Start the server

```bash
go run main.go
```

Backend runs on:

```
http://localhost:8080
```

---

## 2. Frontend Setup (Next.js)

Go to the frontend folder:

```bash
cd todo-fe
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## Project Structure

```
SUBMISSION-CBR/
├── todo-be/
│   ├── models/              
│   │   ├── category.go
│   │   └── todo.go
│   ├── go.mod
│   ├── go.sum
│   ├── main.go            
│   └── .env                
│
└── todo-fe/                 
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── public/
    ├── .gitignore
    ├── next.config.ts
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## Technical Q&A

### Database Design

#### 1. What tables were created and why?

I created two main tables:

- **categories** — Stores category data (id, name, color)
- **todos** — Stores todo data (id, title, description, status, priority, category_id)

The structure represents a **One-to-Many** relationship:  
**one category can contain many todos**.

---

#### 2. How are pagination & filtering implemented?

- **Filtering:**
  - Title search uses `ILIKE` (case-insensitive)
  - Category filter uses `category_id`

- **Pagination:**
  - Supports `Limit` and `Offset` using GORM
  - Frontend currently fetches all data since dataset is small

---

## Technical Decisions

### 1. Responsive Design Implementation

- Used Ant Design components which are already responsive.
- Added horizontal scroll to tables:

```tsx
scroll={{ x: true }}
```

- Flexbox-based layout ensures stable responsiveness.

---

### 2. Backend Architecture

A simple monolithic structure:

- `models/` folder contains schemas and structs  
- `main.go` handles routing, database connection, and migration  

This structure was chosen for clarity, maintainability, and simplicity.

---

### 3. Data Validation

- **Frontend:** Ant Design Form Rules (`{ required: true }`)
- **Backend:** Gin’s `ShouldBindJSON` for input validation based on struct definitions

---

## Testing & Improvements

### If given more time, what would you improve?

- Add backend unit tests
- Use React Context or Redux for state management
- Add user authentication

---
