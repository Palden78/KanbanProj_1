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

export type RegistrationValues = {
    username: string;
    email: string;
    password: string;
}

export type ProfileFormValues = {
    username: string;
    email: string;
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


export type AuthUserTask = {
    task_name : string;
    description: string;
    created_at: string;
    id: string;
    status: TaskStatus
    user_id: string 
}

export type SwitchStatusBody = {
    taskName: string ;
    description: string;
    status: TaskStatus
}

export type deleteTaskBody ={
    task_id : string;
}