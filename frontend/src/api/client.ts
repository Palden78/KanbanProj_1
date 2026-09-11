import axios from "axios";
import type { AxiosInstance} from "axios";
import.meta.env.VITE_API_BASE_URL


export const api: AxiosInstance = 
axios.create({
    baseURL:"http://localhost:8000",
    timeout:5000,
})




