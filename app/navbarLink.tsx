import React from 'react';

const NavLinks = ({ role }) => {
  if (!role) {
    console.log("No hay rol definido");
    return null;
  }

  console.log("Prueba de navbar", role);

  switch (role) {
    case 'admin':
      return (
        <>
          <a className="nav-item nav-link mx-4" href="/">Inicio</a>
          <a className="nav-item nav-link mx-4" href="/create_user">Crear Usuario</a>
          <a className="nav-item nav-link mx-4" href="/ver_entrenadores">Ver Entrenadores</a>
          <a className="nav-item nav-link mx-4" href="/create_cliente">Crear Cliente</a>
        </>
      );
    case 'trainer':
      return (
        <>
          <a className="nav-item nav-link mx-4" href="/">Inicio</a>
          <a className="nav-item nav-link mx-4" href="/create_rutina">Crear Rutinas</a>
          <a className="nav-item nav-link mx-4" href="/edit_rutina2">Editar Rutinas</a>
          <a className="nav-item nav-link mx-4" href="/historial">Historial</a>
        </>
      );
    default:
      return (
        <>
          <a className="nav-item nav-link mx-4" href="/">Inicio</a>
        
        </>
      );
  }
};

export default NavLinks;
