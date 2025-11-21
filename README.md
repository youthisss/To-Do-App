# To-Do App (Full Stack Challenge)

A Full Stack Todo List Application built using Go (Backend), Next.js (Frontend), and PostgreSQL (Database). This application fulfills the core and technical requirements of the Industrix Coding Challenge.

## Features

- **Todo Management (CRUD):** Create, Read, Update, and Delete tasks.
- **Categories:** Create custom categories with colors and assign them to tasks.
- **Filter & Search:** Filter tasks by category and search tasks by title.
- **Completion Status:** Mark tasks as completed or incomplete.
- **Responsive Design:** Mobile and desktop-friendly UI using Ant Design.

## Technologies

- **Backend:** Go (Golang), Gin Framework, GORM (ORM).
- **Frontend:** Next.js (App Router), React, TypeScript, Ant Design.
- **Database:** PostgreSQL.

## Setup & Installation

Follow these steps to run the application locally.

### Prerequisites

- Go (v1.20+)
- Node.js (v18+)
- PostgreSQL

### 1. Setup Backend (Go)

Navigate to the backend directory:

```bash
cd todo-be
```

#### IMPORTANT: Environment Configuration

1. Create a new file named `.env` inside the `todo-be` folder.
1. Copy the content from `.env.example` into `.env`.
1. Fill in your actual database password in the `DB_DSN` variable.

Example `.env` content:

```env
DB_DSN="host=localhost user=postgres password=YOUR_ACTUAL_PASSWORD dbname=postgres port=5432 sslmode=disable"
```

Install dependencies:

```bash
go mod tidy
```

Start the server:

```bash
go run main.go
```

The server will run on `http://localhost:8080`.

### 2. Setup Frontend (Next.js)

Open a new terminal and navigate to the frontend directory:

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

Open your browser at `http://localhost:3000`.

## Project Structure

Here is the folder structure of this project:

```
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
```

-----

## Technical Q&A

### Database Design Questions

#### 1. What database tables did you create and why?

I created two main tables: `todos` and `categories`.

- **categories:** Stores category information (`id`, `name`, `color`).
- **todos:** Stores task data (`id`, `title`, `description`, `completed`, `priority`) and includes a Foreign Key `category_id` linking to the `categories` table.

**Why?** This structure efficiently represents a One-to-Many relationship. A single category can be assigned to multiple tasks, but a task belongs to one specific category. Separating categories into their own table allows for easier management (CRUD) and data normalization.

#### 2. How did you handle pagination and filtering in the database?

**Filtering:** I implemented filtering using dynamic SQL WHERE clauses via GORM.

- **For Search:** I used `ILIKE` (e.g., `title ILIKE %keyword%`) to perform case-insensitive pattern matching on task titles.
- **For Categories:** I used exact matching (e.g., `category_id = ?`) to filter tasks by specific ID.

**Pagination:** While the current frontend fetches data to display a simple list, the backend architecture supports pagination using `Limit` and `Offset` in GORM queries. This ensures scalability if the dataset grows larger.

-----

### Technical Decision Questions

#### 1. How did you implement responsive design?

I utilized Ant Design’s responsive components.

- **Layout:** I used Flexbox layouts (`display: flex`, `flex-wrap: wrap`) in the control bar to ensure buttons and search inputs stack gracefully on smaller screens.
- **Table:** I enabled the `scroll={{ x: true }}` property on the Ant Design Table component. This allows the table to scroll horizontally on mobile devices without breaking the overall page layout or hiding columns.

#### 2. How did you structure your React components?

I adopted the Next.js App Router structure.

- **Page Component (`page.tsx`):** Acts as the main container that holds the application state (`todos`, `categories`, `loading`) and handles logic (CRUD operations, data fetching).
- **UI Components:** I leveraged Ant Design’s pre-built components (`Modal`, `Table`, `Form`, `Card`) directly within the page to speed up development and ensure UI consistency.
- **State Management:** I used React’s local state (`useState`) for managing UI states (modals, loading) and data, and `useEffect` for initial data fetching and side effects.

#### 3. What backend architecture did you choose and why?

I chose a **Monolithic RESTful API** architecture with a clear separation of concerns:

- **models/:** Defines the data structure and database schema.
- **main.go:** Acts as the entry point, handling database connection, migrations, and route definitions (Controllers).

**Why?** This approach is ideal for this project’s scale. It keeps the codebase simple, easy to navigate, and fast to deploy, while still being structured enough to be extended (e.g., separating controllers into their own package) in the future.

#### 4. How did you handle data validation?

Data validation is enforced on both the client and server sides:

- **Frontend:** I used Ant Design’s Form validation rules (e.g., `rules={[{ required: true }]}`) to provide immediate visual feedback to the user, ensuring required fields like Title and Category are not empty.
- **Backend:** I used the `ShouldBindJSON` method from the Gin framework. This ensures that the incoming JSON payload matches the expected Go struct types before processing, preventing invalid data types from entering the system.

-----

### Testing & Quality Questions

#### 1. What did you choose to unit test and why?

Due to the time constraints of this challenge and the focus on delivering a complete set of full-stack features (Frontend + Backend + Database), I prioritized functional implementation over automated testing.

However, if I were to implement tests, I would start with:

- **Backend Handlers:** Testing the API endpoints (GET, POST, PUT, DELETE) using Go’s `httptest` package to ensure they return correct status codes (200, 400, 404) and JSON structures.

**Why?** The API is the critical contract between frontend and backend. Ensuring it behaves correctly is the highest priority for system stability.

#### 2. If you had more time, what would you improve or add?

- **Unit Testing:** I would add comprehensive unit tests for the backend logic using Go’s `testing` package.
- **State Management:** I would refactor the frontend to use React Context API to manage global state (`todos` and `categories`) more cleanly, separating logic from the UI components.
- **Authentication:** Implement JWT-based authentication to allow multiple users to have their own private todo lists.