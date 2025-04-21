import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import BooksPage from "@/pages/BooksPage";
import AuthLayout from "./layouts/AuthLayout";
import CreateUpdateBook from "./pages/CreateUpdateBook";


const router = createBrowserRouter([
  {
   path: '/',
   element: <Navigate to="/dashboard/home" />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout/>,
    children: [
      {
        path: 'home',
        element: <HomePage/>,
      },
       {
        path: 'books',
        element: <BooksPage/>,
      },
      {
        // Define a route with an optional 'id' parameter
        path: 'books/create/:id',
        element: <CreateUpdateBook/>,
      },
      {
        // Keep this for the base create route (no ID)
        path: 'books/create',
        element: <CreateUpdateBook/>,
      },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout/>,
    children: [
      {
        path: 'login',
        element: <LoginPage/>,
      },
      {
          path: 'register',
          element: <RegisterPage/>,
        
      }
    ]
  },
 
]);

export default router;