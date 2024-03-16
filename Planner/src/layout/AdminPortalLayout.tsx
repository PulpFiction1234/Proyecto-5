import { Link } from "react-router-dom";
import React, { MouseEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/authConstants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCalendarAlt, faIdCard, faGear, faCircleQuestion,faDoorOpen  } from '@fortawesome/free-solid-svg-icons';
import '../css/PortalLayout.css';
import logoPlanner from '../img/Planner_1.png';

interface PortalLayoutProps {
  children?: React.ReactNode;
}
export default function AdminPortalLayout({ children }: PortalLayoutProps) {
  const auth = useAuth();

  async function handleSignOut(e: MouseEvent) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });
      if (response.ok) {
        auth.signout();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
    <header >
        <nav className="main-nav">
          <ul>
            <li className="li-logo">
              <img className="img-logo" src={logoPlanner} alt="" />
            </li>
            <li className="li-singout">
              <p className="icon" onClick={handleSignOut}><FontAwesomeIcon icon={faDoorOpen}/>
                <Link className="icon-text" to="" >Salir  </Link>
              </p>
            </li>
          </ul>
        </nav>
        
      </header>
      <div className="main"><div className="sidemenu">
        <p className="icon" ><FontAwesomeIcon icon={faCalendarAlt} /> <Link className="icon-text"  to="/calendarioAdmin">Calendario</Link></p>
        <p className="icon"><FontAwesomeIcon icon={faIdCard} /> <Link className="icon-text" to="/pacientes" >Pacientes</Link>  </p>
        <p className="icon"><FontAwesomeIcon icon={faCalendarAlt} /> <Link className="icon-text" to="/Perfil">Perfil</Link></p>
        <p className="icon-bottom1" ><FontAwesomeIcon icon={faGear} /> <Link className="icon-text" to="/configuraciones" >Configuraciones</Link> </p>
        <p className="icon-bottom"><FontAwesomeIcon icon={faCircleQuestion} /> <Link className="icon-text" to="/soporte" >Soporte</Link></p>
      </div>
      <main className="main-content">{children}</main>
      </div> 
      <footer>
        asd
      </footer>

      
    </>
  );
}