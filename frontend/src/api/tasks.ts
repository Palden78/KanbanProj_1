import { api } from "./client";
import { type AuthUserTask, type deleteTaskBody, type SwitchStatusBody, type TaskDraft } from "../types";

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

export const moveTaskByStatus = async(token:string, taskData:SwitchStatusBody, taskID:string ) => {
    const res = await api.patch(`/tasks/${taskID}`,
        taskData, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data 
}

export const editTaskDetails = async(token:string, editTaskDetailsBod:SwitchStatusBody, taskID:string)=>{
    const res = await api.patch(
        `/tasks/${taskID}`,
        editTaskDetailsBod,
        {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data 
}
export const deleteTaskByID = async(token:string, taskIDbod:deleteTaskBody, taskID:string) =>{
    const res = await api.delete(
        `/tasks/${taskID}`,
        {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: taskIDbod
        }
    )
    return res.data
}
