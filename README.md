# Kanban Task Board

A learning-focused full-stack Kanban application for organizing tasks across **To Do**, **In Progress**, and **Done**.

The project has two frontend experiences:

- A **demo board** with browser-local task CRUD and `localStorage` persistence.
- An **authenticated workspace** backed by FastAPI and PostgreSQL, with registration, login, owner-scoped task CRUD, profile editing, and account deletion.

The repository can be run with local Node.js, Python, and PostgreSQL processes or as a Docker Compose development stack.

_Last updated: September 25, 2026._

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-development-2496ED?logo=docker&logoColor=white)

## Project Status

| Area | Current status |
| --- | --- |
| Demo board | Functional local CRUD, movement, drag and drop, and `localStorage` persistence |
| Authentication UI | Registration, login feedback, session restoration, and logout implemented |
| Account management | Authenticated profile viewing/editing and confirmed account deletion implemented |
| Authenticated task CRUD | Load, create, edit, move, drag and drop, and delete operations persist through the API |
| Backend task API | Protected CRUD routes implemented with owner enforcement |
| Backend user API | Public registration plus protected `/users/me` read, update, and delete routes; unsafe public listing routes are disabled |
| PostgreSQL persistence | Implemented with SQLAlchemy, Psycopg 3, and Alembic |
| Configuration | Frontend API URL and backend allowed CORS origins can be set through environment variables |
| Containers | Backend, frontend, and PostgreSQL development services are defined in Docker Compose |
| Continuous integration | GitHub Actions runs frontend checks, the full SQLite suite, and PostgreSQL migration/integration checks |
| Backend tests | Verified September 25, 2026: 9 SQLite tests and 6 selected PostgreSQL tests passed |
| Frontend tests | Not configured |
| Frontend quality checks | ESLint and the TypeScript/Vite production build pass |

> [!IMPORTANT]
> The Docker setup is development-oriented: it uses bind mounts, starts Uvicorn with reload, and serves the frontend through Vite. Alembic migrations must still be run explicitly; the Compose stack does not apply them automatically.

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

### Authenticated workspace

The authenticated application currently:

1. Registers new accounts through `POST /users/` after client-side username, email, password-length, and password-confirmation validation.
2. Sends login credentials to `POST /auth/login` and displays a generic invalid-email-or-password message when login fails.
3. Stores the returned access token in `sessionStorage` under `access_token`.
4. Calls `GET /users/me` when restoring a browser session.
5. Calls protected `GET /tasks/` with `Authorization: Bearer <access-token>` and renders the returned tasks by status.
6. Creates tasks through `POST /tasks/` and appends the returned server task.
7. Persists title, description, and status updates through `PATCH /tasks/{task_id}` and updates the matching card in local state.
8. Uses the same PATCH flow for movement buttons and drag-and-drop status changes.
9. Deletes tasks through `DELETE /tasks/{task_id}` and removes them from state after success.
10. Opens an account page that can update the current username and email through `PATCH /users/me`.
11. Permanently deletes the current account through `DELETE /users/me` after the user types `DELETE`; owned tasks are removed through the database cascade.
12. Clears the token and returns to login on logout, account deletion, or a rejected task-loading token.

Registration, profile-update, account-deletion, task-loading, and task-mutation failures are currently logged to the browser console rather than consistently displayed in the UI. Login failures are visible, but rejected credentials and network/server failures share the same generic message.

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
- Protected `/users/me` retrieval, profile update, and account deletion.
- Public raw-user listing and lookup routes disabled.
- Protected task create, list, retrieve, update, and delete routes.
- Server-assigned task IDs, initial status, timestamp, and owner.
- Owner-filtered task collections and ownership checks for individual tasks.
- A required indexed task owner foreign key with `ON DELETE CASCADE`.
- Comma-separated CORS origin configuration through `ALLOWED_ORIGINS`.
- Dockerfiles and a Compose development stack for FastAPI, Vite, and PostgreSQL.

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
| Environment variables | Frontend API base URL through `VITE_API_BASE_URL` |

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
| Docker Compose | Local development orchestration for frontend, API, and database |

## Project Structure

```text
KanbanProj_1/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts                # Registration, login, and current-user requests
│   │   │   ├── client.ts              # Shared Axios client and configurable base URL
│   │   │   ├── tasks.ts               # Authenticated task requests
│   │   │   └── user.ts                # Profile update and account deletion requests
│   │   ├── components/
│   │   │   ├── AccountPage.tsx        # Profile editing and account deletion UI
│   │   │   ├── AuthBoard.tsx          # Authenticated task columns and cards
│   │   │   ├── AuthenticatedBoard.tsx # Task loading and API-backed mutations
│   │   │   ├── DemoBoard.tsx          # Local demo state and persistence
│   │   │   ├── InputForm.tsx          # Task creation form
│   │   │   ├── LoginForm.tsx          # Login form fields
│   │   │   ├── LoginPage.tsx          # Login, registration, and demo entry view
│   │   │   ├── RegistrationPage.tsx   # Account creation form
│   │   │   └── board.tsx              # Demo task columns and cards
│   │   ├── App.tsx                    # Authentication, public, board, and account views
│   │   ├── main.tsx                   # React application entry point
│   │   ├── index.css                  # Tailwind CSS entry point
│   │   └── types.ts                   # Frontend request and task types
│   ├── Dockerfile                     # Vite development image
│   ├── .dockerignore
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
│   ├── Dockerfile                     # FastAPI image
│   ├── .dockerignore
│   ├── requirements.in                # Direct runtime dependencies
│   ├── requirements.txt               # Pinned runtime dependencies
│   └── main.py                        # FastAPI application entry point
├── .github/
│   └── workflows/
│       └── ci.yml                     # Frontend and backend CI jobs
├── scripts/
├── docker-compose.yml                 # Development web, API, and PostgreSQL stack
├── .env.compose                       # Local Compose values; ignored by Git
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.13 or newer
- npm
- Python with virtual-environment support; current development uses Python 3.14
- For the manual setup: a running PostgreSQL server plus a database and role with permission to apply migrations
- For the containerized setup: Docker with the Compose plugin
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

## Run with Docker Compose

The Compose stack starts PostgreSQL 17, the FastAPI API, and the Vite frontend for local development.

### 1. Create the Compose environment file

Create `.env.compose` in the repository root:

```dotenv
POSTGRES_DB=kanban
POSTGRES_USER=kanban
POSTGRES_PASSWORD=<local-database-password>
JWT_SECRET=<strong-random-development-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173
```

Both `.env.compose` and `.env` are ignored by Git. Do not commit secrets or database credentials.

### 2. Build and start the services

```bash
docker compose --env-file .env.compose up --build
```

The development services are exposed only on the local machine:

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:8000](http://localhost:8000)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

The database uses the named `postgres_data` volume, while `frontend_node_modules` keeps container-installed frontend dependencies separate from the host bind mount.

### 3. Apply migrations

The current Compose command does not run Alembic automatically. With the services running, apply the schema in a second terminal:

```bash
docker compose --env-file .env.compose exec api alembic upgrade head
```

Stop the stack with `Ctrl+C`, or run this from another terminal:

```bash
docker compose --env-file .env.compose down
```

Use `docker compose --env-file .env.compose down -v` only when you intentionally want to delete the local PostgreSQL data volume.

## Run the Authenticated Application Manually

Authenticated mode requires PostgreSQL, FastAPI, and the React frontend.

### 1. Configure PostgreSQL and environment variables

Create the PostgreSQL database and role first. Then create `.env` in the **repository root** with your own local values:

```dotenv
JWT_SECRET=<strong-random-development-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost:5432/<database>
ALLOWED_ORIGINS=http://localhost:5173
```

The real `.env` file is ignored by Git. Never commit JWT secrets or database credentials.

`JWT_ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` are configuration values. HS256 and 30 minutes above are example local settings, not hard-coded token behavior. `ALLOWED_ORIGINS` accepts a comma-separated list and defaults to `http://localhost:5173` when omitted.

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

Use [http://localhost:5173](http://localhost:5173). The backend allows the comma-separated origins in `ALLOWED_ORIGINS`; if the variable is omitted, only `http://localhost:5173` is accepted by default.

The Axios client uses `VITE_API_BASE_URL` when it is defined and otherwise falls back to `http://localhost:8000`. To target another API when starting Vite manually, create `frontend/.env.local`, for example:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

### 5. Create an account and log in

Choose **Create an account** on the login page, enter a username, email, and password of at least eight characters, and then sign in with the registered email and password. Registration calls `POST /users/`; the API remains available through Swagger UI for manual testing.

## Frontend Scripts

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint across the frontend |
| `npm run preview` | Preview an existing production build |

As verified on September 25, 2026, both `npm run lint` and `npm run build` pass. No frontend automated test command is configured yet.

## Continuous Integration

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on pull requests, pushes to `main`, and manual dispatches. It uses three parallel jobs:

- **Frontend checks** install dependencies with `npm ci`, run ESLint, and create the TypeScript/Vite production build.
- **Backend tests (SQLite)** install the pinned backend dependencies plus pytest and run the complete nine-test suite against in-memory SQLite.
- **Backend PostgreSQL and migrations** starts an ephemeral PostgreSQL 17 service, applies `alembic upgrade head`, runs `alembic check`, and executes six selected integration tests against the migrated schema.

The current green baseline is **9 passing SQLite tests**, **6 passing PostgreSQL tests**, clean frontend lint, a successful frontend production build, and no Alembic model/schema drift. Frontend automated tests, image publishing, and deployment automation are not part of the workflow yet.

Because this is a private repository on GitHub Free, passing checks currently follow a manual pull-request policy rather than an enforced branch-protection rule: changes should not be merged unless all three jobs pass.

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
| `DELETE` | `/users/me` | Bearer | `204 No Content` | Delete the current user and their tasks |

The former public `GET /users/` and `GET /users/{user_id}` handlers are disabled, so raw user records and password hashes are no longer exposed through those routes. The old ID-based PATCH and DELETE handlers also remain disabled; account management uses the bearer-protected `/users/me` routes.

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

### Authenticated write paths

```text
Create task
    ↓ POST /tasks/
FastAPI → SQLAlchemy → PostgreSQL
    ↓
Append the returned server task to React state

Edit title or description
Move with buttons or drag and drop
    ↓ PATCH /tasks/{task_id}
FastAPI → SQLAlchemy → PostgreSQL
    ↓
Update React state after success

Delete task
    ↓ DELETE /tasks/{task_id}
FastAPI → SQLAlchemy → PostgreSQL
    ↓
Remove the task from React state after success
```

### Account paths

```text
Register
    ↓ POST /users/
FastAPI → SQLAlchemy → PostgreSQL
    ↓
Return to the login view

Edit profile
    ↓ PATCH /users/me with bearer token
FastAPI → SQLAlchemy → PostgreSQL
    ↓
Replace the authenticated user in React state

Delete account after typing DELETE
    ↓ DELETE /users/me with bearer token
FastAPI → SQLAlchemy → PostgreSQL
    ↓ database cascade removes owned tasks
Clear session token and return to login
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

The initial migration is now checked automatically against a fresh PostgreSQL service in CI. The PostgreSQL lane applies the migration history to `head`, checks for ORM/migration drift, and then exercises selected database-backed behavior.

## Testing

Backend test sources currently cover parts of registration, login, JWT rejection, task creation, list isolation, ownership, and account-deletion cascading.

The test harness has two database modes:

- The default mode runs all nine tests against in-memory SQLite with foreign-key enforcement and uses `Base.metadata.create_all()`/`drop_all()` for fast per-test schema isolation.
- The PostgreSQL mode is explicitly enabled with `POSTGRES_TEST_DATABASE_URL`, requires a dedicated database named `kanban_test`, and uses only the schema created by Alembic. It truncates application rows between tests while preserving `alembic_version`.
- Both modes override FastAPI's `get_db` dependency so requests use the selected test session.
- The `postgresql` marker means “also run this test in the PostgreSQL lane”; marked tests remain part of the complete SQLite suite.

The latest verified backend runs on September 25, 2026 completed with **9 passing SQLite tests** and **6 passing PostgreSQL tests**. A fresh PostgreSQL database also passed `alembic upgrade head` and `alembic check` with no new upgrade operations detected.

The suite is green, but its coverage and dependency setup still need improvement:

- `pytest` is installed explicitly by CI but is not yet declared in a backend development dependency manifest.
- Cross-user PATCH and DELETE tests are currently absent.
- Both runs report one Starlette/httpx deprecation warning and one Pydantic field-argument deprecation warning.
- No frontend test runner or frontend tests are configured.

If pytest is installed in the active backend environment, run the complete SQLite suite from `backend/` with:

```bash
python -m pytest
```

To reproduce the PostgreSQL lane locally, use a disposable PostgreSQL database named `kanban_test`, set both `DATABASE_URL` and `POSTGRES_TEST_DATABASE_URL` to it before Python starts, and run:

```bash
python -m alembic upgrade head
python -m alembic check
python -m pytest -m postgresql
```

Never set `POSTGRES_TEST_DATABASE_URL` to a development or production database: the integration fixture truncates the `task` and `user` tables between tests.

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
- [x] Create authenticated tasks through `POST /tasks/` and append the server response.
- [x] Persist authenticated edits, button movement, and drag-and-drop movement through `PATCH /tasks/{task_id}`.
- [x] Persist authenticated deletion through `DELETE /tasks/{task_id}`.
- [x] Display a visible message when login fails.
- [x] Add initial backend pytest sources.
- [x] Fix immediate title rendering after authenticated task edits.
- [x] Add frontend account registration.
- [x] Add authenticated profile viewing and editing.
- [x] Add confirmed account deletion and return to the login view.
- [x] Disable public raw-user listing and lookup routes.
- [x] Read the frontend API URL from `VITE_API_BASE_URL`.
- [x] Make allowed CORS origins configurable through `ALLOWED_ORIGINS`.
- [x] Add backend and frontend Dockerfiles plus a Compose development stack.
- [x] Add GitHub Actions CI for frontend lint/build and backend tests.
- [x] Restore clean frontend lint, type-check, and production-build results.
- [x] Repair the account-deletion cascade test.
- [x] Add PostgreSQL service-container and Alembic migration checks to CI.
- [x] Run a selected backend integration subset against PostgreSQL.

### Next steps

- [ ] Standardize task response models and frontend/backend field naming.
- [ ] Tighten task and user update validation and error handling.
- [ ] Add visible registration, profile-update, account-deletion, task-loading, and task-mutation feedback.
- [ ] Distinguish invalid credentials from network and server failures in the login UI.
- [ ] Expand backend authentication, ownership, update, delete, and cascade tests.
- [ ] Add frontend unit, component, API-integration, and end-to-end tests.
- [ ] Add an automatic or clearly enforced migration step to the container workflow.
- [ ] Add production-oriented container builds and serving configuration.
- [ ] Publish versioned container images after successful CI checks.
- [ ] Add staging and production deployment workflows.

## Current Limitations

- Registration, profile-update, account-deletion, task-loading, and task-mutation failures are logged to the console rather than consistently shown in the UI.
- Login failures are visible, but network and server errors currently use the same “Invalid email or password” message as rejected credentials.
- Profile updates and account deletion do not currently display success or failure notifications.
- Some startup failures can leave the frontend on its checking state.
- Task routes do not enforce explicit response models and currently return snake_case ORM fields while request models use camelCase.
- The complete backend suite still runs only on SQLite; the PostgreSQL CI lane intentionally repeats a six-test integration subset and does not test migration downgrade paths.
- Frontend automated tests are absent even though lint and the production build now pass.
- The Compose stack is for development only, runs Uvicorn and Vite development servers, and requires a separate Alembic migration command.
- The PostgreSQL port is not published to the host by Compose; database access is internal to the stack unless the configuration is changed.
- Refresh tokens, server-side logout, token revocation, and password update/reset are not implemented.
- Collaborative boards, search, filters, priorities, labels, and due dates are not implemented.
- Drag and drop does not reliably support touch or within-column reordering.
- CI validates PostgreSQL upgrades and model/schema drift but does not publish deployable artifacts, and continuous deployment is not configured.

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request explaining what changed.
