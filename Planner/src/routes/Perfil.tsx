import { useAuth } from '../auth/AuthProvider'; // Importa el contexto de autenticación
import AdminPortalLayout from '../layout/AdminPortalLayout';
import UserPortalLayout from '../layout/UserPortalLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faAddressCard } from '@fortawesome/free-solid-svg-icons';
import '../css/Perfil.css'

const Perfil = () => {
    const auth = useAuth(); // Obtiene el contexto de autenticación
    const user = auth.getUser(); // Obtiene los datos del usuario logeado

 return (
    <>
      {user?.rol === 'admin' ? (
        <AdminPortalLayout>
             <div className='div-profile'>
                <div className='content-profile'>
            <div className='div-profile-2'>
                <div className='nombre-perfil-icon'>
                      <FontAwesomeIcon icon={faAddressCard} />
                    <div className='nombre-perfil'>
                    <p><strong>{user?.name}</strong></p>  
                      
                      <p style={{marginLeft: '5px'}}><strong>{user?.lastname}</strong></p>
                    </div>

                </div>
               <div className='info-perfil'>
                <p><strong>Telefono:</strong> {user?.phone}</p>
                <p><strong>Fecha de nacimiento</strong> {user?.birthdate}</p>
                <p><strong>Correo Electrónico:</strong> {user?.email}</p>
                {/* Agrega más campos según sea necesario */}
               </div>
                
            </div>
            {/* Agrega formularios de edición si es necesario */}
                </div>    
        </div>
        </AdminPortalLayout>
      ) : (
        <UserPortalLayout>
                  <div className='div-profile'>
                <div className='content-profile'>
            <div className='div-profile-2'>
                <div className='nombre-perfil-icon'>
                      <FontAwesomeIcon icon={faAddressCard} />
                    <div className='nombre-perfil'>
                    <p><strong>{user?.name}</strong></p>  
                      
                      <p style={{marginLeft: '5px'}}><strong>{user?.lastname}</strong></p>
                    </div>

                </div>
               <div className='info-perfil'>
                <p><strong>Telefono:</strong> {user?.phone}</p>
                <p><strong>Fecha de nacimiento</strong> {user?.birthdate}</p>
                <p><strong>Correo Electrónico:</strong> {user?.email}</p>
                {/* Agrega más campos según sea necesario */}
               </div>
                
            </div>
            {/* Agrega formularios de edición si es necesario */}
                </div>    
        </div>
        </UserPortalLayout>
      )}
    </>
    );
    }
export default Perfil;