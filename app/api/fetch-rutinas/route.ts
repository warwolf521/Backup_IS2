import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store';
// Endpoint listo

// Obtiene las ultimas 6 rutinas de un cliente

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rut_cliente = searchParams.get('rut_cliente');

    const { rows: rutinasRows } = await sql`SELECT * FROM rutina WHERE rut_cliente = ${rut_cliente} AND timestamp_final IS NOT NULL ORDER BY id_rutina DESC LIMIT 6`;


    if (rutinasRows.length == 0) {
      return NextResponse.json({ error: 'No existen rutinas para este cliente!!' }, {status: 400});
    }

    // Fetch rows from Tiene table and then fetch additional data for each tiene
    const rutinasWithAllData = await Promise.all(rutinasRows.map(async (rutina) => {
      const { rows: serieRows } = await sql`SELECT * FROM serie WHERE id_rutina = ${rutina.id_rutina}`;
      
      // For each tiene, fetch additional data from another table
      const serieWithAdditionalData = await Promise.all(serieRows.map(async (serie) => {
        const { rows: tieneRows } = await sql`SELECT * FROM tiene WHERE id_serie = ${serie.id_serie}`;

        const tieneWithAdditionalData = await Promise.all(tieneRows.map(async (tiene) => {
          const { rows: ejercicioRows } = await sql`SELECT * FROM ejercicio WHERE id_ejercicio = ${tiene.id_ejercicio}`;
          // Combine Tiene data with its additional data
          return { ...tiene, ejercicioRows };
        }));
        // Combine Tiene data with its additional data
        return { ...serie, tiene: tieneWithAdditionalData };
      }));

      // Combine Rutina data with its Tiene data (which now includes additional data)
      return { ...rutina, serie: serieWithAdditionalData };
    }));

    return NextResponse.json({rutinasWithAllData}, {status:200});
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, {status:500});
  }
}