import { api } from "./client";
import { type AuthUserTask } from "../types";

export const getAllTasks = async (token:string)=>{
    const res = await api.get<AuthUserTask[]>(
        "/tasks/",{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data
}