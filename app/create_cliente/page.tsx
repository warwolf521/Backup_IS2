'use client';

import { useRouter } from 'next/router';
import React, { useReducer, useEffect, useState, useLayoutEffect } from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Card, Modal, Stack, ButtonToolbar, ButtonGroup, Container } from 'react-bootstrap';

const CreateClient = () => {
  const [rutCliente, setRutCliente] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [masa, setMasa] = useState('');
  const [estatura, setEstatura] = useState('');
  const [edad, setEdad] = useState('');
  const [objetivo, setObjetivo] = useState('');
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
  };

  useEffect(() => {
    if (isConfirmed && !isOperationCompleted) {
      const performDatabaseOperation = async () => {
        let operationMessage = 'Registro Completado';
        try {
          const queryParams = new URLSearchParams({
            rut_cliente: rutCliente,
            nombre: nombre,
            apellidos: apellidos,
            masa: masa,
            estatura: estatura,
            edad: edad,
            objetivo: objetivo,
          }).toString();
          
          //let resp
          //fetch(`/api/add-cliente?${queryParams}`, {
          //  method: 'GET',
          //  headers: { 'Content-Type': 'application/json' },
          //}).then (response => {resp = response; return response.json()}).then(data =>  {
          //  if (data.error) {
          //    alert(data.error);
          //  }
          //});

          const resp = await fetch(`/api/add-cliente?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await resp.json();
          if (!resp.ok) {
            throw new Error('No se ha agregado el cliente'); // Specific error for HTTP failure
          }
          if (data.error) {
            throw new Error(data.error); // Specific error from API response
          }
          // If no error, assume success
          operationMessage = 'El cliente ha sido agregado exitosamente.';
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
        
    //      if (!resp.ok) throw new Error('No se ha agregado un cliente');
    //      alert('Se ha agregado un cliente exitosamente');
    //    } catch (error) {
    //      setMess(error);
    //      
    //    }
    //    setIsOperationCompleted(true);
    //    openModal('Registro Completado', 'message');
    //    setTimeout(() => window.location.reload(), 5000);
    //  }
    //  performDatabaseOperation();
    //}
  }, [isConfirmed]);
        
  //const handleSubmit = async (e) => {
  //  e.preventDefault();
  //  const confirmed = window.confirm('Estas seguro de que los datos estan bien?');
  //  if (confirmed) {
  //    try {
  //      const queryParams = new URLSearchParams({
  //        rut_cliente: rutCliente,
  //        nombre: nombre,
  //        apellidos: apellidos,
  //        masa: masa,
  //        estatura: estatura,
  //        edad: edad,
  //        objetivo: objetivo,
  //      }).toString();
  //      
  //      let resp
  //      fetch(`/api/add-cliente?${queryParams}`, {
  //        method: 'GET',
  //        headers: { 'Content-Type': 'application/json' },
  //      }).then (response => {resp = response; return response.json()}).then(data =>  {
  //        if (data.error) {
  //          alert(data.error);
  //        }
  //      });
  //        
  //      if (!resp.ok) throw new Error('No se ha agregado un cliente');
  //      alert('Se ha agregado un cliente exitosamente');
  //    } catch (error) {
  //      setMess(error);
  //      
  //    }
  //  }
  //};

  

  return (
    <div className="min-vh-100 justify-content-evenly rounded-lg text-white" style={{ backgroundColor: '#0f0f0f', minHeight: 'auto', minWidth: 'auto', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}} >
      <div className="container mt-4 rounded-lg bg-dark">
        <h2 style={{ color: '#FFFFFF' }}>Ingresar nuevo cliente:</h2>
        <div className="mb-3">
          <p style={{ color: '#9F87AF' }}>Inserte los datos de el nuevo cliente</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="rutCliente" className="form-label">RUT Cliente:</label>
            <input type="text" className="form-control w-50" id="rutCliente" placeholder="Sin puntos ni guión" minLength={8} maxLength={9} required 
              value={rutCliente} onChange={(e) => setRutCliente(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input type="text" className="form-control w-50" id="nombre" required 
              value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">Apellidos:</label>
            <input type="text" className="form-control w-50" id="apellidos" required 
              value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="masa" className="form-label">Masa en kg:</label>
            <input type="text" className="form-control w-50" id="masa" 
              value={masa} onChange={(e) => setMasa(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="estatura" className="form-label">Estatura en cm:</label>
            <input type="text" className="form-control w-50" id="estatura" required 
              value={estatura} onChange={(e) => setEstatura(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="edad" className="form-label">Edad:</label>
            <input type="text" className="form-control w-50" id="edad" required 
              value={edad} onChange={(e) => setEdad(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="edad" className="form-label">Objetivo:</label>
            <input type="text" className="form-control w-50" id="objetivo" required 
              value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: '#9F87AF', color: 'white' }}>Crear cliente</button>
        </form>
        <Modal show={showModalSet} onHide={closeModal}>
          <Modal.Header closeButton style={{ backgroundColor: '#0f0f0f' }}>
            <Modal.Title style={{ color: 'white' }}>{modalType === 'confirm' ? 'Confirmar' : 'Mensaje'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#0f0f0f', color: '#9F87AF' }}>{modalMessage}</Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#0f0f0f' }}>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
              </Button>
              {modalType === 'confirm' && (
                <Button variant="submit" style={{ backgroundColor: '#9F87AF', color: 'white' }} onClick={handleConfirm}>
                  Confirmar
                </Button>
              )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CreateClient;