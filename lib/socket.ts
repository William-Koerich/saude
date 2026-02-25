"use client";

import { io } from "socket.io-client";
import { UNIDADE_ID } from "./api";

export const socket = io("http://localhost:3010", {
  query: {
    unidade: UNIDADE_ID,
  },
});