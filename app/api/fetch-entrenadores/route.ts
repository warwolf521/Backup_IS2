import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const fetchCache = 'force-no-store';
// Endpoint listo

// Obtiene todos los entrenadores

export async function GET() {
  try {
    const result = await sql`
      SELECT rut_usuario, nombre, apellidos, estado
      FROM usuario
      WHERE tipo = 'trainer';
    `;
    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'No trainers found' }, {status: 404});
      }
      
      return NextResponse.json({ result }, {status: 200});
    }
    catch (error) {
      console.error('Error fetching trainers:', error);
      return NextResponse.json({ message: 'Failed to fetch trainers' }, {status: 500});

    }  
}   