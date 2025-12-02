import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';

const ConfiguracionUsuario = () => {
    const initialUser = JSON.parse(localStorage.getItem('user') || '{"nombre": "Usuario", "email": "ejemplo@ejemplo.com", "rol": "espectador"}');
    
    const [user, setUser] = useState(initialUser); 
    
    const [formData, setFormData] = useState({ 
        nombre: initialUser.nombre, 
        email: initialUser.email, 
        password: ''
    });

    const navigate = useNavigate();
    
    const [modal, setModal] = useState({ 
        isOpen: false, 
        type: 'alert' as 'alert' | 'confirm', 
        title: '', 
        message: '',
        onConfirm: undefined as undefined | (() => void), 
        action: undefined as undefined | (() => void)
    });

    const [passData, setPassData] = useState({ actual: '', nueva: '', confirmar: '' });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleGuardarCambios = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.email) {
            setModal({ isOpen: true, title: 'CAMPO VACÍO', message: 'El nombre y correo no pueden estar vacíos.', type: 'alert', onConfirm: undefined, action: undefined });
            return;
        }

        const updatedUser = { 
            ...user, 
            nombre: formData.nombre,
            email: formData.email,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setModal({ 
            isOpen: true, 
            title: 'DATOS GUARDADOS',
            message: 'Tu información ha sido actualizada correctamente.', 
            type: 'alert',
            onConfirm: undefined,
            action: () => window.dispatchEvent(new Event('auth-change')) 
        }); 
    };

    const handleCambiarPassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!passData.actual || !passData.nueva || !passData.confirmar) {
            setModal({ isOpen: true, title: 'CAMPO VACÍO', message: 'Por favor completa todos los campos.', type: 'alert', onConfirm: undefined, action: undefined });
            return;
        }

        if (passData.nueva !== passData.confirmar) {
            setModal({ isOpen: true, title: 'ERROR', message: 'Las contraseñas nuevas no coinciden.', type: 'alert', onConfirm: undefined, action: undefined });
            return;
        }

        if (passData.nueva.length < 6) {
            setModal({ isOpen: true, title: 'SEGURIDAD', message: 'La contraseña debe tener al menos 6 caracteres.', type: 'alert', onConfirm: undefined, action: undefined });
            return;
        }
        
        setModal({ 
            isOpen: true, 
            title: 'CONTRASEÑA ACTUALIZADA', 
            message: 'Tu contraseña ha sido modificada correctamente.', 
            type: 'alert',
            onConfirm: undefined, 
            action: undefined
        }); 
        
        setPassData({ actual: '', nueva: '', confirmar: '' }); 
    };
    
    const cerrarModal = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.action) modal.action();
    };

    const dashboardPath = user.rol === 'streamer' ? '/dashboard-streamer' : '/dashboard-espectador';


    return (
        <div className="container">
            <MiModal 
                isOpen={modal.isOpen} 
                onClose={cerrarModal} 
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm} 
            />

            <div className="dashboard-header">
                <h1 className="text-neon">CONFIGURACIÓN DE CUENTA</h1>
                <p className="text-muted">Administra tu información personal y seguridad</p>
            </div>

            <div className="dashboard-layout">
                
                
                <div className="dashboard-panel">
                    <h2 className="section-title">Datos Personales</h2>
                    <div className="form-box">
                        <div className="text-center mb-20">
                            <div className="profile-avatar" style={{margin: '0 auto'}}>
                                {user.nombre.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="mt-20">{user.nombre}</h3>
                        </div>

                        <form onSubmit={handleGuardarCambios}>
                            <label className="text-muted">Nombre de Usuario</label>
                            <input 
                                type="text" 
                                value={formData.nombre} 
                                className="auth-input" 
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            />
                            
                            <label className="text-muted">Correo Electrónico</label>
                            <input 
                                type="text" 
                                value={formData.email} 
                                className="auth-input" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            
                            <button type="submit" className="btn-neon w-100 mt-20">
                                GUARDAR DATOS
                            </button>
                        </form>
                    </div>
                </div>

                <div className="dashboard-panel">
                    <h2 className="section-title">Seguridad</h2>
                    <div className="form-box">
                        <h4 className="text-center text-neon" style={{marginTop: 0}}>Cambiar Contraseña</h4>
                        
                        <form onSubmit={handleCambiarPassword}>
                            <label className="text-muted">Contraseña Actual</label>
                            <input type="password" className="auth-input" value={passData.actual} onChange={e => setPassData({...passData, actual: e.target.value})} />

                            <hr style={{borderColor: '#333', margin: '20px 0'}} />

                            <label className="text-muted">Nueva Contraseña</label>
                            <input type="password" className="auth-input" value={passData.nueva} onChange={e => setPassData({...passData, nueva: e.target.value})} />

                            <label className="text-muted">Confirmar Nueva Contraseña</label>
                            <input type="password" className="auth-input" value={passData.confirmar} onChange={e => setPassData({...passData, confirmar: e.target.value})} />

                            <button type="submit" className="btn-neon w-100 mt-20">
                                ACTUALIZAR CONTRASEÑA
                            </button>
                        </form>
                    </div>
                </div>

            </div>

            <div className="text-center mt-40">
                <Link to="/">
                  <button className="btn-regresar">Volver al Inicio</button>
                </Link>
            </div>
        </div>
    );
};

export default ConfiguracionUsuario;