import axios from "axios";
import { LoginParams, RegisterNewUserParams } from "../@util/types/auth.type";

const API_URL = import.meta.env.VITE_SERVER_URL;

const axiosClient = axios.create({ baseURL: API_URL });

// Setup later ( limit domain to pass the CORS)
// const config: AxiosRequestConfig = { withCredentials: true };

export const registerNewUser = (data: RegisterNewUserParams) =>
  axiosClient.post(`/auth/register`, data);

export const loginUser = (data: LoginParams) =>
  axiosClient.post(`/auth/login`, data);
