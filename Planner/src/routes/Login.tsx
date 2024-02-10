import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { AuthResponse, AuthResponseError } from "../types/types";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;
    
      if (name === "email") {
        setEmail(value);
      }
      
      if (name === "password") {
        setPassword(value);
      }
    }
    
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      // auth.setIsAuthenticated(true);
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const json = (await response.json()) as AuthResponse;
          console.log(json);
  
          if (json.body.accessToken && json.body.refreshToken) {
            auth.saveUser(json);
          }
        } else {
          const json = (await response.json()) as AuthResponseError;
  
          setErrorResponse(json.body.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (auth.isAuthenticated) {
      return <Navigate to="/dashboard" />;
    }
    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Iniciar Sesión</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>Correo</label>
                <input type="text" name="email" value={email} onChange={handleChange} />
                <label>Contraseña</label>
                <input type="password" name="password" value={password} onChange={handleChange} />


                <button>Login</button>
            </form>;
        </DefaultLayout>
    );
}