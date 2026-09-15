# Kanban Task Board

A learning-focused full-stack Kanban application for organizing tasks across **To Do**, **In Progress**, and **Done**.

The project now has two distinct frontend experiences:

- A **demo board** with browser-local task CRUD and `localStorage` persistence.
- An **authenticated board** connected to the FastAPI backend for login, session validation, and owner-scoped task loading.

Authenticated task-write integration is the current work in progress. The backend CRUD routes already exist, while the frontend create flow is incomplete and edit, move, and delete actions are not yet persisted to the API.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)

## Project Status

| Area | Current status |
| --- | --- |
| Demo board | Functional local CRUD, movement, drag and drop, and `localStorage` persistence |
| Authentication UI | Login, session restoration, and logout implemented |
| Authenticated task reads | `GET /tasks/` integrated and rendered by status |
| Authenticated task creation | `addTask` helper and initial board call added; response-to-state mapping is incomplete |
| Authenticated task updates/deletion | Backend routes exist; frontend actions are still React-state-only |
| Backend task API | Protected CRUD routes implemented with owner enforcement |
| PostgreSQL persistence | Implemented with SQLAlchemy, Psycopg 3, and Alembic |
| Backend tests | Initial pytest suite exists using in-memory SQLite; coverage and suite reliability need work |
| Frontend tests | Not configured |
| Frontend quality checks | Lint, type-check, and production build are not currently clean |

> [!IMPORTANT]
> Frontend/backend integration is **partial**, not absent. `POST /auth/login`, `GET /users/me`, and `GET /tasks/` are connected. The authenticated `POST /tasks/` flow is under active development, while authenticated PATCH and DELETE behavior is not yet wired to the API.

## Frontend Behavior

### Demo board

The demo board works without an account or backend connection. It can:

- Create tasks with a name and description.
- Edit and delete tasks.
- Move tasks with buttons or native HTML drag and drop.
- Display task counts, timestamps, and empty-column states.
- Persist tasks and their current statuses in `localStorage`.
- Adapt across mobile, tablet, and desktop layouts.

Within-column reordering is not supported, and native HTML drag and drop may be limited on touch devices.

### Authenticated board

The authenticated application currently:

1. Sends login credentials to `POST /auth/login`.
2. Stores the returned access token in `sessionStorage` under `access_token`.
3. Calls `GET /users/me` when restoring a browser session.
4. Calls protected `GET /tasks/` with `Authorization: Bearer <access-token>`.
5. Replaces board state with the authenticated user's task array.
6. Renders backend tasks in their **To Do**, **In Progress**, and **Done** columns.
7. Clears the token and returns to login on logout or a rejected task-loading token.

The authenticated task-creation handler now calls the `addTask` API helper, but its returned task is not yet mapped into `AuthUserTask` state correctly. Treat this flow as unfinished: the POST request may reach the backend even though the UI does not complete the state update. Authenticated edit, move, drag-and-drop, and delete controls currently change React state only and are reset from backend data on reload.

There is no frontend registration page yet. Create an account through `POST /users/` before using the login form.

## Backend Features

- FastAPI application with generated OpenAPI documentation.
- Pydantic request validation.
- SQLAlchemy ORM models and synchronous request-scoped sessions.
- PostgreSQL connectivity through Psycopg 3.
- Alembic schema migrations.
- User registration with normalized email addresses.
- Password hashing and verification with `pwdlib`/bcrypt.
- JWT access-token creation and validation with PyJWT.
- Bearer-token extraction with FastAPI `HTTPBearer`.
- Database-backed current-user resolution.
- Protected `/users/me` retrieval, update, and deletion.
- Protected task create, list, retrieve, update, and delete routes.
- Server-assigned task IDs, initial status, timestamp, and owner.
- Owner-filtered task collections and ownership checks for individual tasks.
- A required indexed task owner foreign key with `ON DELETE CASCADE`.

The active user, authentication, and task services use SQLAlchemy. The earlier in-memory Python storage modules have been removed from the active source code.

## Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | Component-based user interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and frontend data models |
| [Vite](https://vite.dev/) | Development server and production builds |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive utility-first styling |
| [Axios](https://axios-http.com/) | Authentication and task API requests |
| [ESLint](https://eslint.org/) | Code-quality checks |
| Browser storage | Demo tasks in `localStorage`; access token in `sessionStorage` |

### Backend

| Technology | Purpose |
| --- | --- |
| [FastAPI](https://fastapi.tiangolo.com/) | HTTP API framework |
| [Pydantic](https://docs.pydantic.dev/) | Request validation and data models |
| [Uvicorn](https://www.uvicorn.org/) | ASGI development server |
| [`pwdlib`](https://frankie567.github.io/pwdlib/) | Password hashing and verification |
| [PyJWT](https://pyjwt.readthedocs.io/) | JWT access-token creation and validation |
| [`python-dotenv`](https://pypi.org/project/python-dotenv/) | Local environment loading |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM, engine, and database sessions |
| [Psycopg 3](https://www.psycopg.org/psycopg3/) | PostgreSQL driver |
| PostgreSQL | Durable relational database |
| [Alembic](https://alembic.sqlalchemy.org/) | Schema migration management |
| pytest and SQLite | Current backend test harness |

## Project Structure

```text
KanbanProj_1/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts                # Login and current-user requests
│   │   │   ├── client.ts              # Shared Axios client
│   │   │   └── tasks.ts               # Authenticated task requests
│   │   ├── components/
│   │   │   ├── AuthBoard.tsx          # Authenticated task columns and cards
│   │   │   ├── AuthenticatedBoard.tsx # Authenticated task state and API loading
│   │   │   ├── DemoBoard.tsx          # Local demo state and persistence
│   │   │   ├── InputForm.tsx          # Task creation form
│   │   │   ├── LoginForm.tsx          # Login form fields
│   │   │   ├── LoginPage.tsx          # Login and demo entry view
│   │   │   └── board.tsx              # Demo task columns and cards
│   │   ├── App.tsx                    # Authentication bootstrap and view selection
│   │   ├── main.tsx                   # React application entry point
│   │   ├── index.css                  # Tailwind CSS entry point
│   │   └── types.ts                   # Frontend request and task types
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── controllers/
│   │   ├── authController.py          # Login route
│   │   ├── taskController.py          # Protected task routes
│   │   └── userController.py          # Registration and user routes
│   ├── core/
│   │   ├── config.py                  # JWT and database configuration
│   │   ├── database.py                # Engine, session factory, and `get_db`
│   │   └── security.py                # Password, token, and current-user helpers
│   ├── db/
│   │   ├── base.py                    # SQLAlchemy declarative base
│   │   └── orm_models.py              # User and Task ORM mappings
│   ├── models/
│   │   ├── loginModels.py             # Login and token models
│   │   ├── models.py                  # Task request/update models
│   │   └── userModels.py              # User request/response models
│   ├── services/
│   │   ├── authService.py             # Credential verification and JWT issuance
│   │   ├── taskService.py             # Owner-scoped SQLAlchemy task operations
│   │   └── userService.py             # SQLAlchemy user operations
│   ├── tests/
│   │   ├── conftest.py                # SQLite test database and app overrides
│   │   ├── test_auth.py               # Authentication tests
│   │   ├── test_ownership.py          # Task ownership tests
│   │   └── test_cascade.py            # Account-deletion cascade test
│   ├── alembic/
│   │   ├── versions/                  # Versioned schema migrations
│   │   └── env.py                     # Alembic environment configuration
│   ├── requirements.in                # Direct runtime dependencies
│   ├── requirements.txt               # Pinned runtime dependencies
│   └── main.py                        # FastAPI application entry point
├── scripts/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.13 or newer
- npm
- Python with virtual-environment support; current development uses Python 3.14
- A running PostgreSQL server for authenticated mode
- A PostgreSQL database and role with permission to apply the project migration
- Optional: [Postman](https://www.postman.com/) or another API client

### Clone the repository

```bash
git clone https://github.com/Palden78/KanbanProj_1.git
cd KanbanProj_1
```

## Run the Demo Board

The demo board does not require FastAPI or PostgreSQL.

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and choose the demo-board option from the login page.

## Run the Authenticated Application

Authenticated mode requires PostgreSQL, FastAPI, and the React frontend.

### 1. Configure PostgreSQL and environment variables

Create the PostgreSQL database and role first. Then create `.env` in the **repository root** with your own local values:

```dotenv
JWT_SECRET=<strong-random-development-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost:5432/<database>
```

The real `.env` file is ignored by Git. Never commit JWT secrets or database credentials.

`JWT_ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` are configuration values. HS256 and 30 minutes above are example local settings, not hard-coded token behavior.

### 2. Install and migrate the backend

From the repository root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
alembic upgrade head
```

Alembic owns the application schema. The production application does not use `Base.metadata.create_all()` to create it.

### 3. Start FastAPI

From `backend/` with the virtual environment active:

```bash
fastapi dev main.py
```

Or:

```bash
python -m uvicorn main:app --reload
```

The API is available at [http://localhost:8000](http://localhost:8000), with generated documentation at:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- OpenAPI schema: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### 4. Start React in a second terminal

```bash
cd frontend
npm ci
npm run dev
```

Use [http://localhost:5173](http://localhost:5173). The backend currently allows that exact CORS origin only; `http://127.0.0.1:5173` or a different Vite port will not match it.

The Axios client currently targets `http://localhost:8000` with a five-second timeout. `VITE_API_BASE_URL` is referenced in the client but is not yet applied as the `baseURL`, so the API address is not currently environment-configurable.

### 5. Create an account and log in

There is no registration form in the frontend yet. Create an account with `POST /users/`, for example through Swagger UI:

```json
{
  "username": "example-user",
  "email": "user@example.com",
  "password": "at-least-eight-characters"
}
```

Then use that email and password on the frontend login page.

## Frontend Scripts

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint across the frontend |
| `npm run preview` | Preview an existing production build |

At the current development snapshot, lint and build do not pass cleanly. The unfinished authenticated create-task state mapping is one build blocker, and additional unused declarations remain elsewhere in the frontend.

## Current API

### Root response

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Return a static welcome response; this is not a database health check |

### Authentication

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Public | `200 OK` | Verify credentials and issue an access token |

Successful login returns the token and public user data under `user`:

```json
{
  "message": "login successful",
  "token": {
    "access_token": "<signed-jwt>",
    "token_type": "bearer"
  },
  "user": {
    "id": "<user-id>",
    "username": "<username>",
    "email": "<normalized-email>",
    "createdAt": "<database-generated-timestamp>"
  }
}
```

Protected requests use:

```http
Authorization: Bearer <access-token>
```

Access tokens contain `sub`, `iat`, `exp`, and `type: "access"`. The backend validates the configured signature algorithm, expiration, subject, and access-token type, then resolves the subject to a database user.

Refresh tokens, server-side logout, revocation, and issuer/audience checks are not implemented.

### Tasks

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/tasks/` | Bearer | `200 OK` | List the current user's tasks |
| `POST` | `/tasks/` | Bearer | `201 Created` | Create a task owned by the current user |
| `GET` | `/tasks/{task_id}` | Bearer | `200 OK` | Retrieve an owned task |
| `PATCH` | `/tasks/{task_id}` | Bearer | `200 OK` | Edit or move an owned task |
| `DELETE` | `/tasks/{task_id}` | Bearer | `204 No Content` | Delete an owned task |

Missing or invalid authentication returns `401 Unauthorized`. Unknown task IDs return `404 Not Found`. Access to a task owned by another user currently returns `403 Forbidden`.

#### Create-task request

The current Pydantic request uses camelCase and requires both fields. Send an empty string if the task has no description.

```json
{
  "taskName": "Build the task API",
  "description": "Implement and test CRUD operations"
}
```

The server assigns `id`, the initial `To Do` status, the creation timestamp, and `user_id` from the authenticated user.

#### Current task response

Task routes currently return raw ORM objects without an explicit response model. The current wire format is therefore snake_case:

```json
{
  "id": "3156dedf-5fc4-45bb-9a73-52b2882a2d7e",
  "task_name": "Build the task API",
  "description": "Implement and test CRUD operations",
  "status": "To Do",
  "created_at": "<database-generated-timestamp>",
  "user_id": "62762ce5-b5d1-4adf-8d27-3d60ba085a16"
}
```

`GET /tasks/` returns a direct array of these objects. The frontend `AuthUserTask` type currently follows this snake_case response.

A partial update can change `taskName`, `description`, or `status`, but not ownership:

```json
{
  "status": "In Progress"
}
```

User and task creation timestamps are database-generated. The current database columns are timezone-naive, so the API does not guarantee offset-aware UTC timestamps.

### Users

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/users/` | Public | `201 Created` | Create an account |
| `GET` | `/users/me` | Bearer | `200 OK` | Retrieve the current user |
| `PATCH` | `/users/me` | Bearer | `200 OK` | Update the current user's profile |
| `DELETE` | `/users/me` | Bearer | `204 No Content` | Delete the current user |
| `GET` | `/users/` | Public legacy route | `200 OK` | Return raw user ORM records |
| `GET` | `/users/{user_id}` | Public legacy route | `200 OK` | Return one raw user ORM record |

> [!WARNING]
> `GET /users/` and `GET /users/{user_id}` are currently public and return raw ORM users, including `password_hash`. These routes are an active security limitation and should be protected or removed and given safe response models before deployment.

The ID-based user PATCH and DELETE handlers are commented out. Prefer the bearer-protected `/users/me` routes for current-user operations.

## Data Flows

### Demo mode

```text
User action
    ↓
React state
    ↓
localStorage["tasks"]
```

### Authenticated read path

```text
Login form
    ↓ POST /auth/login
JWT in sessionStorage["access_token"]
    ↓ GET /users/me on session restoration
Authenticated board
    ↓ GET /tasks/
FastAPI → SQLAlchemy → PostgreSQL
```

### Authenticated write path

```text
Create task
    ↓ POST /tasks/ call started
Response-to-state mapping still incomplete

Edit / move / delete
    ↓
React state only
    ↓
Not persisted; backend data is restored on reload
```

## Ownership and Persistence

The database schema enforces a many-tasks-to-one-user association through `task.user_id`:

```text
One User ───── owns ───── Many Tasks
Each Task ─── belongs to ─── One User

user.id  ←── task.user_id
```

Current ownership behavior includes:

- Server-assigned ownership from the authenticated JWT subject.
- Owner-filtered task collection responses.
- Ownership checks before retrieving, updating, or deleting a task.
- Immutable ownership through the task update contract.
- An indexed, non-null foreign key with `ON DELETE CASCADE`.

The initial migration was generated, applied, and exercised manually against PostgreSQL. Automated PostgreSQL and Alembic migration regression coverage is still pending.

## Testing

Backend test sources currently cover parts of registration, login, JWT rejection, task creation, list isolation, ownership, and intended account-deletion cascading.

The current test harness:

- Uses an in-memory SQLite database with foreign-key enforcement.
- Overrides FastAPI's `get_db` dependency.
- Uses `Base.metadata.create_all()` for test setup rather than Alembic.
- Does not exercise PostgreSQL or migration upgrades/downgrades.

Do not treat the current suite as fully green or complete:

- `pytest` is not included in the backend dependency manifests.
- The cascade test currently omits the required task `description` and does not reliably reach its intended assertion.
- Repeated ownership-test function names shadow intended cross-user PATCH and DELETE cases.
- No frontend test runner or frontend tests are configured.

If pytest is installed in the active backend environment, run the backend suite from `backend/` with:

```bash
python -m pytest
```

## Roadmap

### Completed milestones

- [x] Build the responsive three-column Kanban interface.
- [x] Add demo task creation, editing, deletion, movement, and drag and drop.
- [x] Persist demo tasks in `localStorage`.
- [x] Build the FastAPI task, user, and authentication routes.
- [x] Hash passwords and issue signed JWT access tokens.
- [x] Protect task routes and enforce user-task ownership.
- [x] Move active backend persistence to SQLAlchemy and PostgreSQL.
- [x] Add and apply the initial Alembic migration.
- [x] Correct and manually verify `/users/me` profile update/deletion behavior.
- [x] Remove the legacy in-memory Python source modules.
- [x] Add the Axios frontend API client.
- [x] Configure development CORS for `http://localhost:5173`.
- [x] Connect frontend login to `POST /auth/login`.
- [x] Restore sessions through `GET /users/me`.
- [x] Separate the local demo board from the authenticated board.
- [x] Load and render owner-scoped tasks through `GET /tasks/`.
- [x] Add initial backend pytest sources.

### Next steps

- [ ] Complete authenticated task creation and append the returned server task safely.
- [ ] Connect authenticated edits and movement to `PATCH /tasks/{task_id}`.
- [ ] Connect authenticated deletion to `DELETE /tasks/{task_id}`.
- [ ] Standardize task response models and frontend/backend field naming.
- [ ] Protect or remove the public legacy user routes and prevent password-hash exposure.
- [ ] Tighten task and user update validation and error handling.
- [ ] Repair and expand backend authentication, ownership, update, delete, and cascade tests.
- [ ] Add automated PostgreSQL and Alembic migration tests.
- [ ] Add frontend unit, component, API-integration, and end-to-end tests.
- [ ] Restore clean frontend lint, type-check, and production-build results.
- [ ] Read the frontend API URL from `VITE_API_BASE_URL`.
- [ ] Make allowed CORS origins configurable.
- [ ] Add loading states and visible API error feedback.
- [ ] Add a frontend registration flow.
- [ ] Add continuous integration and deployment configuration.

## Current Limitations

- Authenticated task creation is incomplete; a POST may succeed before the current UI state update fails.
- Authenticated edit, movement, drag-and-drop, and deletion are not API-persisted.
- The frontend API base URL is hardcoded.
- Backend CORS accepts only the local Vite origin `http://localhost:5173`.
- There is no frontend account-registration or profile-management UI.
- Login and task-request failures have limited visible user feedback.
- Some startup failures can leave the frontend on its checking state.
- Task routes do not enforce explicit response models and currently return snake_case ORM fields.
- Public legacy user routes expose password hashes.
- Backend tests use SQLite rather than PostgreSQL and require repair and broader coverage.
- Frontend automated tests are absent, and current lint/type-check/build checks are not clean.
- Refresh tokens, server-side logout, and token revocation are not implemented.
- Collaborative boards, search, filters, priorities, labels, and due dates are not implemented.
- Drag and drop does not reliably support touch or within-column reordering.
- Deployment and continuous integration are not configured.

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request explaining what changed.
