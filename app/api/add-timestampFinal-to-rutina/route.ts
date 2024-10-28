import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store'
// Endpoint listo

// Añade un timestamp_final a la rutina

export async function POST ( request ) {
  // Assuming you're receiving the id_rutina in the request body or as a query parameter
  const data = await request.json();
  const id_rutina = data.id_rutina;

  try {
    // Update the timestamp_inicio field for the given id_rutina
    const result = await sql`
      UPDATE rutina
      SET timestamp_final = NOW()
      WHERE id_rutina = ${id_rutina}
      RETURNING *;
    `;

    // Check if the update was successful
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Rutina not found' }, { status: 404 });
    }

    // Respond with the updated tuple
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating rutina:', error);
    return NextResponse.json({ message: 'Failed to update rutina' }, { status: 500 });
  }
}