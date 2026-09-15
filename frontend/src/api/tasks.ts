import { api } from "./client";
import { type AuthUserTask, type TaskDraft } from "../types";

export const getAllTasks = async (token:string)=>{
    const res = await api.get<AuthUserTask[]>(
        "/tasks/",
        {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data
}

export const addTask = async(token:string, taskData: TaskDraft) =>{
    const res = await api.post("/tasks/",
        taskData,
    {
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
    return res.data 
}