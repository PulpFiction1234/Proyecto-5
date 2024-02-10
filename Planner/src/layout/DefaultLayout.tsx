import { Link } from "react-router-dom";
import React from "react";

interface DefaultLayoutProps {
  children?: React.ReactNode;
}
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <header>
        <nav>
          <ul>
            
            <li>
              <Link to="/">Iniciar Session</Link>
            </li>
            <li>
              <Link to="/signup/signupProfecionales">Crear Cuenta</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}