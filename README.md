To-Do App

A Full Stack Todo List Application built with Go (Backend), Next.js (Frontend), and PostgreSQL (Database). This application fulfills the core and technical requirements of the Industrix Coding Challenge.

Features

Todo Management (CRUD): Create, Read, Update, and Delete tasks.

Categories: Create custom categories with colors and assign them to tasks.

Filter & Search: Filter tasks by category and search tasks by title.

Completion Status: Mark tasks as completed or incomplete.

Responsive Design: Mobile and desktop-friendly UI using Ant Design.

Technologies

Backend: Go (Golang), Gin Framework, GORM (ORM).

Frontend: Next.js (App Router), React, TypeScript, Ant Design.

Database: PostgreSQL.

Setup & Installation

Follow these steps to run the application locally.

Prerequisites

Go (v1.20+)

Node.js (v18+)

PostgreSQL

1. Setup Backend (Go)

Navigate to the backend directory:

cd todo-be


IMPORTANT: Environment Configuration

Create a new file named .env inside the todo-be folder.

Copy the content from .env.example into .env.

Fill in your actual database password in the DB_DSN variable.

Example .env content:

DB_DSN="host=localhost user=postgres password=YOUR_ACTUAL_PASSWORD dbname=postgres port=5432 sslmode=disable"


Install dependencies:

go mod tidy


Start the server:

go run main.go


The server will run on http://localhost:8080.

2. Setup Frontend (Next.js)

Open a new terminal and navigate to the frontend directory:

cd todo-fe


Install dependencies:

npm install


Start the development server:

npm run dev


Open your browser at http://localhost:3000.

Project Structure

Here is the folder structure of this project:

SUBMISSION-CBR/
├── todo-be/               # Backend Folder (Go)
│   ├── models/            # Data Structure Definitions (Schema)
│   │   ├── category.go    # Category Model
│   │   └── todo.go        # Todo Model
│   ├── go.mod             # Go Module & Dependencies
│   ├── go.sum             # Dependency Checksums
│   ├── main.go            # Server Entry Point & API Routes
│   └── .env               # Environment Variables (Not committed to Git)
│
└── todo-fe/               # Frontend Folder (Next.js)
    ├── app/               # Next.js App Router
    │   ├── globals.css    # Global Styles
    │   ├── layout.tsx     # Main Layout & Antd Registry
    │   └── page.tsx       # Main Page (UI & Logic)
    ├── public/            # Static Assets
    ├── .gitignore         # Git Ignore Configuration
    ├── next.config.ts     # Next.js Configuration
    ├── package.json       # Frontend Dependencies
    ├── tailwind.config.ts # (If using Tailwind)
    └── tsconfig.json      # TypeScript Configuration


Technical Q&A

Database Design

1. What database tables did you create and why?
I created two main tables: todos and categories.

categories: Stores category information (id, name, color).

todos: Stores task data (id, title, description, status, priority) and includes a Foreign Key category_id linking to the categories table.
This structure was chosen to efficiently represent a One-to-Many relationship: a single category can be associated with multiple tasks.

2. How did you handle pagination and filtering in the database?

Filtering: Implemented using SQL WHERE clauses via GORM. For title search, I used ILIKE for case-insensitive matching (title ILIKE %keyword%). For categories, exact matching is used (category_id = ?).

Pagination: The backend supports pagination logic using Limit and Offset in database queries (although the current frontend fetches all data for simplicity given the small dataset).

Technical Decisions

1. How did you implement responsive design?
I utilized Ant Design components which are responsive out-of-the-box. For the data table, I enabled the scroll={{ x: true }} property to allow horizontal scrolling on smaller screens without breaking the main layout. The overall layout uses Flexbox for responsive alignment.

2. What backend architecture did you choose?
I chose a simple Monolithic architecture with clear separation of concerns:

models: Defines data structures and database schemas in a separate folder.

main.go: Serves as the entry point, handling database connections, migrations, and API routing (Controllers).
This approach was selected for its simplicity and development speed suitable for the scale of this application, while remaining structured and easy to understand.

3. How did you handle data validation?
Data validation is handled on both ends:

Frontend: Uses Ant Design Form rules (rules={[{ required: true }]}) to provide instant feedback to the user.

Backend: Uses Gin's ShouldBindJSON to ensure the received data matches the expected Go structs before processing.

Testing & Quality

If you had more time, what would you improve?

Add Unit Tests for the backend using Go's built-in testing package.

Implement React Context or Redux for centralized state management.

Add user authentication features.
