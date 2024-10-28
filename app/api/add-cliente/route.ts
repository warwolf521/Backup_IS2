import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';

// Endpoint listo

// Ingresa un nuevo cliente a la tabla cliente, y se crea el hito 0  
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const rut_cliente = searchParams.get('rut_cliente') as string;
  const nombre = searchParams.get('nombre') as string;
  const apellidos = searchParams.get('apellidos') as string;
  const masa = searchParams.get('masa') as string;
  const estatura = searchParams.get('estatura') as string;
  const edad = searchParams.get('edad') as string;
  const objetivo = searchParams.get('objetivo') as string;

  // Validate input
  if (!rut_cliente || !nombre || !apellidos || !masa || !estatura || !edad || !objetivo) {
    return NextResponse.json({ message: 'Missing required fields' }, {status: 401});
  }

  try {
    // Query 1: Check if user exists
    const user = await sql`
        SELECT * FROM cliente WHERE rut_cliente = ${rut_cliente};
    `;
  
    if (user.rows.length > 0) {
      return NextResponse.json({ error: 'Ya existe el cliente' }, {status: 400});
    }
  } catch (error) {
    console.error('Error checking if user exists:', error);
    // Handle error
  }
  
  try {
    // Query 2: Insert cliente into cliente table
    await sql`
      INSERT INTO cliente (rut_cliente, nombre, apellidos)
        VALUES (${rut_cliente}, ${nombre}, ${apellidos})
        returning *;
    `;
  } catch (error) {
    console.error('Error inserting into cliente table:', error);
    // Handle error
  }
  
  try {
    // Query 3: Crear tupla en tabla hitos
    const userOk = await sql`
      SELECT * FROM cliente WHERE rut_cliente = ${rut_cliente};
    `;
    if (userOk.rows.length == 0) {
      return NextResponse.json({ error: 'No se pudo crear el cliente' }, {status: 400});
    }

    const b = await sql`
      INSERT INTO hitos (rut_cliente, masa, estatura, edad, objetivo)
        VALUES (${rut_cliente}, ${masa}, ${estatura}, ${edad}, ${objetivo})
        returning *;
    `;
    if (b.rows.length == 0) {
      await sql`
        DELETE FROM cliente WHERE rut_cliente = ${rut_cliente};
      `;
      return NextResponse.json({ error: 'No se pudo crear el hito' }, {status: 400});
    }
  } catch (error) {
    console.error('Error creating hito:', error);
    // Handle error
  }
  
  return NextResponse.json({ message: 'Tupla creada' }, {status: 201});
}