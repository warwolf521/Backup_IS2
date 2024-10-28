import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Endpoint listo

// Obtiene el último hito de un cliente específico

export const fetchCache = 'force-no-store'

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rut_cliente = searchParams.get('rut_cliente');

    const { rows: hito } = await sql`
      SELECT * FROM hitos WHERE rut_cliente = ${rut_cliente}
      ORDER BY id_hito DESC LIMIT 1
    `;

    return NextResponse.json({ rows: hito }, { status: 200 });
  } catch (error) {
    console.error('Error fetching hito:', error);
    return NextResponse.json({ message: 'Failed to fetch hitos' }, {status: 500});
  }  
}