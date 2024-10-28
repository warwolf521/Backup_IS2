import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ClientLayout from './clientLayout';
import { getToken } from 'next-auth/jwt';
import Logout from "./logout";
import Link from 'next/link';
import React from 'react';
import NavLinks from './navbarLink';
import { cookies } from 'next/headers'; // Importa las cookies del objeto de request

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookie = cookies();
  const token = await getToken({ req: {cookies : cookie} }); // Suplente de la request
  const userRole = token?.role;
  console.log("UserRole:", userRole);

  return (
    <html lang="es">
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#502F4C' }}>
          <div className="navbar-brand mb-0 h1 mx-3">
            <i className="bi bi-bicycle" style={{ fontSize: '2rem' }}></i>
          </div>
          <a className="navbar-brand mb-0 h1" href="/">GymApp</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {userRole && <NavLinks role={userRole} />}
            </div>
          </div>
          {!!token && 
          <button type="button" className="btn btn-outline-light" style={{ marginRight: '1rem' }}>
            <Logout />
          </button>}
          {!token && 
          <button type="button" className="btn btn-outline-light" style={{ marginRight: '1rem' }}>
            <Link href="/login">Iniciar Sesión</Link>
          </button>}
        </nav>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}