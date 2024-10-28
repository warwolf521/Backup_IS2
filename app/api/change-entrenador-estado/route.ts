import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
export const fetchCache = 'force-no-store';
// Endpoint listo

// Cambia el estado de un entrenador

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rut_usuario = searchParams.get('rut_usuario') as string;
  
    const currentEstado = await sql`
      SELECT estado
      FROM usuario
      WHERE rut_usuario = ${rut_usuario}
    `;
  
    let result;
  
    if (currentEstado.rows[0].estado === 'activo') {
      result = await sql`
        UPDATE usuario
        SET estado = 'inactivo'
        WHERE rut_usuario = ${rut_usuario}
        RETURNING *;
      `;
    } else if (currentEstado.rows[0].estado === 'inactivo') {
      result = await sql`
        UPDATE usuario
        SET estado = 'activo'
        WHERE rut_usuario = ${rut_usuario}
        RETURNING *;
      `;
    }
  
    if (!result || result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, {status: 404});
    }
  
    return NextResponse.json({ result: result.rows[0] }, {status: 200});
  } catch (error) {
    console.error('Error updating entrenador:', error);
    return NextResponse.json({ message: 'Failed to update entrenador' }, {status: 500});
  }
}