# Kanban Task Board

A responsive full-stack Kanban project for organizing tasks across **To Do**, **In Progress**, and **Done**. The React frontend is functional and persists tasks in the browser. A separate FastAPI backend now provides in-memory task CRUD endpoints and is being tested independently before frontend integration and PostgreSQL persistence.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)

## Project Status

| Area | Status |
| --- | --- |
| Frontend | Functional |
| Browser persistence | Functional with `localStorage` |
| Drag and drop | Functional between columns |
| FastAPI task API | In-memory CRUD implemented |
| User CRUD API | In-memory CRUD implemented; hardening in progress |
| Password hashing | Implemented with `pwdlib` |
| Login | Credential verification implemented; token/session auth planned |
| Task ownership | Planned |
| PostgreSQL persistence | Planned with Alembic migrations |
| Frontend/backend integration | Not started |
| Automated testing | Not implemented |

> [!IMPORTANT]
> The frontend and backend currently run independently. The frontend still uses browser `localStorage`, while the backend stores tasks and users in process memory. Restarting the FastAPI server clears both collections. Login currently verifies credentials only; it does not issue a token or create a session for subsequent requests.

## Implemented Frontend Features

- Create tasks with a required name and optional description
- Organize tasks across **To Do**, **In Progress**, and **Done**
- Move tasks forward or backward with action buttons
- Drag tasks directly between columns
- Edit task names and descriptions inline
- Delete tasks from the board
- Display a creation timestamp on every task card
- Display live task counts and empty-column states
- Preserve tasks and their current columns across page reloads with `localStorage`
- Adapt the board across mobile, tablet, and desktop layouts

### Drag-and-Drop Behavior

The board uses the browser's native HTML drag-and-drop API:

- Tasks can move directly between any two columns.
- Dropping a task into its current column leaves it unchanged.
- Button controls remain available as an accessible movement alternative.
- Within-column reordering is not currently supported.
- Native dragging may be limited on touch devices.

## Implemented Backend Features

- FastAPI application with generated OpenAPI documentation
- Pydantic task creation, saved-task, and partial-update models
- Three validated task statuses: **To Do**, **In Progress**, and **Done**
- Server-generated UUID task IDs
- Server-generated UTC creation timestamps
- In-memory task storage keyed by task ID
- Create, list, retrieve, update, move, and delete operations
- `404 Not Found` responses for unknown task IDs
- Request validation through FastAPI and Pydantic
- In-memory user creation, listing, retrieval, updating, and deletion
- Separate public, stored, create, and update user models
- Password hashing with `pwdlib`; plaintext passwords are not stored
- Email-and-password login credential verification at `POST /auth/login`
- Password-free responses for registration and successful login

The backend is currently intended for independent API development and manual testing with Postman. It is not yet consumed by the React application. User response filtering, consistent email normalization, login failure semantics, and automated regression coverage are the current hardening priorities.

## Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | Component-based user interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and task models |
| [Vite](https://vite.dev/) | Development server and production builds |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive, utility-first styling |
| [ESLint](https://eslint.org/) | Code-quality checks |

### Backend

| Technology | Purpose |
| --- | --- |
| [FastAPI](https://fastapi.tiangolo.com/) | HTTP API framework |
| [Pydantic](https://docs.pydantic.dev/) | Request validation and data models |
| [Uvicorn](https://www.uvicorn.org/) | ASGI development server |
| [`pwdlib`](https://frankie567.github.io/pwdlib/) | Password hashing and verification |
| Python | Backend runtime |
| PostgreSQL | Planned durable database |
| [Alembic](https://alembic.sqlalchemy.org/) | Planned database migrations |

## Project Structure

```text
KanbanProj_1/
├── frontend/
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── assets/                 # Image and SVG assets
│   │   ├── components/
│   │   │   ├── InputForm.tsx       # Task creation form
│   │   │   └── board.tsx           # Columns, cards, controls, and drag/drop
│   │   ├── App.tsx                 # Task operations and local persistence
│   │   ├── index.css               # Tailwind CSS entry point
│   │   ├── main.tsx                # React application entry point
│   │   └── types.ts                # Shared frontend task types
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── controllers/
│   │   ├── authController.py       # Login HTTP route
│   │   ├── taskController.py       # Task HTTP routes
│   │   └── userController.py       # User CRUD routes
│   ├── core/
│   │   └── security.py             # Password hashing and verification
│   ├── models/
│   │   ├── loginModels.py          # Login request model
│   │   ├── models.py               # Pydantic task models
│   │   └── userModels.py           # Public and internal user models
│   ├── services/
│   │   ├── authService.py          # Credential verification
│   │   ├── taskService.py          # In-memory task operations
│   │   └── userService.py          # In-memory user operations
│   ├── inMemoryTasks.py            # Temporary task collection
│   ├── inMemoryUsers.py            # Temporary user collection
│   └── main.py                     # FastAPI application entry point
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.13 or newer
- npm
- Python with virtual-environment support—the backend is currently developed with Python 3.14
- [Postman](https://www.postman.com/) or another HTTP client for manual API testing

### Clone the Repository

```bash
git clone https://github.com/Palden78/KanbanProj_1.git
cd KanbanProj_1
```

## Running the Frontend

From the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

### Frontend Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Check the source code with ESLint |
| `npm run preview` | Preview the production build locally |

## Running the Backend

The backend dependency manifest has not been added yet, so the following remains a provisional development setup.

From the repository root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install "fastapi[standard]" "pwdlib[bcrypt]"
fastapi dev main.py
```

Alternatively, start the application with Uvicorn:

```bash
python -m uvicorn main:app --reload
```

The API normally runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

FastAPI provides generated documentation at:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- OpenAPI schema: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

## Current API

### Health Check

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Return the FastAPI smoke-test response |

### Tasks

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| `GET` | `/tasks/` | `200 OK` | Retrieve all tasks |
| `POST` | `/tasks/` | `201 Created` | Create a task |
| `GET` | `/tasks/{task_id}` | `200 OK` | Retrieve one task |
| `PATCH` | `/tasks/{task_id}` | `200 OK` | Edit a task or move it to another column |
| `DELETE` | `/tasks/{task_id}` | `204 No Content` | Delete a task |

Unknown task IDs return `404 Not Found` for single-task operations.

### Users

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| `GET` | `/users/` | `200 OK` | Retrieve all users |
| `POST` | `/users/` | `201 Created` | Create an account |
| `GET` | `/users/{user_id}` | `200 OK` | Retrieve one user |
| `PATCH` | `/users/{user_id}` | `200 OK` | Update a user's profile |
| `DELETE` | `/users/{user_id}` | `204 No Content` | Delete a user |

Account creation accepts a username, email address, and password. Passwords are hashed before storage and must never appear—either as plaintext or hashes—in public API responses.

### Authentication

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | `200 OK` | Verify an email and password |

Login currently performs credential verification and returns public user information. Access tokens, server-side sessions, authenticated-route dependencies, and authorization are not implemented yet.

### Task Data Shape

A created task resembles:

```json
{
  "taskName": "Build the task API",
  "description": "Implement and test CRUD operations",
  "id": "3156dedf-5fc4-45bb-9a73-52b2882a2d7e",
  "status": "To Do",
  "createdAt": "2026-08-19T08:26:25.057339+00:00"
}
```

The server owns the `id`, initial status, and creation timestamp. A partial update can change the name, description, or status:

```json
{
  "status": "In Progress"
}
```

## Testing with Postman

Suggested local base URL:

```text
http://localhost:8000
```

A basic task lifecycle is:

1. `POST /tasks/` to create a task.
2. `GET /tasks/` to verify it appears in the collection.
3. `GET /tasks/{task_id}` to retrieve it by ID.
4. `PATCH /tasks/{task_id}` to edit it or change its column.
5. `DELETE /tasks/{task_id}` to remove it.
6. Repeat the GET-by-ID request and expect `404 Not Found`.

Because storage is currently in memory, restarting Uvicorn resets this collection.

## Current Data Flows

### Frontend

```text
User action
    ↓
React state
    ↓
Browser localStorage
```

Frontend task data survives page reloads for the same browser profile and origin, but it is not synchronized across users or devices.

### Backend

```text
Postman / HTTP client
    ↓
FastAPI task, user, and authentication controllers
    ↓
Task, user, and authentication services
    ↓
In-memory task and user dictionaries
```

Backend task and user data survive multiple requests while the server process remains active, but both collections are lost when the server restarts. Account creation hashes passwords before storage, and login verifies a supplied password against its stored hash.

## Planned User Ownership

User records and in-memory CRUD now exist. The next domain milestone is connecting users and tasks through a one-to-many relationship:

```text
One User ───── owns ───── Many Tasks
Each Task ─── belongs to ─── One User
```

Planned ownership work includes:

- A required `userId` on each task
- Validation that a task owner exists before task creation
- Retrieval of all tasks owned by the authenticated user
- Authorization that prevents users from reading or changing another user's tasks
- A defined policy for deleting users who still own tasks

Task ownership and authorization are not implemented yet.

## PostgreSQL Goal

After the in-memory API and ownership rules are stable and tested, temporary dictionaries will be replaced with PostgreSQL-backed persistence through a Python PostgreSQL client.

The intended relational shape is:

```text
users
  id              PRIMARY KEY

 tasks
  id              PRIMARY KEY
  user_id         NOT NULL, FOREIGN KEY → users.id
```

Database selection details, schema migrations, connection pooling, and environment configuration are intentionally deferred until the in-memory API behavior is complete.

## Roadmap

- [x] Build the responsive Kanban interface
- [x] Add task creation, editing, deletion, and button-based movement
- [x] Add task timestamps
- [x] Add browser persistence
- [x] Add cross-column drag and drop
- [x] Initialize the FastAPI service
- [x] Define Pydantic task schemas
- [x] Add in-memory task storage
- [x] Implement task create and retrieval endpoints
- [x] Implement task update, movement, and deletion endpoints
- [ ] Complete full Postman regression testing for task CRUD
- [ ] Add a reproducible backend dependency manifest
- [x] Define user schemas and implement in-memory user CRUD
- [x] Hash passwords before storing user accounts
- [x] Add email-and-password login credential verification
- [ ] Ensure every public user response excludes password hashes
- [ ] Normalize email consistently and standardize authentication failures
- [ ] Issue an access token or establish a server-side session
- [ ] Protect API routes with an authenticated-user dependency
- [ ] Add required one-to-many task ownership and authorization
- [ ] Add backend persistence with PostgreSQL and Alembic
- [ ] Add automated frontend and backend tests
- [ ] Configure CORS and an API base URL
- [ ] Connect the React frontend to FastAPI
- [ ] Add deployment and continuous-integration configuration

## Current Limitations

- The frontend is not connected to the backend.
- Frontend and backend currently maintain separate task collections.
- Backend data is lost whenever the server restarts.
- Login verifies credentials but does not maintain authenticated state.
- User-response filtering and authentication error handling are still being hardened.
- Task ownership and cross-user authorization are not implemented yet.
- PostgreSQL persistence and Alembic migrations have not been added.
- No token/session authentication or collaborative boards are available.
- Drag and drop does not reliably support touch or reorder tasks within a column.
- Search, filters, priorities, labels, and due dates are not implemented.
- Frontend deletion has no confirmation or undo action.
- There are no automated tests or deployment configuration.

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request explaining what changed.


# FOR DEV PUSHING
# Running from root
./scripts/quickpush.sh "feat: add user PATCH endpoint fixes"

# Running from inside backend/
../scripts/quickpush.sh





CONSISTENCY IS KEY