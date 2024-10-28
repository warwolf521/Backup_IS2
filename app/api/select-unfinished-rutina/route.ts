import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const fetchCache = 'force-no-store'

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rut_cliente = searchParams.get('rut_cliente');
    const { rows: rutinasRows } = await sql`
    SELECT * FROM rutina 
    WHERE rut_cliente = ${rut_cliente} 
      AND timestamp_final IS NULL
    ORDER BY id_rutina DESC 
    LIMIT 1;
  `;
    if (rutinasRows.length === 0) {
      return NextResponse.json({ error: 'No existen rutinas sin timestamp_final!!' }, { status: 400 });
    }

    const rutinasWithAllData = await Promise.all(rutinasRows.map(async (rutina) => {
      const { rows: serieRows } = await sql`SELECT * FROM serie WHERE id_rutina = ${rutina.id_rutina}`;

      const serieWithAdditionalData = await Promise.all(serieRows.map(async (serie) => {
        const { rows: tieneRows } = await sql`SELECT * FROM tiene WHERE id_serie = ${serie.id_serie}`;

        const tieneWithAdditionalData = await Promise.all(tieneRows.map(async (tiene) => {
          const { rows: ejercicioRows } = await sql`SELECT * FROM ejercicio WHERE id_ejercicio = ${tiene.id_ejercicio}`;
          return { ...tiene, ejercicioRows };
        }));

        return { ...serie, tiene: tieneWithAdditionalData };
      }));

      return { ...rutina, serie: serieWithAdditionalData };
    }));

    const { rows: allEjercicioRows } = await sql`SELECT * FROM ejercicio`;

    return NextResponse.json({ rutinasWithAllData, allEjercicioRows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}