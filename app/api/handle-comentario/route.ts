import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';

export async function POST( request: Request ) {
  const data = await request.json();
  const comentario = data.comentario;
  const id_rutina = data.id_rutina;

  console.log(comentario);

  try {
    await sql`
      UPDATE rutina
      SET comentario = ${comentario}
      WHERE id_rutina = ${id_rutina};
    `;
    return NextResponse.json({ message: 'comentario actualizado' }, { status: 201 });
  } catch (error) {
    console.error('Failed to change comentario:', error);
    return NextResponse.json({ message: 'Failed to change comentario' }, { status: 500 });
  }
}