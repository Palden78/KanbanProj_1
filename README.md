# Kanban Task Board

A responsive full-stack Kanban project for organizing tasks across **To Do**, **In Progress**, and **Done**. The React frontend is functional and persists tasks in the browser. A separate FastAPI backend now provides in-memory task and user CRUD, JWT bearer authentication, protected self-service routes, and user-owned tasks while PostgreSQL persistence and frontend integration are developed independently.

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
| Login | Credential verification and JWT access-token issuance implemented |
| Bearer-token verification | Implemented |
| Current-user dependency | Implemented with `/users/me` |
| Route protection | Task and self-service user routes protected; legacy user routes pending |
| Task ownership | Required and owner-scoped in memory |
| PostgreSQL persistence | Planned with Alembic migrations |
| Frontend/backend integration | Not started |
| Automated testing | Not implemented |

> [!IMPORTANT]
> The frontend and backend currently run independently. The frontend still uses browser `localStorage`, while the backend stores tasks and users in process memory. Restarting the FastAPI server clears both collections. The backend now verifies bearer tokens and protects all task routes plus `/users/me`; legacy ID-based user routes still require authorization hardening.

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
- Generic `401 Unauthorized` responses for invalid login credentials
- Signed JWT access tokens using PyJWT and HS256
- Access-token claims for subject, issued time, expiration, and token type
- Configurable JWT secret, algorithm, and expiration through environment variables
- Password-free responses for registration and successful login
- Reproducible direct and pinned backend dependency manifests
- Incoming JWT signature, expiry, subject, and access-token type validation
- Bearer-token extraction with FastAPI's `HTTPBearer`
- A current-user dependency that resolves token subjects against stored users
- Protected `GET`, `PATCH`, and `DELETE` operations at `/users/me`
- Authentication on every task route
- Server-assigned `userId` ownership on task creation
- Owner-filtered task listing and ownership checks for single-task operations

The backend is currently intended for independent API development and manual testing with Postman. It is not yet consumed by the React application. Remaining priorities include hardening legacy user routes, completing deletion/ownership policies, automated regression coverage, and database persistence.

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
| [PyJWT](https://pyjwt.readthedocs.io/) | Signed JWT access-token creation and validation |
| [`python-dotenv`](https://pypi.org/project/python-dotenv/) | Local environment configuration |
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
│   │   ├── config.py               # JWT environment configuration
│   │   └── security.py             # Password hashing, token handling, and current user
│   ├── models/
│   │   ├── loginModels.py          # Login and token response models
│   │   ├── models.py               # Pydantic task models
│   │   └── userModels.py           # Public and internal user models
│   ├── services/
│   │   ├── authService.py          # Credential verification and JWT issuance
│   │   ├── taskService.py          # In-memory task operations
│   │   └── userService.py          # In-memory user operations
│   ├── inMemoryTasks.py            # Temporary task collection
│   ├── inMemoryUsers.py            # Temporary user collection
│   ├── requirements.in             # Direct backend dependencies
│   ├── requirements.txt            # Pinned backend dependencies
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

From the repository root, create a virtual environment and install the pinned backend dependencies:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

Create a root-level `.env` file with the required JWT settings before starting the API:

```dotenv
JWT_SECRET=<strong-random-development-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

The real `.env` file is ignored by Git. Never commit the JWT secret.

Start the development server:

```bash
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

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/tasks/` | Bearer | `200 OK` | Retrieve the current user's tasks |
| `POST` | `/tasks/` | Bearer | `201 Created` | Create a task owned by the current user |
| `GET` | `/tasks/{task_id}` | Bearer | `200 OK` | Retrieve an owned task |
| `PATCH` | `/tasks/{task_id}` | Bearer | `200 OK` | Edit or move an owned task |
| `DELETE` | `/tasks/{task_id}` | Bearer | `204 No Content` | Delete an owned task |

Missing or invalid authentication returns `401 Unauthorized`. Unknown task IDs return `404 Not Found`, while attempts to access a task owned by another user currently return `403 Forbidden`.

### Users

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| `GET` | `/users/` | Public legacy route | `200 OK` | Retrieve public user records |
| `POST` | `/users/` | Public | `201 Created` | Create an account |
| `GET` | `/users/me` | Bearer | `200 OK` | Retrieve the current user |
| `PATCH` | `/users/me` | Bearer | `200 OK` | Update the current user's profile |
| `DELETE` | `/users/me` | Bearer | `204 No Content` | Delete the current user |
| `GET` | `/users/{user_id}` | Public legacy route | `200 OK` | Retrieve one user |
| `PATCH` | `/users/{user_id}` | Public legacy route | `200 OK` | Update a user's profile |
| `DELETE` | `/users/{user_id}` | Public legacy route | `204 No Content` | Delete a user |

Registration accepts a username, email address, and password. Passwords are hashed before storage and must never appear—either as plaintext or hashes—in public API responses. The ID-based user routes remain legacy public routes and are scheduled for authorization hardening; prefer the bearer-protected `/users/me` routes.

### Authentication

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | `200 OK` | Verify credentials and issue a JWT access token |

Successful login returns a signed bearer token and public user information:

```json
{
  "message": "login successful",
  "token": {
    "access_token": "<signed-jwt>",
    "token_type": "bearer"
  },
  "data": {
    "id": "<user-id>",
    "username": "<username>",
    "email": "<normalized-email>",
    "createdAt": "<timestamp>"
  }
}
```

The access token contains `sub`, `iat`, `exp`, and `type: "access"` claims and currently expires after 30 minutes. Protected endpoints accept it through:

```http
Authorization: Bearer <access-token>
```

The backend verifies incoming token signatures, expiration when present, subject, and access-token type, then resolves the subject to the current in-memory user. Server-side sessions, refresh tokens, logout, revocation, issuer/audience checks, and explicit required-claim enforcement are not implemented yet.

### Task Data Shape

A created task resembles:

```json
{
  "taskName": "Build the task API",
  "description": "Implement and test CRUD operations",
  "id": "3156dedf-5fc4-45bb-9a73-52b2882a2d7e",
  "status": "To Do",
  "createdAt": "2026-08-19T08:26:25.057339+00:00",
  "userId": "62762ce5-b5d1-4ad4-8d27-3d60ba085a16"
}
```

The server owns the `id`, initial status, creation timestamp, and `userId`. Ownership is derived from the authenticated user rather than accepted from the task-creation body. A partial update can change the name, description, or status, but not ownership:

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

A basic authenticated task lifecycle is:

1. `POST /users/` to register a user.
2. `POST /auth/login` to obtain an access token.
3. Set `Authorization: Bearer <access-token>` on protected requests.
4. `GET /users/me` to verify the token resolves to the expected user.
5. `POST /tasks/` to create a task owned by that user.
6. `GET /tasks/` to verify the owner-filtered collection.
7. `GET /tasks/{task_id}` to retrieve the owned task.
8. `PATCH /tasks/{task_id}` to edit it or change its column.
9. `DELETE /tasks/{task_id}` to remove it.
10. Repeat the GET-by-ID request and expect `404 Not Found`.

Create a second user and token to verify that task collections remain isolated and foreign-owned task operations are rejected. Because storage is currently in memory, restarting Uvicorn resets both users and tasks.

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
JWT verification and current-user dependency
    ↓
Task, user, and authentication services
    ↓
In-memory task and user dictionaries
```

Backend task and user data survive multiple requests while the server process remains active, but both collections are lost when the server restarts. Account creation hashes passwords before storage; login verifies a supplied password and issues a signed, expiring JWT access token. Protected task operations use the authenticated user's ID to enforce ownership.

## User and Task Ownership

The in-memory backend now models a one-to-many relationship:

```text
One User ───── owns ───── Many Tasks
Each Task ─── belongs to ─── One User
```

Implemented ownership behavior includes:

- A required `userId` on every saved task
- Server-assigned ownership from the authenticated JWT subject
- Owner-filtered task collection responses
- Ownership checks before retrieving, updating, or deleting a task
- Immutable ownership through the task update contract

Cross-user task access currently returns `403 Forbidden`. Multi-user authorization regression testing and a deliberate policy for deleting users who still own tasks remain pending. User deletion currently removes the user record without cascading or reassigning owned in-memory tasks.

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
- [x] Add direct and pinned backend dependency manifests
- [x] Define user schemas and implement in-memory user CRUD
- [x] Hash passwords before storing user accounts
- [x] Add email-and-password login credential verification
- [x] Normalize login email and standardize authentication failures
- [x] Issue signed, expiring JWT access tokens
- [x] Load JWT configuration from environment variables
- [x] Decode and validate access tokens from bearer headers
- [x] Add a current-user authentication dependency
- [x] Add protected `/users/me` profile routes
- [x] Protect every task route with the authenticated-user dependency
- [x] Add required one-to-many task ownership and owner-scoped operations
- [ ] Protect or remove legacy ID-based user routes
- [ ] Complete multi-user authorization regression testing
- [ ] Define and enforce account-deletion behavior for owned tasks
- [ ] Add backend persistence with PostgreSQL and Alembic
- [ ] Add automated frontend and backend tests
- [ ] Configure CORS and an API base URL
- [ ] Connect the React frontend to FastAPI
- [ ] Add deployment and continuous-integration configuration

## Current Limitations

- The frontend is not connected to the backend.
- Frontend and backend currently maintain separate task collections.
- Backend data is lost whenever the server restarts.
- Login issues access tokens, but refresh-token flow, logout, and token revocation are not implemented.
- Legacy ID-based user routes remain public and require authorization hardening.
- User deletion does not yet cascade or reassign owned in-memory tasks.
- PostgreSQL persistence and Alembic migrations have not been added.
- Automated multi-user authorization tests have not been added.
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