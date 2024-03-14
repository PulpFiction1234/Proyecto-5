import { useState } from "react"; import DefaultLayout from "../layout/DefaultLayout"; import { useAuth } from "../auth/AuthProvider"; import { useNavigate } from "react-router-dom"; import { AuthResponse, AuthResponseError } from "../types/types"; import '../css/login.css';

export default function Login() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [errorResponse, setErrorResponse] = useState(""); const navigate = useNavigate(); // Obtener la función de redireccionamiento

const auth = useAuth();

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
                navigate("/configuraciones"); // Redirigir al usuario después de guardar el usuario
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
    navigate("/configuraciones");
}

return (
    <DefaultLayout>
        <form className="form1" onSubmit={handleSubmit}>
            <h1 className="login-h1">Iniciar Sesión</h1>
            {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
            <label>Correo</label>
            <input className="input" type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Contraseña</label>
            <input className="input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="login-button">Login</button>
        </form>
    </DefaultLayout>
);
}