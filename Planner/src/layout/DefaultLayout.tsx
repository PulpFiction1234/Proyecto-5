import { Link } from "react-router-dom";
import React from "react";
import '../css/DefaultLayout.css';

interface DefaultLayoutProps {
  children?: React.ReactNode;
}
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
    <header>
        <nav className="main-nav">
          <ul>            
            <li className="li-default">
              <Link to="/">Iniciar Sesion</Link>
            </li>
            <li className="li-default">
              <Link to="/signup/signupProfecionales">Crear Cuenta</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main-content1">{children}</main>
      <footer>
        asd 
      </footer>
    </>
  );
}