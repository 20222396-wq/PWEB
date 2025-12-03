import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';
import ConfiguracionNiveles from '../componentes/ConfiguracionNiveles'; 
import { api } from '../api'; // Importamos la API
import type { User, Regalo } from '../types'; // Importamos tipos

const MiStream: React.FC = () => {
  // Estado del Usuario (Lo cargamos de localStorage al inicio)
  const [streamer, setStreamer] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  // Regalos ahora vienen del backend
  const [regalos, setRegalos] = useState<Regalo[]>([]);

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert' as 'alert' | 'confirm',
    title: '',
    message: '',
  });

  // Cargar Regalos Reales al iniciar
  useEffect(() => {
    const fetchDatos = async () => {
      if (streamer?.id) {
        try {
          // 1. Obtener regalos disponibles para este streamer
          const regalosData = await api.obtenerRegalos(streamer.id);
          setRegalos(regalosData);
        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      }
    };
    fetchDatos();
  }, [streamer?.id]);

  // Cronómetro del stream
  useEffect(() => {
    let interval: number | undefined;
    if (isStreaming) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartStream = async () => {
    if (!isStreaming && streamer) {
      try {
        const token = localStorage.getItem('token');
        if(!token) return alert("Inicia sesión primero");

        // Llamada al Backend para registrar el inicio
        await api.iniciarStream(streamer.name, "Stream Casual", token);
        
        setIsStreaming(true);
        setElapsedSeconds(0);
      } catch (error) {
        setModal({ isOpen: true, type: 'alert', title: 'Error', message: 'No se pudo iniciar stream' });
      }
    }
  };

  const handleStopStream = () => {
    if (!isStreaming) return;
    setIsStreaming(false);
    // Aquí podrías llamar al backend para detenerlo oficialmente
    setModal({ isOpen: true, type: 'alert', title: 'STREAM FINALIZADO', message: `Duración: ${formatTime(elapsedSeconds)}` });
  };

  // Función para ENVIAR REGALO REAL (Backend)
  const handleEnviarRegalo = async (regalo: Regalo) => {
    try {
        const token = localStorage.getItem('token');
        if (!token || !streamer) return alert("Debes iniciar sesión");

        // Llamada al backend
        const respuesta = await api.enviarRegalo(regalo.id, token);

        // Actualizamos el estado local del usuario con los nuevos saldos
        const usuarioActualizado = { 
            ...streamer, 
            coins: respuesta.nuevoSaldo, 
            points: respuesta.nuevosPuntos 
        };
        
        setStreamer(usuarioActualizado);
        localStorage.setItem('user', JSON.stringify(usuarioActualizado)); // Guardar persistencia

        setModal({
            isOpen: true, 
            type: 'alert', 
            title: '¡Regalo Enviado!', 
            message: `Has enviado ${regalo.nombre}. ${respuesta.msg}`
        });

    } catch (error: any) {
        setModal({
            isOpen: true, 
            type: 'alert', 
            title: 'Error', 
            message: error.message || 'No tienes saldo suficiente o hubo un error.'
        });
    }
  };

  if (!streamer) return <div className="text-white">Cargando perfil... (Inicia sesión de nuevo)</div>;

  return (
    <div className="stream-room-layout">
      <MiModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div className="video-column">
        {/* ... (Esta parte visual se mantiene igual) ... */}
        <div className="video-player-container">
          <h1 className="video-placeholder">{isStreaming ? 'EN DIRECTO 🔴' : 'OFFLINE ⚫'}</h1>
        </div>

        <div className="stream-info-bar">
             {/* ... Info del streamer ... */}
             <div className="stream-text-container">
                <h1 style={{ margin: '0', fontSize: '1.5rem' }}>Directo de {streamer.name}</h1>
                <p className="text-neon">Planeta Actual: {streamer.nivelStreamer || 'Desconocido'}</p>
                
                <div style={{ marginTop: '10px' }}>
                    <button className="btn-neon-compact" onClick={handleStartStream} disabled={isStreaming}>
                        INICIAR STREAM
                    </button>
                    <button className="btn-danger-small" onClick={handleStopStream} disabled={!isStreaming}>
                        DETENER
                    </button>
                    <span className="text-muted" style={{ marginLeft: '10px' }}>⏱ {formatTime(elapsedSeconds)}</span>
                </div>
             </div>
        </div>
      </div>

      <div className="chat-column">
        <div className="gifts-tab-content">
          <h3 className="section-title">Panel de Control</h3>

          <div className="dashboard-stats">
            <div className="stat-card money">
              {/* Mostramos COINS reales del backend */}
              <h2 className="stat-number text-neon">💰 {streamer.coins}</h2>
              <p className="text-muted">Monedas</p>
            </div>
            <div className="stat-card">
              {/* Mostramos POINTS reales del backend */}
              <h2 className="stat-number">{streamer.points}</h2>
              <p className="text-muted">Puntos XP</p>
            </div>
          </div>

          <ConfiguracionNiveles />

          <h4 style={{textAlign: 'center', marginTop: '20px'}}>🎁 Regalos Disponibles</h4>
          <div className="gift-grid-compact">
            {regalos.length > 0 ? (
              regalos.map((regalo) => (
                <div key={regalo.id} className="gift-card-compact">
                  <span className="gift-icon-big">{regalo.icono}</span>
                  <h4>{regalo.nombre}</h4>
                  <div className="gift-info-row-compact">
                    <span className="text-neon">💰 {regalo.costo}</span>
                    <span className="text-muted">+{regalo.puntos} XP</span>
                  </div>
                  <button 
                    onClick={() => handleEnviarRegalo(regalo)}
                    className="btn-neon-compact w-100"
                  >
                    ENVIAR
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">No hay regalos cargados.</p>
            )}
          </div>
          
          <div className="text-center mt-20">
             <Link to="/dashboard"><button className="btn-regresar">Volver</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiStream;