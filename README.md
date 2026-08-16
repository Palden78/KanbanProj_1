# Kanban Task Board

A clean, responsive Kanban board for organizing tasks across **To Do**, **In Progress**, and **Done**. Built with React, TypeScript, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- Create tasks with a required name and an optional description
- Organize work into three workflow stages:
  - **To Do**
  - **In Progress**
  - **Done**
- Move tasks forward or backward with simple action buttons
- Edit task names and descriptions directly from the board
- Delete tasks that are no longer needed
- View live task counts for each column
- Get clear validation and empty-column messages
- Use the board comfortably across mobile, tablet, and desktop layouts

> [!NOTE]
> Tasks are currently stored in memory. Refreshing or closing the page resets the board.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | Component-based user interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and safer development |
| [Vite](https://vite.dev/) | Development server and production build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling and responsive design |
| [ESLint](https://eslint.org/) | Code-quality and consistency checks |

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) 22.13 or newer
- npm (included with Node.js)

### Installation

1. Clone the repository and open the project directory:

   ```bash
   git clone <your-repository-url>
   cd kanban_proj_1
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed in the terminal, usually [http://localhost:5173](http://localhost:5173).

No environment variables, database, or external services are required.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement |
| `npm run build` | Type-check the project and create an optimized production build |
| `npm run lint` | Check the source code with ESLint |
| `npm run preview` | Serve the production build locally for inspection |

## How It Works

New tasks begin in **To Do** and can move one stage at a time:

```text
To Do  ⇄  In Progress  ⇄  Done
```

Each card provides controls appropriate to its current stage. Movement uses buttons rather than drag and drop, keeping the workflow simple and accessible.

## Project Structure

```text
kanban_proj_1/
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Project image and SVG assets
│   ├── components/
│   │   ├── InputForm.tsx    # Task creation form and validation
│   │   └── board.tsx        # Board columns, cards, and task controls
│   ├── App.tsx              # Main layout and task state management
│   ├── index.css            # Tailwind CSS entry point
│   ├── main.tsx             # React application entry point
│   └── types.ts             # Shared task and status types
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and npm scripts
├── tsconfig.json            # TypeScript project configuration
└── vite.config.ts           # Vite and Tailwind plugin configuration
```

## Current Limitations

This project intentionally keeps its scope focused. It currently does not include:

- Persistent storage or a backend API
- Drag-and-drop task movement
- Search, filtering, priorities, or due dates
- User accounts, authentication, or shared boards
- Automated tests

These areas are natural opportunities for future development.

## Possible Improvements

- Save tasks with local storage or a database
- Add drag-and-drop interactions
- Add task priorities, labels, and due dates
- Support search and filtering
- Add confirmation or undo for task deletion
- Add automated component and end-to-end tests
- Deploy a live demo

## Contributing

Suggestions and improvements are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request describing what you changed.
