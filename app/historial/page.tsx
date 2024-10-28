'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert } from 'react-bootstrap';

function Rutinas() {
  const [items, setItems] = useState<any[]>([]);
  const [hito, setHito] = useState<any | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const rutCliente = searchParams?.get('rut_cliente');

  useEffect(() => {
    if (rutCliente) {
      fetchItems(rutCliente);
      fetchHito(rutCliente);
    }
  }, [rutCliente]);

  const fetchItems = (rut_cliente: string) => {
    fetch(`/api/fetch-rutinas?rut_cliente=${rut_cliente}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching rutinas:', data.error);
          setConfirmationMessage(data.error);
        } else {
          if (Array.isArray(data.rutinasWithAllData)) {
            setItems(data.rutinasWithAllData);
          } else {
            console.error('Expected an array for items, received:', data);
            setItems([]);
          }
        }
      })
      .catch(error => console.error('Error fetching items:', error));
  };

  const fetchHito = (rut_cliente: string) => {
    fetch(`/api/fetch-info-cliente?rut_cliente=${rut_cliente}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching hito:', data.error);
        } else {
          setHito(data.rows[0]);
        }
      })
      .catch(error => console.error('Error fetching hito:', error));
  };

  return (
    <div  style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', minWidth: '100vw', boxSizing:'border-box'}}>
      {confirmationMessage && <Alert variant="danger">{confirmationMessage}</Alert>}
      <div>
        <h1 style={{ fontSize: '4rem', color: '#f9f4f5', textAlign: 'center', position: 'relative', top: '10px' }}>Último Hito del Cliente</h1>
        {hito ? (
          <div style={{ fontSize: '1.2rem', color: '#f9f4f5', textAlign: 'center', position: 'relative', display: 'flex', gap: '20px', alignItems: 'center', top: '5px', justifyContent: 'center'   }}>
            <p style={{textAlign: 'center', position: 'relative'}}><b>RUT Cliente:</b> {hito.rut_cliente}</p>
            <p style={{textAlign: 'center', position: 'relative'}}><b>Masa:</b> {hito.masa} kg</p>
            <p style={{textAlign: 'center', position: 'relative'}}><b>Estatura:</b> {hito.estatura} cm</p>
            <p style={{textAlign: 'center', position: 'relative'}}><b>Edad:</b> {hito.edad} años</p>
            <p style={{textAlign: 'center', position: 'relative'}}><b>Objetivo:</b> {hito.objetivo}</p>
          </div>
        ) : (
          <div>Cargando...</div>
        )}
      </div>
      <div style={{ display: 'grid', gap: '1%', gridTemplateColumns: '45.5% 45.5%', margin: '1%',  }}>
        {items.map((rutina, rutinaIndex) => (
          <div style={{ outline: 'solid', borderRadius: '10px', backgroundColor:'#212529', color:'#f9f4f5'}} key={rutinaIndex}>
            <p style={{ marginLeft: '10px', fontSize: '1.1rem', color:'#f9f4f5', marginRight:'2rem', marginTop:'1.1rem', marginBottom:'1.1rem' }}>{`Inicio: ${rutina.timestamp_inicio}, Fin: ${rutina.timestamp_final}`}</p>
            <div style={{ display: 'grid', gap: '1%', gridTemplateColumns: '49% 49%', gridTemplateRows: '1fr 1fr', overflowX: 'auto', margin: '1%', backgroundColor:'#212529' }}>
              {rutina.serie.map((serie, serieIndex) => (
                <div key={serieIndex}  >
                  <h6 style= {{fontSize: '1.1rem', color:'#f9f4f5'}}>Serie Nº{serieIndex} &nbsp; Repeticiones: {serie.cantidad}</h6>
                  <table className="table table-hover table-dark">
                    <thead>
                      <tr>
                        <th scope="col">Ejercicio</th>
                        <th scope="col">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serie.tiene.map((tiene, tieneIndex) => (
                        <tr key={tieneIndex}>
                          <td>{tiene.ejercicioRows[0].nombre}</td>
                          <td>{tiene.cantidad} {tiene.ejercicioRows[0].unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rutinas;
