export type TaskDraft = {
    taskName: string;
    description: string;
}

export type SavedTask = TaskDraft & {
    id: string;
    status: "To Do"|"In Progress"|"Done";
    createdAt: string;
}

export type TaskUpdate = Partial<TaskDraft>

export type TaskStatus = "To Do" | "In Progress" | "Done"