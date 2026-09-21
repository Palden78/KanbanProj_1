import type { ProfileFormValues } from "../types";
import { api } from "./client";

export const updateUserInfo = async(token:string, values: ProfileFormValues)=>{
    const res = await api.patch(
        "/users/me", values,
        {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data
}

export const deleteUser = async(token:string)=>{
    const res = await api.delete(
        '/users/me',
        {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data
}

// export const deleteTaskByID = async(token:string, taskIDbod:deleteTaskBody, taskID:string) =>{
//     const res = await api.delete(
//         `/tasks/${taskID}`,
//         {
//             headers:{
//                 'Authorization':`Bearer ${token}`
//             },
//             data: taskIDbod
//         }
//     )
//     return res.data
// }