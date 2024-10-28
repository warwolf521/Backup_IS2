import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';

// Endpoint listo

// Ingresa un nuevo entrenador a la tabla usuario

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const rut_usuario = searchParams.get('rut_usuario') as string;
  const nombre = searchParams.get('nombre') as string;
  const apellidos = searchParams.get('apellidos') as string;
  const contraseña = searchParams.get('contraseña') as string;

  if (!rut_usuario || !nombre || !apellidos || !contraseña) {
    return NextResponse.json({ message: 'Missing required fields or contraseña cant be empty' }, {status: 401});
  }

  try {
    const user = await sql`
        SELECT "estado" FROM usuario WHERE rut_usuario = ${rut_usuario};
    `;

    if (user.rows.length > 0) {
        const estado = user.rows[0].estado;
        if (estado === 'inactivo') {
            return NextResponse.json({ error: 'User is inactive' }, {status: 400});
        } else {
            return NextResponse.json({ error: 'User already exists' }, {status: 400});
        }
    }
    await sql`
      INSERT INTO usuario (rut_usuario, nombre, apellidos, tipo, contraseña, estado)
        VALUES (${rut_usuario}, ${nombre}, ${apellidos}, 'trainer', ${contraseña}, 'activo');
    `;

    return NextResponse.json({ message: 'Tuple creada' }, {status: 201});
  } catch (error) {
    console.error('Failed to insert tuple:', error);
    return NextResponse.json({ error: 'Failed to create tuple' }, {status: 500});
  }
}