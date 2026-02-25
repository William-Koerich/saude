import axios from "axios";

export const UNIDADE_ID = "COLOQUE_AQUI_O_UUID_DA_UNIDADE";

export const api = axios.create({
  baseURL: "http://localhost:3010",
});

api.interceptors.request.use((config) => {
  config.headers["x-unidade-id"] = UNIDADE_ID;
  return config;
});