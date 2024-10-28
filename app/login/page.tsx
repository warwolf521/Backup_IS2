"use client"

import React, { useReducer, useEffect, useState } from 'react';
import { Form, Row, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation'
import {signIn} from "next-auth/react";

const initialState = {
  error: '',
  successMessage: '',
};

function reducer(state, action) {
  switch (action.type) {
      case 'SET_ERROR':
          return { ...state, error: action.error, isLoading: false };
      case 'SET_SUCCESS_MESSAGE':
          return { ...state, successMessage: action.message, isLoading: false };
      case 'CLEAR_MESSAGE':
          return { ...state, successMessage: '', error: '' }; // Clears both success and error messages
      default:
          return state;
  }
}

function Login() {
  const [rut, setRut] = useState('');
  const [pass, setPass] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null); //creo que ya no se usa esto
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);

  async function Authen(){
    const response = await signIn('credentials', {
      rut: rut,
      pass: pass,
      redirect: false
    });
    console.log({response});
    if(!response?.error){
      console.log("login exitoso!");
      router.push('/');
      router.refresh();
    } else {
      console.log("error en login :(");
      dispatch({ type: 'SET_ERROR', error: "RUT o password incorrectos" });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGE' });
    }, 3000); // Clear the message after 3 seconds
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: 'auto', minWidth: 'auto', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
        <div style={{position:'relative', width: '25rem', height: 'auto', margin:'0 10rem 0 0'}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',width:'28rem'}}>
              <h1 style={{color: '#f9f4f5', marginBottom:'5rem'}} >Bienvenido a GymApp</h1>
              <h3 style={{ color: '#f9f4f5' }}>Iniciar Sesión</h3>
              <Form>
                {state.error && <Alert variant="danger">{state.error}</Alert>}
                {state.successMessage && <Alert variant="success">{state.successMessage}</Alert>}
                <Row>
                <Form.Label style={{ color: '#f9f4f5', marginBottom: '0rem', textAlign: 'center' }}>Rut</Form.Label>
                <Form.Control type="text" onChange={(e) => setRut(e.target.value)} required style={{ color: '#f9f4f5', backgroundColor: '#333333' }}/>
                <Form.Label style={{ color: '#f9f4f5',marginTop:'1rem', marginBottom: '0rem', textAlign: 'center' }}>Contraseña</Form.Label>
                <Form.Control type="password" onChange={(e) => setPass(e.target.value)} required style={{ color: '#f9f4f5', backgroundColor: '#333333' }}/>
                  <div style={{marginTop: '15px', display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <Button style={{ color: '#f9f4f5', backgroundColor: '#9f87af', outline: 0 }} variant="primary" onClick={Authen}>Inicia Sesión</Button>
                  </div>
                </Row>
              </Form>
            </div>
        </div>
        <div style={{
          backgroundImage: 'url("/images/tire.png")', // Corrected path
          backgroundSize: 'cover', // Cover the entire div
          backgroundPosition: 'center', // Center the background image
          width: '50rem',
          height: '57rem',
        }}>
        </div>
    </div>
  );
}

export default Login;