import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';

const initialRegalos = [
    { id: 1, nombre: "GG Emote", costo: 10, puntos: 5, icono: "👾" },
    { id: 2, nombre: "Corazón", costo: 50, puntos: 25, icono: "💖" },
    { id: 3, nombre: "Diamante", costo: 100, puntos: 50, icono: "💎" },
];

const DashboardUnificado = () => {
  const initialData = { 
    nombre: 'Invitado', 
    monedas: 100, 
    puntos: 1250, 
    horas: 0, 
    nivelStreamer: 1 
  };
  const userStr = localStorage.getItem('user');
  const baseUser = userStr ? { ...initialData, ...JSON.parse(userStr) } : initialData;
  
  const [monedas, setMonedas] = useState(baseUser.monedas);
  const [puntos, setPuntos] = useState(baseUser.puntos);
  const [nivel] = useState(baseUser.nivel || 1); 
  const [horasStream, setHorasStream] = useState(baseUser.horas);
  const [nivelStreamer, setNivelStreamer] = useState(baseUser.nivelStreamer);
  const horasParaSiguienteNivel = 100 - (horasStream % 100);

  
  const [mostrarPasarela, setMostrarPasarela] = useState(false);
  const [montoRecarga, setMontoRecarga]  = useState(100);
  const [procesando, setProcesando] = useState(false);
  const [tarjeta, setTarjeta] = useState({ numero: '', exp: '', cvv: '' });
  
  const [regalos, setRegalos] = useState<any[]>(initialRegalos);
  const [mostrarGestionRegalos, setMostrarGestionRegalos] = useState(false);
  const [nuevoRegalo, setNuevoRegalo] = useState({ nombre: '', costo: 0, puntos: 0, icono: '⭐' });


  const [modal, setModal] = useState({ isOpen: false, type: 'alert' as 'alert'|'confirm', title: '', message: '', onConfirm: undefined as undefined | (() => void), action: undefined as undefined | (() => void) });

  const lanzarAlerta = (title: string, msg: string, type: 'alert'|'confirm' = 'alert') => {
    setModal({ isOpen: true, type, title, message: msg, onConfirm: undefined, action: undefined });
  };

  useEffect(() => {

    const updatedUser = { 
        ...baseUser, 
        monedas, 
        puntos, 
        nivel, 
        horas: horasStream,
        nivelStreamer 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [monedas, puntos, horasStream, nivelStreamer, nivel]);

  
  const handleAgregarRegalo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoRegalo.nombre || nuevoRegalo.costo <= 0 || nuevoRegalo.puntos <= 0) {
        lanzarAlerta("ERROR", "Completa todos los campos correctamente.");
        return;
    }
    
    const newId = regalos.length > 0 ? Math.max(...regalos.map(r => r.id)) + 1 : 1;
    const regaloConId = { ...nuevoRegalo, id: newId, costo: Number(nuevoRegalo.costo), puntos: Number(nuevoRegalo.puntos) };
    
    const nuevosRegalos = [...regalos, regaloConId];
    setRegalos(nuevosRegalos);
    localStorage.setItem('regalos_db', JSON.stringify(nuevosRegalos));
    setNuevoRegalo({ nombre: '', costo: 0, puntos: 0, icono: '⭐' });
    setMostrarGestionRegalos(false); 

    lanzarAlerta("REGALO CREADO", `El regalo '${regaloConId.nombre}' ha sido agregado exitosamente.`);
  };

  const handleEliminarRegalo = (id: number) => {
    const nuevosRegalos = regalos.filter(r => r.id !== id);
    setRegalos(nuevosRegalos);
    localStorage.setItem('regalos_db', JSON.stringify(nuevosRegalos)); 
    lanzarAlerta("REGALO ELIMINADO", "El regalo ha sido removido.");
  };

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);
    
    setTimeout(() => {
      setProcesando(false);
      setMostrarPasarela(false);
      
      setMonedas((prev: number) => prev + Number(montoRecarga)); 
      
      lanzarAlerta("PAGO EXITOSO ✅", `Se han agregado ${montoRecarga} monedas a tu cuenta.`); 
      
      setTarjeta({ numero: '', exp: '', cvv: '' });
    }, 2000);
  };

  useEffect(() => {
    const regalosGuardados = localStorage.getItem('regalos_db');
    if (regalosGuardados) setRegalos(JSON.parse(regalosGuardados));
  }, []);


  return (
    <div className="container">
      <MiModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({...modal, isOpen: false})} 
        type={modal.type} 
        title={modal.title} 
        message={modal.message} 
      />

      {mostrarPasarela && (
        <div className="modal-overlay">
            <div className="modal-box">
                <button onClick={() => setMostrarPasarela(false)} className="close-btn">✕</button>
                <h2 className="text-center">Pasarela Segura 🔒</h2>
                <form onSubmit={handlePagar}>
                <label className="text-muted">Selecciona Monto</label>
                <select className="auth-input" value={montoRecarga} onChange={(e) => setMontoRecarga(Number(e.target.value))}>
                    <option value={100}>100 Monedas ($10.00)</option>
                    <option value={500}>500 Monedas ($50.00)</option>
                </select>

                <label className="text-muted">Tarjeta</label>
                <input type="text" placeholder="0000 0000 0000 0000" required className="auth-input" maxLength={19} value={tarjeta.numero} onChange={e => setTarjeta({...tarjeta, numero: e.target.value})} />
                <div className="input-row">
                    <input type="text" placeholder="MM/YY" required className="auth-input" maxLength={5} value={tarjeta.exp} onChange={e => setTarjeta({...tarjeta, exp: e.target.value})} />
                    <input type="password" placeholder="CVV" required className="auth-input" maxLength={3} value={tarjeta.cvv} onChange={e => setTarjeta({...tarjeta, cvv: e.target.value})} />
                </div>

                <button type="submit" className="btn-neon w-100" disabled={procesando}>
                    {procesando ? 'PROCESANDO...' : 'PAGAR AHORA'}
                </button>
                </form>
            </div>
        </div>
      )}

      {mostrarGestionRegalos && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button onClick={() => setMostrarGestionRegalos(false)} className="close-btn">✕</button>
            <h2 className="text-center">Gestión de Regalos</h2>
            
            <h4 className="mt-20">Crear Nuevo Regalo</h4>
            <form onSubmit={handleAgregarRegalo} className="gift-form">
                <div className="input-row">
                    <div>
                        <label className="text-muted">Nombre</label>
                        <input type="text" placeholder="Nombre" required className="auth-input" value={nuevoRegalo.nombre} onChange={e => setNuevoRegalo({...nuevoRegalo, nombre: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-muted">Icono</label>
                        <select required className="auth-input" value={nuevoRegalo.icono} onChange={e => setNuevoRegalo({...nuevoRegalo, icono: e.target.value})}>
                            <option value="⭐">⭐ Estrella</option>
                            <option value="💎">💎 Diamante</option>
                            <option value="🔥">🔥 Fuego</option>
                            <option value="👾">👾 Alien</option>
                            <option value="👏">👏 Aplausos</option>
                            <option value="☕">☕ Café</option>
                            <option value="👻">👻 Fantasma</option>
                            <option value="👑">👑 Corona</option>
                            <option value="💖">💖 Corazón</option>
                        </select>
                        <input type="text" placeholder="Ej: 💎" required className="auth-input" value={nuevoRegalo.icono} onChange={e => setNuevoRegalo({...nuevoRegalo, icono: e.target.value})} />
                    </div>
                </div>
                <div className="input-row">
                    <div>
                        <label className="text-muted">Costo (Monedas)</label>
                        <input type="number" min="1" required className="auth-input" value={nuevoRegalo.costo || ''} onChange={e => setNuevoRegalo({...nuevoRegalo, costo: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="text-muted">Puntos</label>
                        <input type="number" min="1" required className="auth-input" value={nuevoRegalo.puntos || ''} onChange={e => setNuevoRegalo({...nuevoRegalo, puntos: Number(e.target.value)})} />
                    </div>
                </div>
                <button type="submit" className="btn-neon w-100 mt-20">AÑADIR REGALO</button>
            </form>
            
            <h4 className="mt-40">Regalos Existentes ({regalos.length})</h4>
            <div className="existing-gifts-list">
                {regalos.map(regalo => (
                    <div key={regalo.id} className="gift-management-item">
                        <span className="gift-icon-small">{regalo.icono}</span>
                        <span className="gift-name">{regalo.nombre}</span>
                        <span className="gift-cost">💰 {regalo.costo}</span>
                        <button onClick={() => handleEliminarRegalo(regalo.id)} className="btn-danger-small">Eliminar</button>
                    </div>
                ))}
            </div>

          </div>
        </div>
      )}


   
      <div className="profile-header">
        <div className="profile-avatar">
            {baseUser.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
            <h1 className="profile-name">{baseUser.nombre}</h1>
            <p className="text-muted">Nivel Espectador <span className="text-neon">{nivel}</span></p>
        </div>
      </div>
      
    

      <h2 className="section-title text-center mt-40">MÉTRICAS DEL USUARIO</h2>
      
      <div className="dashboard-stats">
     
        <div className="stat-card">
          <h2 className="stat-number">{puntos.toLocaleString()}</h2>
          <p className="text-muted">Puntos (Espectador)</p>
        </div>
        
     
        <div className="stat-card money">
          <h2 className="stat-number text-neon">💰 {monedas.toLocaleString()}</h2>
          <p className="text-muted">Saldo (Recargable)</p>
          <button onClick={() => setMostrarPasarela(true)} className="btn-recargar">+ RECARGAR</button>
        </div>

     
        <div className="stat-card">
          <h2 className="stat-number">🎥 Stream</h2>
          <p className="text-muted">Empieza tu transmisión en vivo</p>

          <Link to="/mistream">
            <button className="btn-neon w-100">
               COMENZAR STREAM
            </button>
          </Link>
        </div>
        
     
        <div className="stat-card">
          <h2 className="stat-number">Nivel {nivelStreamer}</h2>
          <p className="text-muted">Nivel Streamer</p>
          <p className="text-small text-neon" style={{marginTop:'5px'}}>Faltan {horasParaSiguienteNivel}h para Nivel {nivelStreamer + 1}</p>
        </div>

      </div>

 

      <h3 className="section-title mt-40">Herramientas</h3>
      <div className="tools-grid">
   
        <div className="tool-card tool-solo">
            <h4>Gestión de Regalos (Streamer)</h4>
            <p className="text-muted">Crea, edita y elimina tus regalos personalizados.</p>
            <button onClick={() => setMostrarGestionRegalos(true)} className="btn-neon w-100">GESTIONAR REGALOS</button>
        </div>
        
        
      </div>
      
      <div className="text-center mt-40">
        <Link to="/"><button className="btn-regresar">Volver al Inicio</button></Link>
      </div>
    </div>
  );
};

export default DashboardUnificado;