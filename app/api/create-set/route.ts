import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Next } from 'react-bootstrap/esm/PageItem';

export const fetchCache = 'force-no-store'

// Endpoint listo

// Ingresa un nuevo ejercicio a la rutina

export async function GET( request ) {
  const searchParams = request.nextUrl.searchParams;
  const id_rutina = searchParams.get('id_rutina') as string;
  const cantidad = searchParams.get('cantidad') as string;

  if (!id_rutina || !cantidad) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO serie (id_rutina, cantidad)
      VALUES (${id_rutina}, ${cantidad});
    `;
    return NextResponse.json({ message: 'Tuple created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to insert tuple:', error);
    return NextResponse.json({ message: 'Failed to create tuple' }, { status: 500 });
  }
}