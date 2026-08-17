# Kanban Task Board

A responsive full-stack Kanban project for organizing tasks across **To Do**, **In Progress**, and **Done**. The React frontend is functional and persists tasks in the browser, while an independent FastAPI backend is currently being developed and tested before integration.

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
| Drag and drop | Functional for moving tasks between columns |
| FastAPI backend | Initial development |
| Frontend/backend integration | Not started |
| Automated testing | Not implemented |

> [!IMPORTANT]
> The frontend and backend currently run as independent applications. Kanban tasks are still managed entirely by the frontend; the FastAPI service does not yet provide task CRUD operations or database persistence.

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

## Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | Component-based user interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and shared task models |
| [Vite](https://vite.dev/) | Development server and production builds |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive, utility-first styling |
| [ESLint](https://eslint.org/) | Code-quality checks |

### Backend

| Technology | Purpose |
| --- | --- |
| [FastAPI](https://fastapi.tiangolo.com/) | HTTP API framework |
| [Pydantic](https://docs.pydantic.dev/) | Request and response validation |
| [Uvicorn](https://www.uvicorn.org/) | ASGI development server |
| Python | Backend runtime |

## Project Structure

```text
KanbanProj_1/
├── frontend/
│   ├── public/                  # Static public assets
│   ├── src/
│   │   ├── assets/              # Image and SVG assets
│   │   ├── components/
│   │   │   ├── InputForm.tsx    # Task creation form
│   │   │   └── board.tsx        # Columns, cards, controls, and drag/drop
│   │   ├── App.tsx              # Task operations and local persistence
│   │   ├── index.css            # Tailwind CSS entry point
│   │   ├── main.tsx             # React application entry point
│   │   └── types.ts             # Shared frontend task types
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── controllers/
│   │   └── controllers.py       # Planned API controller layer
│   ├── models/
│   │   └── models.py            # Planned task model layer
│   └── main.py                  # FastAPI application entry point
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.13 or newer
- npm
- Python with virtual-environment support—the backend is currently developed with Python 3.14

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

The backend dependency manifest has not been added yet, so the following is a provisional development setup.

From the repository root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install "fastapi[standard]"
fastapi dev main.py
```

Alternatively, start the application directly with Uvicorn:

```bash
python -m uvicorn main:app --reload
```

The API normally runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

FastAPI also provides generated documentation:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- OpenAPI schema: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

### Current API

The backend currently provides only a smoke-test endpoint:

| Method | Endpoint | Response |
| --- | --- | --- |
| `GET` | `/` | `{"Hello":"World"}` |

Example Postman request:

```text
GET http://127.0.0.1:8000/
```

Task creation, retrieval, updates, movement, deletion, and database storage have not yet been implemented in the API.

## Current Data Flow

```text
User action
    ↓
React state
    ↓
Browser localStorage
```

The frontend reads tasks from the `tasks` storage key when it starts and writes the complete task list whenever state changes.

This means task data:

- Survives page reloads and browser restarts
- Remains limited to the same browser profile and origin
- Is removed when the site's browser storage is cleared
- Is not synchronized between users, browsers, or devices

## Planned API Contract

The backend is expected to manage tasks with this general response shape:

```json
{
  "id": "generated-uuid",
  "taskName": "Build the task API",
  "description": "Implement and test CRUD operations",
  "status": "To Do",
  "createdAt": "2026-08-17T14:30:00Z"
}
```

Planned task endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/tasks` | Retrieve all tasks |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks/{task_id}` | Retrieve one task |
| `PATCH` | `/tasks/{task_id}` | Edit or move a task |
| `DELETE` | `/tasks/{task_id}` | Delete a task |

These routes are part of the roadmap and are **not implemented yet**.

## Roadmap

- [x] Build the responsive Kanban interface
- [x] Add task creation, editing, deletion, and button-based movement
- [x] Add task timestamps
- [x] Add browser persistence
- [x] Add cross-column drag and drop
- [x] Initialize the FastAPI service
- [ ] Add a reproducible backend dependency manifest
- [ ] Define validated Pydantic task schemas
- [ ] Implement and test task CRUD endpoints
- [ ] Add backend persistence with a database
- [ ] Add automated frontend and backend tests
- [ ] Configure CORS and an API base URL
- [ ] Connect the React frontend to FastAPI
- [ ] Add deployment and continuous-integration configuration

## Current Limitations

- The backend is not connected to the frontend.
- The backend does not yet manage or persist tasks.
- No authentication, accounts, or collaborative boards are available.
- Drag and drop does not support touch reliably or reorder tasks within a column.
- Search, filters, priorities, labels, and due dates are not implemented.
- Deletion has no confirmation or undo action.
- There are no automated tests or deployment configuration.

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request explaining what changed.
