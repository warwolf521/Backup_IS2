import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";

export const fetchCache = 'force-no-store'

// Endpoint listo

// Obtiene todos los clientes asociados a un entrenador

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rut_usuario = searchParams.get('rut_usuario') as string;
    const clientesRows = await sql`SELECT r.*, c.nombre, c.apellidos FROM "rutina" AS r JOIN "cliente" AS c ON r.rut_cliente = c.rut_cliente WHERE rut_usuario = (${rut_usuario}) AND r.timestamp_final IS NULL`;
    if(clientesRows.rows.length == 0) return NextResponse.json({ error: "No hay clientes asociados" }, {status: 404});
    return NextResponse.json({clientesRows}, {status: 200});
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, {status: 500});
  }
}