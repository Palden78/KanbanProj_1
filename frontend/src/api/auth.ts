
import { api } from "./client";

import { type LoginResponse, type LoginCredentials, type PublicUser } from "../types";


export const loginRequest = async (cred:LoginCredentials) =>{
    const res = await api.post<LoginResponse>(
        "/auth/login",
        cred
    )
    return res.data
}

export const getCurrUser = async (token:string)=>{
    const res = await api.get<PublicUser>(
        "/users/me",{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
    )
    return res.data
}