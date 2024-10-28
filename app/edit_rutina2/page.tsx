'use client';

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Card, Modal, Stack, ButtonToolbar, ButtonGroup, Container } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { create } from 'domain';

function InsertEjercicio(request) {
    const [showModalExit, setShowModalExit] = useState(false);
    const [showModalFinish, setShowModalFinish] = useState(false);
    const [showModalSet, setShowModalSet] = useState(false);
    const [showModalSubmit, setShowModalSubmit] = useState(false);
    const [rut, setRut] = useState('');
    const [mess, setMess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataRutina, setDataRutina] = useState<any[]>([]);
    const [dataEjercicios, setDataEjercicios] = useState<any[]>([]);
    const [set, setSet] = useState('');
    const [setFront, setSetFront] = useState('');
    const [cantidadSet, setCantidadSet] = useState('');
    const [idEjercicio, setIdEjercicio] = useState('');
    const [cantidad, setCantidad] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const R_rut = searchParams?.get('rut_cliente');

    const [comentario, setComentario] = useState('');
    const [isEditable, setIsEditable] = useState(false);

    const toggleEdit = () => {
        setIsEditable(!isEditable);
      };

    const handleSubmitComentario = async () => { 
        if (comentario == '') {
            setMess('Por favor, rellene el comentario');
            return;
        }
        try {
            const response = await fetch(`/api/handle-comentario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_rutina: dataRutina[0].id_rutina, comentario: comentario }),
            });
            if (!response.ok) throw new Error('No se ha agregado un comentario a la rutina');
            setMess('Se ha agregado un comentario a la rutina exitosamente');
            setIsEditable(!isEditable);
            fetchIdRutina();
        } catch (error) {
            setMess(error.message);
        }
    };

    

    useLayoutEffect(() => {
        if(R_rut != null){
            setRut(R_rut);
            if(rut != ''){
                fetchIdRutina();
            }
        }
    }, [searchParams?.get('rut_cliente'), rut]);

    const fetchIdRutina = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/select-unfinished-rutina?rut_cliente=${rut}`);
            if (!response.ok) setMess('No se ha encontrado una rutina para este cliente');
            const data = await response.json();
            console.log(data.rutinasWithAllData);
            console.log(data.allEjercicioRows);
            if (data.rutinasWithAllData.length > 0) {
                setDataRutina(data.rutinasWithAllData);
                if (data.rutinasWithAllData[0].serie.length > 0) {
                    setSet(data.rutinasWithAllData[0].serie[0].id_serie);
                }
                if(data.rutinasWithAllData[0].comentario != null){
                    setComentario(data.rutinasWithAllData[0].comentario);
                }else{
                    setComentario('');
                }
                setDataEjercicios(data.allEjercicioRows)
                setIsLoading(false);
            } else {
                setMess('No se ha encontrado una rutina para este cliente');
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const createSet = () => {
        setIsLoading(true);
        let resp;
        fetch(`/api/create-set?id_rutina=${dataRutina[0].id_rutina}&cantidad=${cantidadSet}`)
        .then(response => {
            resp = response;
            return response.json();
        }).then(data => {
          if(resp.ok || data.length > 0){
                setShowModalSet(false);
                fetchIdRutina();
                alert("Set creado exitosamente");
          }else{
            alert("Fallo al crear un nuevo set");
          }
        })
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        setShowModalSubmit(false)
        if (idEjercicio == '' || cantidad == '' || set == '') {
            setMess('Por favor, rellene todos los datos');
            console.log("id ejercicio: " + idEjercicio + " cantidad: " + cantidad + " set: " + set)
            return;
        }
        try {
            const response = await fetch(`/api/add-ejercicio-to-rutina?set=${set}&id_ejercicio=${idEjercicio}&cantidad=${cantidad}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok){
                setMess('Error al agregar el ejercicio a la rutina');
                setIsLoading(false)
            }
            else{
                setMess('Se ha agregado un ejercicio a la rutina exitosamente');
                setIdEjercicio('')
                setCantidad('')
                fetchIdRutina();
            }
        } catch (error) {
            setMess(error.message);
        }
    };

    const addTimestampFinal = async () => {
        setIsLoading(true)
        setShowModalFinish(false)
        try {
            const response = await fetch('/api/add-timestampFinal-to-rutina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_rutina: dataRutina[0].id_rutina }),
            });
            if (!response.ok){
                setMess('Error al agregar el timestamp final')
            }else{
                setMess('El timestamp final se ha agregado exitosamente. Rutina terminada. Vuelva al menú principal');
                setShowModalExit(true);
            }
        } catch (error) {
            setMess(error.message);
        }
    };

    const ModalExit = () => {
        return(
            <Modal show={showModalExit} centered>
                <Modal.Header>
                    <Modal.Title>Exito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Rutina Finalizada</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" style={{width: '40%', margin: '10px'}} href="/">Menu Principal</Button>
                </Modal.Footer>
            </Modal>
        )
    }
    const ModalSubmit = () => {
        if(showModalSubmit && (idEjercicio == '' || cantidad == '' || set == '')){
            setMess('ingrese los campos necesarios')
            setShowModalSubmit(false)
        }
        else{
            return(
                <Modal show={showModalSubmit} centered onHide={() => setShowModalSubmit(false)}>
                    <Modal.Header>
                        <Modal.Title>Agregar Ejercicio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Seguro que quiere agregar este ejercicio?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setShowModalSubmit(false)} disabled={isLoading} style={{ backgroundColor:'#bb2d3b'}}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={isLoading} style={{ backgroundColor:'#9f87af'}}>Seguro</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    const ModalFinish = () => {
        return(
            <Modal show={showModalFinish} centered onHide={() => setShowModalFinish(false)}>
                <Modal.Header>
                    <Modal.Title>Finalizar rutina</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Seguro que desea finalizar rutina?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModalFinish(false)} disabled={isLoading} style={{ backgroundColor:'#bb2d3b'}}>Cancelar</Button>
                    <Button onClick={addTimestampFinal} disabled={isLoading} style={{ backgroundColor:'#9f87af'}}>Seguro</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setMess('');
        }, 7500);
          return () => clearTimeout(timer); // Cleanup the timer
    }, [mess]);

    return (
        <div style={{ backgroundColor: '#0f0f0f', height: '100%', minHeight: '100vh' }}>
            <Container className="d-flex align-items-center justify-content-center" >
                <Card border="dark" style={{ width: '80rem', backgroundColor: '#444950' }}>
                    <Card.Body>
                        <Card.Title style={{ color:'#f9f4f5'}} >Editar Rutina</Card.Title>
                        {mess && <Alert variant='success'>{mess}</Alert>}
                        <Form>
                            {dataRutina.length > 0 && (
                                <FormGroup>
                                    <Form.Label style={{ color:'#f9f4f5'}}>Comentarios de la Rutina</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Aqui van los comentarios de la rutina"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        disabled={!isEditable}
                                        readOnly={!isEditable}
                                        //style={{ color: isEditable ? '#faf5f6' : '#f9f4f5', backgroundColor: isEditable ? '#222222' : '#333333' }}
                                    />
                                    <div style={{ marginTop: '10px' }}>
                                    <Button 
                                        onClick={toggleEdit} 
                                        disabled={isLoading}
                                        style={{ backgroundColor: isEditable ? "#bb2d3b" : "#9f87af" }}>
                                        {isEditable ? 'Cancelar Edicion' : 'Edit Comentario'}
                                    </Button>
                                    {' '}
                                    {isEditable && (
                                        <Button variant="success" onClick={handleSubmitComentario} disabled={isLoading}>
                                            Save Comentario
                                        </Button>
                                    )}
                                    </div>
                                    <br />                      
                                    <Form.Label style={{ color:'#f9f4f5'}}>Series</Form.Label>
                                    <ButtonToolbar aria-label="Toolbar with button groups">
                                        {dataRutina[0].serie.length == 0 ? (<ButtonGroup className="me-2" aria-label="First group">
                                            <Button variant="danger" disabled>Sin series</Button>
                                        </ButtonGroup>) : <></>}
                                        {dataRutina[0].serie.map((serie, serieIndex) => (
                                          <ButtonGroup key={serieIndex} className="me-2" aria-label="First group">
                                            <Button variant={serieIndex == setFront ? "danger" : "secondary"} onClick={(e) => {setSet(serie.id_serie); setSetFront(serieIndex)}}>Serie {serieIndex + 1}</Button>
                                          </ButtonGroup>
                                        ))}
                                        <ButtonGroup className="me-2" aria-label="First group">
                                            <Button variant="success" onClick={(e) => setShowModalSet(true)}>Crear serie</Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                    <br />
                                    <Form.Select 
                                        required 
                                        aria-label="Default select example"
                                        onChange={(e) => setIdEjercicio(e.target.value)}
                                        value={idEjercicio}
                                    >
                                        <option value="">Selecciona ejercicio</option>
                                        {dataEjercicios.map((ejercicio, ejercicioIndex) => (
                                          <option key={ejercicioIndex} value={ejercicio.id_ejercicio}>{ejercicio.nombre}</option>
                                        ))}
                                        {/*<option value="1">Flexiones de brazos</option>
                                        <option value="2">Sentadillas</option>
                                        <option value="3">Plancha abdominal</option>
                                        <option value="4">Curl de bíceps</option>
                                        <option value="5">Press de hombros</option>*/}
                                    </Form.Select>
                                    
                                    {/* <Form.Control
                                        type="text"
                                        placeholder='Enter ID Ejercicio'
                                        value={idEjercicio}
                                        onChange={(e) => setIdEjercicio(e.target.value)}
                                        required
                                    /> */}

                                    <br />
                                    <Form.Control
                                        type="text"
                                        placeholder='Ingrese Cantidad'
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                        required
                                    />
                                    <br />
                                    <Button onClick={() => setShowModalSubmit(true)} disabled={isLoading} style={{ backgroundColor:'#9f87af'}}>Agregar</Button> {' '}
                                    <Button onClick={() => setShowModalFinish(true)} disabled={isLoading} style={{ backgroundColor:'#9f87af'}}>Terminar Rutina</Button>
                                    <br/>
                                    <br/>
                                    {dataRutina[0].serie.map((serie, serieIndex) => (
                                        serieIndex == setFront ? (
                                        <div key={serieIndex}>
                                        <h6 style={{ color:'#f9f4f5'}}>Serie:Nº{serieIndex+1} &nbsp; Repeticiones: {serie.cantidad}</h6>
                                        <table className="table table-hover" style={{ borderRadius: '10px' }}>
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
                                    ) : (<></>)
                                    ))}
                                </FormGroup>
                            )}
                        </Form>
                    </Card.Body>
                </Card>
                <ModalSubmit />
                <ModalFinish />
                <ModalExit />
                <Modal show={showModalSet} onHide={() => setShowModalSet(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear nueva serie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cantidad de repeticiones</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={cantidadSet}
                                    onChange={(e) => setCantidadSet(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br />
                            <Button type="button" onClick={createSet}>Crear serie</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default InsertEjercicio;