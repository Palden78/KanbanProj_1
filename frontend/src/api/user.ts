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

export const deleteUser = async()=>{

}

// export const getCurrUser = async (token:string)=>{
//     const res = await api.get<PublicUser>(
//         "/users/me",{
//             headers:{
//                 'Authorization':`Bearer ${token}`
//             }
//         }
//     )
//     return res.data
// }