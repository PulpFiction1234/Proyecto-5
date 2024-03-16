import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.tsx";
import Signup from "./routes/signup/Signup.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import ProtectedRoute from "./routes/patient/ProtectedRoute.tsx";
import "./index.css";
import Configuraciones from "./routes/Configuraciones.tsx";
import Soporte from "./routes/Soporte.tsx";
import { CssBaseline } from '@mui/material';
import CalendarioPaciente from "./components/calendarioPacientes.tsx";
import CalendarioAdmin from "./components/calendarioAdmin.tsx";
import HorariosSemanales from "./routes/HorariosSemanales.tsx";
import Perfil from "./routes/Perfil.tsx";


const router = createBrowserRouter([
  {
    path: "/signup/signupProfecionales",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/calendarioPacientes",
        element: <CalendarioPaciente />,
      },
      {
        path: "/calendarioAdmin",
        element: <CalendarioAdmin/>,
      },
      {
        path: "/Perfil",
        element: <Perfil />,
      },
      {
        path: "/configuraciones",
        element: <Configuraciones />,
      },
      {
        path: "/soporte",
        element: <Soporte/>,
      },
      {
        path: "/pacientes",
        element: <HorariosSemanales />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);  