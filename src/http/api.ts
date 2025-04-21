import axios from "axios";
import useTokenStore from "@/store";

const api = axios.create({
  // to do : move this value to env variable
  baseURL: "https://localhost/elibraryapi",
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor is just like a middelware every request pass this middleware
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const baseFileUrl = "https://localhost/elibraryapi/Uploads/";

export const login = async (data: { email: string; password: string }) =>
  api.get(`/user/login/${data.email}/${data.password}`);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/users/register", data);

export const getBookList = async () => api.get(`/book/list/`);

export const getBooks = async (book_id?: string) => api.get(`/book/list/${book_id}`);

export const getBookbyId = async (book_id: string) => api.get(`/book/view/${book_id}`);

export const getBookCategory = async () => api.get("/book/list_category");

export const getBookAuthors = async () => api.get("/book/list_authors");

export const getBookClasses = async () => api.get("/book/list_classes");

export const getBookSubjects = async (class_id: string) => api.get(`/book/list_subjects/${class_id}`);

export const createBook = async (data: FormData) =>
  
await api.post("/book/save", data, {
    headers: {
      "Content-Type": "multipart/form-data;",
    },
  });

export const updateBook = async (data: FormData) =>

  await api.post("/book/save", data, {
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
