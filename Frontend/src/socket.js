import { io } from "socket.io-client";

export const socket = io("http://localhost:3000",{
    withCredentials: true ,//This is used only when your backend uses cookies (authentication cookies, session cookies, JWT cookies, etc.).
    // autoConnect: false,
})