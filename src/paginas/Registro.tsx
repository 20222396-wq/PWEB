import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';
import './registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const navigate = useNavigate();

  const [modal, setModal] = useState({ 
    isOpen: false, 
    type: 'alert' as 'alert' | 'confirm', 
    title: '', 
    message: '',
    action: undefined as undefined | (() => void)
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const datosAEnviar = { ...formData, rol: 'espectador' };

      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });
      
      if (res.ok) {
        setModal({
          isOpen: true,
          type: 'alert',
          title: '¡CUENTA CREADA!',
          message: 'Tu registro fue exitoso. Ahora puedes iniciar sesión.',
          action: () => navigate('/login') 
        });
      } else {
        const data = await res.json();
        setModal({ 
          isOpen: true, 
          type: 'alert', 
          title: 'ERROR DE REGISTRO', 
          message: data.msg || 'No se pudo crear la cuenta.', 
          action: undefined 
        });
      }
    } catch (error) {
      setModal({ 
        isOpen: true, 
        type: 'alert', 
        title: 'ERROR DE CONEXIÓN', 
        message: 'No se pudo conectar con el servidor. Verifica que tu backend esté corriendo.', 
        action: undefined 
      });
    }
  };

  const cerrarModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.action) modal.action();
  };

  return (
    <div className="auth-box">
      <MiModal 
        isOpen={modal.isOpen} 
        onClose={cerrarModal} 
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <h2 className="text-center mb-20 text-neon">CREAR CUENTA</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Nombre de Usuario" 
          required 
          className="auth-input"
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          required 
          className="auth-input"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          required 
          className="auth-input"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <button type="submit" className="btn-neon w-100">REGISTRARSE</button>
      </form>
      <p className="text-center mt-20 text-muted">
        ¿Ya tienes cuenta? <Link to="/login" className="text-neon bold">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default Registro;