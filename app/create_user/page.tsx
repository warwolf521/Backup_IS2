'use client';

import React, { useReducer, useEffect, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, FormGroup, FormControl, Alert, Card, Modal, Stack, ButtonToolbar, ButtonGroup, Container } from 'react-bootstrap';

const CreateUser = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [rutCoach, setRut] = useState('');
  const [passw, setPassw] = useState('');
  const [mess, setMess] = useState('');

  const [showModalExit, setShowModalExit] = useState(false);
  const [showModalSet, setShowModalSet] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isOperationCompleted, setIsOperationCompleted] = useState(false);
  

  const openModal = (message, type = 'message') => {
    setModalMessage(message);
    setModalType(type);
    setShowModalSet(true);
  }

  const closeModal = () => {
    setShowModalSet(false);
  }

  const handleConfirm = () => {
    if (modalType === 'confirm') {
      setIsConfirmed(true);
    }
    closeModal();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) {
      openModal('Estas seguro de que los datos estan bien?', 'confirm');
    }
    //if (isConfirmed) {
    //  try {
    //    const queryParams = new URLSearchParams({
    //      nombre: nombre,
    //      apellidos: apellidos,
    //      rut_usuario: rutCoach,
    //      contraseña: passw,
    //    }).toString();
    //    
    //    let resp
    //    await fetch(`/api/add-entrenador?${queryParams}`, {
    //      method: 'GET',
    //      headers: { 'Content-Type': 'application/json' },
    //    }).then (response => {resp = response; return response.json()}).then(data =>  {
    //      if (data.error) {
    //        openModal(data.error);
    //      }
    //    });
    //    if (!resp.ok) throw new Error('No se ha agregado un entrenador');
    //    openModal('Se ha agregado un entrenador exitosamente');
    //  } catch (error) {
    //    openModal(error.message);
    //    
    //  }
    //}
  };

  useEffect(() => {
    if (isConfirmed && !isOperationCompleted) {
      const performDatabaseOperation = async () => {
        let operationMessage = 'Registro Completado'; // Default message assuming success
        try {
          const queryParams = new URLSearchParams({
            nombre: nombre,
            apellidos: apellidos,
            rut_usuario: rutCoach,
            contraseña: passw,
          }).toString();
  
          const resp = await fetch(`/api/add-entrenador?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
  
          const data = await resp.json();
          if (!resp.ok) {
            throw new Error('No se ha agregado un entrenador'); // Specific error for HTTP failure
          }
          if (data.error) {
            throw new Error(data.error); // Specific error from API response
          }
          // If no error, assume success
          operationMessage = 'El entrenador ha sido agregado exitosamente.';
        } catch (error) {
          operationMessage = error.message; // Use the error message for the modal
        } finally {
          setIsOperationCompleted(true);
          openModal(operationMessage); // Use a single modal to show the outcome
          setTimeout(() => window.location.reload(), 5000);
        }
      };
      performDatabaseOperation();
    }
    //if (isConfirmed && !isOperationCompleted) {
    //  const performDatabaseOperation = async () => {
    //      try {
    //        const queryParams = new URLSearchParams({
    //          nombre: nombre,
    //          apellidos: apellidos,
    //          rut_usuario: rutCoach,
    //          contraseña: passw,
    //        }).toString();
//
    //        let resp
    //        await fetch(`/api/add-entrenador?${queryParams}`, {
    //          method: 'GET',
    //          headers: { 'Content-Type': 'application/json' },
    //        }).then (response => {resp = response; return response.json()}).then(data =>  {
    //          if (data.error) {
    //            openModal(data.error);
    //          }
    //        });
    //        if (!resp.ok) throw new Error('No se ha agregado un entrenador');
    //        openModal('Ha surgido un error al agregar el entrenador');
    //      } catch (error) {
    //        openModal(error.message);
//
    //      }
    //      setIsOperationCompleted(true);
    //      openModal('Registro Completado', 'message');
    //      setTimeout(() => window.location.reload(), 5000);
    //  }
    //  performDatabaseOperation();
    //}
  }, [isConfirmed]);

  return (
    <div className="min-vh-100 justify-content-evenly rounded-lg text-white" style={{ backgroundColor: '#0f0f0f', minHeight: 'auto', minWidth: 'auto', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}} >
      <div className="container mt-4 rounded-lg bg-dark">
        <h2 style={{ color: '#FFFFFF' }}>Crear nuevo entrenador:</h2>
        <div className="mb-3">
          <p style={{ color: '#9F87AF' }}>Inserte los datos de el nuevo entrenador</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label text-white">Nombre:</label>
            <input type="text" className="form-control w-50" id="nombre" required 
            value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label text-white">Apellidos:</label>
            <input type="text" className="form-control w-50" id="apellidos" required 
            value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="rutCoach" className="form-label text-white">RUT Coach:</label>
            <input type="text" className="form-control w-50" id="rutCoach" placeholder="Sin puntos ni guión" minLength={8} maxLength={9} required 
            value={rutCoach} onChange={(e) => setRut(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">Contraseña:</label>
            <input type="password" className="form-control w-50" id="password" minLength={6} required
            value={passw} onChange={(e) => setPassw(e.target.value)}  />
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: '#9F87AF', color: 'white' }}>Crear Coach</button>
        </form>
        <Modal show={showModalSet} onHide={closeModal}>
          <Modal.Header closeButton style={{ backgroundColor: '#0f0f0f' }}>
            <Modal.Title style={{ color: 'white' }}>{modalType === 'confirm' ? 'Confirmar' : 'Mensaje'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#0f0f0f', color: '#9F87AF' }}>{modalMessage}</Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#0f0f0f' }}>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
              </Button>
              {modalType === 'confirm' && (
                <Button variant="submit" style={{ backgroundColor: '#9F87AF', color: 'white' }} onClick={handleConfirm}>
                  Confirm
                </Button>
              )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CreateUser;