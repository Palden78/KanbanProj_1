
import { api } from "./client";

import { type LoginResponse, type LoginCredentials } from "../types";


export const loginRequest = async (cred:LoginCredentials) =>{
    const res = await api.post<LoginResponse>(
        "/auth/login",
        cred
    )
    return res.data
}