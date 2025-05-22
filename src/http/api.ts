import axios from "axios";
import useTokenStore from "@/store";

const api = axios.create({
  // to do : move this value to env variable
  //baseURL: "https://localhost/elibraryapi",
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

//export const baseFileUrl = "https://squareone.com.ph/elibraryapi/Uploads/";
export const baseFileUrl = "https://localhost/elibraryapi/Uploads/";

export const login = async (data: { email: string; password: string }) =>
  api.get(`/user/login/${data.email}/${data.password}`);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/users/register", data);

export const getBookList = async (status: string) => await api.get(`/book/list/${status}`);

export const getBookbyId = async (book_id: string) => await api.get(`/book/view/${book_id}`); 

export const getBookCategory = async () => await api.get("/book/list_category");

export const getBookCategorybyId = async (book_category_id: string) => await api.get(`/book/view_category/${book_category_id}`);

export const getBookAuthorbyId = async (author_id: string) => await api.get(`/book/view_author/${author_id}`);

export const getBookAuthors = async () => await api.get("/book/list_authors");

export const getBookClasses = async () => await api.get("/book/list_classes");

export const getBookStatus = async () => await api.get("/book/list_status");

export const getBookSubjects = async (class_id: string) => await api.get(`/book/list_subjects/${class_id}`);

export const createBook = async (data: FormData) =>
  
await api.post("/book/save", data, {
    headers: {
      "Content-Type": "multipart/form-data;",
    },
  });

export const createUpdateBookCategory = async (data: FormData) =>

  await api.post("/book/save_category", data, {
      headers: {
        "Content-Type": "application/json",
      },
});

export const createUpdateBookAuthor = async (data: FormData) =>

  await api.post("/book/save_author", data, {
      headers: {
        "Content-Type": "application/json",
      },
});

export const updateBook = async (data: FormData) =>

  await api.post("/book/save", data, {
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
