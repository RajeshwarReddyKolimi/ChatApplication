import { io } from "socket.io-client";
import backendURL from "./backendURL";

const URL = backendURL;

export const socket = io(URL, { autoConnect: false });
