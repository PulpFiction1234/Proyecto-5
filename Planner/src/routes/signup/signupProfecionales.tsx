import { useState, ChangeEvent } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAuth } from "../../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthResponse, AuthResponseError } from "../../types/types";
import '../../css/Signup.css'

export default function Signup() {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+56 9 ");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
      e.preventDefault();
      console.log(name, lastname, birthdate, gender, email, phone, password);
  
      try {
        const response = await fetch("http://localhost:5000/api/signup/signupProfecionales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, lastname, birthdate, gender, email, phone, password }),
        });
        if (response.ok) {
          const json = (await response.json()) as AuthResponse;
          console.log(json);
          setName("");
          setLastname("");
          setBirthdate("");
          setGender("");
          setEmail("");
          setPhone("+56 9 ");
          setPassword("");
          goTo("/");
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
    
    const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setGender(e.target.value);
    };
  
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.startsWith('+56 9 ') && e.target.value.replace(/\D/g, '').length <= 11) {
          setPhone(e.target.value);
        }
      };
    
      const handleFocus = () => {
        if (!phone) {
          setPhone('+56 9 ');
        }
      };
      
      

    return ( 
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="signup-h1">Registro</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>Nombre</label>
                <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Apellido</label>
                <input className="input" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                <label>Fecha de Nacimiento</label>
                <input  className="input2" type="date" min="1900-01-01" max="2024-01-08" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

                <label htmlFor="gender">Género</label>
                    <select className="input2" id="gender" name="gender" value={gender} onChange={handleGenderChange} required>
                        <option value="" disabled hidden>Seleccione su género</option>
                        <option value="female">Femenino</option>
                        <option value="male">Masculino</option>
                        <option value="prefer_not_specify">Prefiero no especificar</option>
                    </select>

                <label>Correo</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label>Telefono</label>
                <input className="input2" type="tel" value={phone} onChange={handlePhoneChange}  onFocus={handleFocus} />

                <label>Contraseña</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="signup-button">Registrarse</button>
            </form>;
        </DefaultLayout>
    );
}