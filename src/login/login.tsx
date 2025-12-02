import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'alert' as 'alert' | 'confirm' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.dispatchEvent(new Event('auth-change')); 
        

        navigate('/'); 
      } else {
        setModal({
          isOpen: true,
          type: 'alert',
          title: 'ERROR DE ACCESO',
          message: data.msg || 'Credenciales incorrectas'
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'ERROR DE CONEXIÓN',
        message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      });
    }
  };

  return (
    <div className="auth-box">
      <MiModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <h2 className="text-center mb-20 text-neon">INICIAR SESIÓN</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" placeholder="Email" className="auth-input"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña" className="auth-input"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-neon w-100">ENTRAR</button>
      </form>
      <p className="text-center mt-20 text-muted">
        ¿No tienes cuenta? <Link to="/registro" className="text-neon bold" style={{textDecoration:'none'}}>Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;