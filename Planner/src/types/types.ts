export interface AuthResponse {
  body: {
    rol: string;
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
export interface AuthResponseError {
  body: {
    error: string;
  };
}

export interface User {
  _id: string;
  name: string; 
  lastname: string; 
  email: string;
  phone:string;
  birthdate:string;
  profileImage: string;
  rol: string;
}

export interface AccessTokenResponse {
  statusCode: number;
  body: {
    accessToken: string;
  };
  error?: string;
}

export interface Horario {  
  fecha: Date; 
  horaInicio: string;
  horaFin: string;
  reservado: boolean; 
  usuarioReserva?: User;
}