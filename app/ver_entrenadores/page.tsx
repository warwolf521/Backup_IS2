'use client';

import React, { useReducer, useEffect, useState } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Spinner, Card, Modal, Stack, Table, Pagination } from 'react-bootstrap';
import { useRouter } from 'next/navigation'

const initialState = {
    entrenadores: [],
    estado: '',
    error: '',
    successMessage: '',
    isLoading: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_ENTRENADORES':
            return { ...state, entrenadores: action.entrenadores, isLoading: false };
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_ERROR':
            return { ...state, error: action.error, isLoading: false };
        case 'SET_SUCCESS_MESSAGE':
            return { ...state, successMessage: action.message, isLoading: false };
        case 'START_LOADING':
            return { ...state, isLoading: true };
        case 'CLEAR_MESSAGE':
            return { ...state, successMessage: '', error: '' }; // Clears both success and error messages
        default:
            return state;
    }
}


function VerEntrenadores() {
    const [show, setShow] = useState(false);
    const [selectedEntrenador, setSelectedEntrenador] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Número de elementos por página

    const handleClose = () => setShow(false);
    const handleShow = (entrenador) => {
        setSelectedEntrenador(entrenador);
        setShow(true);
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const router = useRouter();

    const fetchEntrenadores = async () => {
        dispatch({ type: 'START_LOADING' });
        try {
            const response = await fetch(`/api/fetch-entrenadores`);
            if (!response.ok) throw new Error('Failed to fetch Entrenadores');
            const data = await response.json();
            dispatch({ type: 'SET_ENTRENADORES', entrenadores: data.result.rows });
            //dispatch({ type: 'SET_SUCCESS_MESSAGE', message: 'Se han encontrado los entrenadores exitosamente' });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', error: error.message });
            setTimeout(() => {
                dispatch({ type: 'CLEAR_MESSAGE' });
            }, 3000); // Clear the message after 3 seconds
        }
    };

    useEffect(() => {
        fetchEntrenadores();
    }, []);

    const handleSubmit = async () => {
        dispatch({ type: 'START_LOADING' });
        try {
            const response = await fetch(`/api/change-entrenador-estado?rut_usuario=${selectedEntrenador.rut_usuario}`, {
                method: 'GET',
            });
            if (!response.ok) throw new Error('No se ha cambiado el estado del Entrenador');
            dispatch({ type: 'SET_SUCCESS_MESSAGE', message: 'Estado del Entrenador actualizado exitosamente' });
            setTimeout(() => {
                dispatch({ type: 'CLEAR_MESSAGE' });
            }, 3000); // Clear the message after 3 seconds
            handleClose();
            fetchEntrenadores();
        } catch (error) {
            dispatch({ type: 'SET_ERROR', error: error.message });
            setTimeout(() => {
                dispatch({ type: 'CLEAR_MESSAGE' });
            }, 3000); // Clear the message after 3 seconds
        }
    };

    const handleChange = (e) => {
        dispatch({ type: 'SET_FIELD', field: 'estado', value: e.target.value });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state.entrenadores.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(state.entrenadores.length / itemsPerPage);

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: 'auto', minWidth: 'auto', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
            <div style={{ marginTop: '-5vh' }} className="d-flex align-items-center justify-content-center vh-100 ">
                <Card bg={'dark'} text={'light'} style={{ width: '80rem' }}>
                    <Card.Body>
                        <Card.Title>Entrenadores</Card.Title>
                        {state.error && <Alert variant="danger">{state.error}</Alert>}
                        {state.successMessage && <Alert variant="success">{state.successMessage}</Alert>}
                        <Table variant="dark" striped bordered hover responsive>
                            <thead>
                                <tr className='table-dark'>
                                    <th style={{ backgroundColor: '#502f4c', color: '#f9f4f5' }} >Rut</th>
                                    <th style={{ backgroundColor: '#502f4c', color: '#f9f4f5' }} >Nombre</th>
                                    <th style={{ backgroundColor: '#502f4c', color: '#f9f4f5' }} >Apellido</th>
                                    <th style={{ backgroundColor: '#502f4c', color: '#f9f4f5' }} >Estado</th>
                                    <th style={{ backgroundColor: '#502f4c', color: '#f9f4f5' }} >Cambiar Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(entrenador => (
                                    <tr key={entrenador.rut_usuario}>
                                        <td>{entrenador.rut_usuario}</td>
                                        <td>{entrenador.nombre}</td>
                                        <td>{entrenador.apellidos}</td>
                                        <td>{entrenador.estado}</td>
                                        <td style={{width:'9rem'}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,width: '9rem'}}>
                                            <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant='' onClick={() => handleShow(entrenador)}>
                                                <i className="bi bi-person-fill-gear" style={{ fontSize: '1.5rem', color: 'white', marginRight: '0.2rem' }}></i>
                                                Editar
                                            </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination className='pagination-dark-mode' >
                            <Pagination.First onClick={() => handlePageChange(1)} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
                            {[...Array(totalPages).keys()].map(number => (
                                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                        </Pagination>
                    </Card.Body>
                </Card>
            </div>
                <Modal centered show={show} onHide={handleClose}>
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>¿Quieres cambiar el estado del entrenador?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="outline-danger" onClick={handleClose}>
                                Salir
                            </Button>
                            <Button variant='outline-success' onClick={handleSubmit}>
                                Cambiar estado
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
        </div>
    );
}

export default VerEntrenadores;