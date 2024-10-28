import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store'

// Endpoint listo

// Crea una nueva rutina para un cliente

export async function GET(request) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const rut_cliente = searchParams.get('rut_cliente');
      const rut_usuario = searchParams.get('rut_usuario');
      const infoCliente = await sql`SELECT * FROM cliente WHERE rut_cliente = ${rut_cliente}`;
      if(infoCliente.rows.length == 0) return NextResponse.json({ error: "Este usuario no existe" }, {status: 404});
      const rutinaAbierta = await sql`SELECT * FROM rutina WHERE rut_cliente = ${rut_cliente} AND timestamp_final IS NULL ORDER BY id_rutina DESC LIMIT 1;`;
      if(rutinaAbierta.rows.length > 0) return NextResponse.json({infoCliente, rutinaAbierta, error: "Este usuario ya tiene una rutina previa con otro entrenador sin finalizar" }, {status: 403});
      const result = await sql`INSERT INTO Rutina (rut_cliente, rut_usuario, timestamp_inicio) VALUES (${rut_cliente}, ${rut_usuario}, NOW()) RETURNING *`
      return NextResponse.json({infoCliente, result}, {status: 200});
      } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: error.message }, {status: 500});
    }
  }