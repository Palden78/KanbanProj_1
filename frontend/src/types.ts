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

export type LoginCredentials = {
    email: string;
    password:string;
}

export type TokenResponse ={
    access_token: string;
    token_type: string;
}

export type PublicUser = {
    id: string;
    username: string;
    email: string;
    createdAt: string
}

export type LoginResponse = {
    message: string;
    token: TokenResponse;
    user: PublicUser
}