import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL,{
    withCredentials: true ,//This is used only when your backend uses cookies (authentication cookies, session cookies, JWT cookies, etc.).
    // autoConnect: false,
}) 