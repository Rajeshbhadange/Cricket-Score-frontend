import { io } from "socket.io-client";
const URL = import.meta.env.VITE_REACT_APP_API_URL;
export const socket = io(URL);
