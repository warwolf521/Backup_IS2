import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Next } from 'react-bootstrap/esm/PageItem';

export const fetchCache = 'force-no-store'
// Endpoint listo

// Ingresa un nuevo ejercicio a la rutina

export async function GET( request ) {
  const searchParams = request.nextUrl.searchParams;
  const set = searchParams.get('set') as string;
  const id_ejercicio = searchParams.get('id_ejercicio') as string;
  const cantidad = searchParams.get('cantidad') as string;

  if (!id_ejercicio || !set || !cantidad) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  if (cantidad.trim() === '' || isNaN(parseInt(cantidad)) || parseInt(cantidad) <= 0) {
    return NextResponse.json({ message: 'Cantidad must be a positive integer' }, { status: 400 });
  }

  const existingTuple = await sql`
  SELECT * FROM tiene
  WHERE id_serie = ${set} AND id_ejercicio = ${id_ejercicio}
`;

  if (existingTuple.rows.length > 0) {
    return NextResponse.json({ message: 'Tuple already exists' }, { status: 409 });
  }

  try {
    await sql`
      INSERT INTO tiene (id_serie, id_ejercicio, cantidad)
      VALUES (${set}, ${id_ejercicio}, ${cantidad});
    `;
    return NextResponse.json({ message: 'Tuple created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to insert tuple:', error);
    return NextResponse.json({ message: 'Failed to create tuple' }, { status: 500 });
  }
}