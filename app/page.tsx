'use client';

import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NextRequest } from "next/server";
import React, { use, useEffect, useState, Component } from 'react';
import { Container, Card, Form, Button, Modal, Carousel, Stack, CardGroup } from 'react-bootstrap';

export default function PatientActive(req: NextRequest) {
    const [rutUsuario, setRutUsuario] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [rutCliente, setRutCliente] = useState('')
    const [clientes, setClientes] = useState<any[]>([]);
    const [modalShowAdd, setModalShowAdd] = useState(false);
    const [modalShowMenu, setModalShowMenu] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    useEffect(()=>{
        fetch(`api/getSessionToken`).then(response => response.json()).then(data => {
            setRutUsuario(data);
        })
    }, []);

    const fetchClientes = async () =>{
        let resp;
        fetch(`api/fetchClientesIndex?rut_usuario=${rutUsuario}`)
        .then(response => {
            resp = response;
            return response.json();
          }).then(data => {
          if(resp.ok){
            console.log("hay clientes", data);
            setClientes(data.clientesRows.rows);
          }else{
            console.log("no hay clientes");
            setClientes([]);
          }
        })
    }

    const addCliente = () =>{
        let resp;
        fetch(`/api/addClienteToIndex?rut_cliente=${rutCliente}&rut_usuario=${rutUsuario}`)
        .then(response => {
            resp = response;
            return response.json();
        }).then(data => {
          if(resp.ok){
            console.log(data.result.rows);
            setResultMessage(`Rutina creada exitosamente!: ${JSON.stringify(data.result.rows)}`);
            console.log("success");
            fetchClientes();
          }else{
            setResultMessage(data.error);
            console.log(data.error);
          }
        })
    }

    useEffect(()=>{
        if(rutUsuario != ''){
            fetchClientes();
        }
    }, [rutUsuario]);

    const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
    };

    const showModalAdd = () => {
        setModalShowAdd(true);
    };

    const hideModalAdd = () => {
        setModalShowAdd(false);
        setResultMessage('');
        setRutCliente('');
    }

    const showModalMenu = () => {
        setModalShowMenu(true);
    };

    const hideModalMenu = () => {
        setModalShowMenu(false);
    }

    const ModalMenu = () => {
        let rut_cliente;
        if(clientes.length > 0 && activeIndex < clientes.length){
            rut_cliente = clientes[activeIndex].rut_cliente;
        }else{
            rut_cliente = '';
        }
        return(
            <Modal show={modalShowMenu} onHide={hideModalMenu} centered>
                <Modal.Header closeButton>
                    <Modal.Title><b>Menú</b></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p style={{fontSize: '1.4rem' , marginLeft: '1rem'}}><b>Rut Cliente:</b> {rut_cliente}</p>
                </Modal.Body>
                <CardGroup>
                <Card border="light" text={'dark'} style={{ width: '18rem', marginLeft: '2rem', marginBottom: '2rem' }}>
                    <Card.Img variant="top" src='/images/cliente.jpg' style={{ maxWidth: '100%', maxHeight: '180px' }}/>
                    <Card.Body>
                        <Card.Title>Editar Rutina</Card.Title>
                        <Card.Text>
                        Edita la rutina de un cliente
                        </Card.Text >
                        <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="" size="lg" href={`/edit_rutina2?rut_cliente=${rut_cliente}`}>Editar Rutina</Button>
                    </Card.Body>
                </Card>
                <Card border="light" text={'dark'} style={{ width: '18rem', marginRight: '2rem', marginBottom: '2rem' }}>
                    <Card.Img variant="top" src="/images/trainer.jpg" style={{ maxWidth: '100%', maxHeight: '180px' }} />
                    <Card.Body>
                        <Card.Title>Historial</Card.Title>
                        <Card.Text>
                        Ve el historial de ejercicios de un cliente
                        </Card.Text>
                        <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="" size="lg" href={`/historial?rut_cliente=${rut_cliente}`}>Historial</Button>
                    </Card.Body>
                </Card>
                </CardGroup>
                {/* <Stack direction="horizontal" gap={2} style={{margin: '10px'}}>
                    <Button className='ms-auto' style={{backgroundColor:'#9F87AF', borderColor:'#9F87AF'}} href={`/edit_rutina2?rut_cliente=${rut_cliente}`}>Editar Rutina</Button>
                    <Button variant="primary" style={{backgroundColor:'#9F87AF', borderColor:'#9F87AF'}} href={`/historial?rut_cliente=${rut_cliente}`}>Historial</Button>
                </Stack> */}
            </Modal>
        )
    }

    const PrevIcon = () => (
        <i className="bi bi-arrow-left-circle-fill" style={{color:'#9F87AF', fontSize:'2rem'}}></i>
      );
      
      const NextIcon = () => (
        <i className="bi bi-arrow-right-circle-fill" style={{color:'#9F87AF', fontSize:'2rem'}}></i>
      );

    const CarouselClientes = () => {
        if(clientes.length == 0){
            return(
                <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null} indicators={false} data-bs-theme='dark' prevIcon={<PrevIcon />} nextIcon={<NextIcon />}>
                    <Carousel.Item>
                        <div className="d-flex justify-content-center">
                            <Card
                                bg='light'
                                border='light'
                                text='dark'
                                style={{ width: "18rem", cursor: "pointer"}}
                                onClick={() => showModalAdd()}
                            >
                                <Card.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }} >
                                    <div style={{ fontSize: '3rem' }}>+</div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Carousel.Item>
                </Carousel>
            )
        }else{
            return(
                <Carousel activeIndex={activeIndex} onSelect={handleSelect}  interval={null} indicators={false} data-bs-theme='dark' prevIcon={<PrevIcon />} nextIcon={<NextIcon />}>
                    {clientes.map((clientes, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            <Card
                                bg='light'
                                border='light'
                                text='dark'
                                style={{ cursor: "pointer" }}
                                onClick={() => showModalMenu()}
                            >
                                <Card.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }} >
                                    <Stack gap={1}>
                                        <div style={{ fontSize: '1.8rem', textAlign: 'center'}}><b>Rut:</b> {clientes.rut_cliente}</div>
                                        <div style={{ fontSize: '1.8rem', textAlign: 'center'}}><b>Nombre:</b> {clientes.nombre} {clientes.apellidos}</div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </div>
                    </Carousel.Item>
                    ))}
                    <Carousel.Item>
                        <div className="d-flex justify-content-center">
                            <Card
                                bg='light'
                                border='light'
                                text='dark'
                                style={{ width: "18rem", cursor: "pointer" }}
                                onClick={() => showModalAdd()}
                            >
                                <Card.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }}>
                                    <div style={{ fontSize: '3rem' }}>+</div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Carousel.Item>
                </Carousel>
            )
        }
    }

    return (
        <div >
            <h1 style={{ backgroundColor: '#0f0f0f', fontSize: '4rem', color: '#f9f4f5', textAlign: 'center', position: 'relative', margin: '0' }}><i className="bi bi-person-fill-gear" style={{ color: '#f9f4f5', marginRight: '0.2rem' }}></i>Menú Entrenador</h1>
            <div style={{ backgroundColor: '#0f0f0f', minHeight: 'auto', minWidth: 'auto', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly', margin: '0'}}>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div style={{ width: '100%' }}> {/* Contenedor del Carrusel y Modal */}
                    <CarouselClientes />
                    <Modal show={modalShowAdd} onHide={hideModalAdd} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar Cliente</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>RUT del Cliente</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={rutCliente}
                                        onChange={(e) => setRutCliente(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <br />
                                <Button type="button" style={{backgroundColor:'#9F87AF', borderColor:'#9F87AF'}} onClick={addCliente}>Agregar Cliente</Button>
                            </Form>
                            <p>{resultMessage}</p>
                        </Modal.Body>
                    </Modal>
                    <ModalMenu />
                </div>
            </Container>
            </div>
        </div>
    );
}