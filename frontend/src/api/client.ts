import axios from "axios";
import type { AxiosInstance} from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'


export const api: AxiosInstance = 
axios.create({
    baseURL: API_BASE_URL,
    timeout:5000,
    headers:{
        'Content-Type': 'application/json'
    }
})




