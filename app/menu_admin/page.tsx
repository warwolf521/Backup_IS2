'use client';

import React from 'react';
import { Card, Button } from 'react-bootstrap';

function MenuAdmin() {
    return (
        <div style={{
            margin: 0,
            padding: 0,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/fondo-blur.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            minHeight: '100vh', // Ensure it covers the full height of the viewport
            width: '100%'
        }}>
            <h1 style={{ fontSize: '4rem', color: '#f9f4f5', textAlign: 'center', position: 'relative', top: '75px' }}><i className="bi bi-person-fill-gear" style={{ color: '#f9f4f5', marginRight: '0.2rem' }}></i>
            Menu Administrador</h1>
            <div style={{ marginTop: '-10vh' }} className="d-flex align-items-center justify-content-center vh-100 ">
                <Card  bg={'dark'} text={'light'} style={{ width: '18rem', marginRight: '2rem', marginBottom: '2rem' }}>
                    <Card.Img variant="top" src='/images/cliente.jpg' style={{ maxWidth: '100%', maxHeight: '180px' }}/>
                    <Card.Body>
                        <Card.Title>Registrar cliente</Card.Title>
                        <Card.Text>
                        Registra a un cliente en el gimnasio
                        </Card.Text>
                        <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="" size="lg" href={`/create_cliente`}>Registrar cliente</Button>
                    </Card.Body>
                </Card>

                <Card bg={'dark'} text={'light'} style={{ width: '18rem', marginRight: '2rem', marginBottom: '2rem' }}>
                    <Card.Img variant="top" src="/images/trainer.jpg" style={{ maxWidth: '100%', maxHeight: '180px' }} />
                    <Card.Body>
                        <Card.Title>Registrar entrenador</Card.Title>
                        <Card.Text>
                        Registra a un entrenador en el gimnasio
                        </Card.Text>
                        <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="" size="lg" href={`/create_user`}>Registrar entrenador</Button>
                    </Card.Body>
                </Card>

                <Card bg={'dark'} text={'light'} style={{ width: '18rem', marginBottom: '2rem' }}>
                    <Card.Img variant="top" src="/images/trainers.jpg" style={{ maxWidth: '100%', maxHeight: '180px' }} />
                    <Card.Body>
                        <Card.Title>Ver entrenadores</Card.Title>
                        <Card.Text>
                        Revisa a los entrenadores registrados en el gimnasio
                        </Card.Text>
                        <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="" size="lg" href={`/ver_entrenadores`}>Ver entrenadores</Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default MenuAdmin;  