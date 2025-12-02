import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';
import ConfiguracionNiveles from '../componentes/ConfiguracionNiveles'; 

const REGALOS_DEFAULT = [
  { id: 1, nombre: "GG Emote", costo: 10, puntos: 5, icono: "👾" },
  { id: 2, nombre: "Corazón", costo: 50, puntos: 25, icono: "💖" },
  { id: 3, nombre: "Diamante", costo: 100, puntos: 50, icono: "💎" },
];

const MAX_STREAM_LEVEL = 4;
const HOURS_PER_LEVEL = 40; 

const MiStream: React.FC = () => {
  const userStr = localStorage.getItem('user');
  const initialUser = userStr
    ? JSON.parse(userStr)
    : { nombre: 'Invitado', monedas: 0, puntos: 0, nivel: 1, horas: 0, nivelStreamer: 1 };

  const [streamer, setStreamer] = useState(initialUser);

  const [horasBase, setHorasBase] = useState<number>(initialUser.horas || 0);
  const [nivelStreamer, setNivelStreamer] = useState<number>(
    initialUser.nivelStreamer || 1
  );

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const [regalos, setRegalos] = useState<any[]>(REGALOS_DEFAULT);

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert' as 'alert' | 'confirm',
    title: '',
    message: '',
  });

  const lanzarAlerta = (
    title: string,
    msg: string,
    type: 'alert' | 'confirm' = 'alert'
  ) => {
    setModal({ isOpen: true, type, title, message: msg });
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isStreaming) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev: number) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isStreaming]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  useEffect(() => {
    const regalosGuardados = localStorage.getItem('regalos_db');
    if (regalosGuardados) {
      setRegalos(JSON.parse(regalosGuardados));
    }
  }, []);

  const handleStartStream = () => {
    if (!isStreaming) {
      setIsStreaming(true);
      setElapsedSeconds(0); 
    }
  };

  const handleStopStream = () => {
    if (!isStreaming) return;

    setIsStreaming(false);

    const hoursFromSession = elapsedSeconds / 3600;
    const nuevasHoras = horasBase + hoursFromSession;

    const baseIndex = Math.min(
      MAX_STREAM_LEVEL - 1,
      Math.floor(nuevasHoras / HOURS_PER_LEVEL)
    );
    const nuevoNivel = baseIndex + 1;

    const updated = {
      ...streamer,
      horas: nuevasHoras,
      nivelStreamer: nuevoNivel,
    };

    setStreamer(updated);
    setHorasBase(nuevasHoras);
    setNivelStreamer(nuevoNivel);
    setElapsedSeconds(0);

    localStorage.setItem('user', JSON.stringify(updated));

    lanzarAlerta(
      'STREAM FINALIZADO',
      `Has transmitido ${hoursFromSession.toFixed(
        2
      )} horas en esta sesión. Total acumulado: ${nuevasHoras.toFixed(
        2
      )} horas.`
    );
  };

  const totalHoursNow = horasBase + elapsedSeconds / 3600;

  const levelIndex = Math.min(
    MAX_STREAM_LEVEL - 1,
    Math.floor(totalHoursNow / HOURS_PER_LEVEL)
  );
  const currentLevelDisplay = levelIndex + 1;
  const isMaxLevel = currentLevelDisplay >= MAX_STREAM_LEVEL;

  const hoursAtLevelStart = levelIndex * HOURS_PER_LEVEL;
  const hoursIntoCurrentLevel = Math.min(
    HOURS_PER_LEVEL,
    totalHoursNow - hoursAtLevelStart
  );

  const hoursToNextLevel = isMaxLevel
    ? 0
    : HOURS_PER_LEVEL - hoursIntoCurrentLevel;

  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, (hoursIntoCurrentLevel / HOURS_PER_LEVEL) * 100);

  const handleSimularRegalo = (regalo: any) => {
    const nuevosPuntos = (streamer.puntos || 0) + regalo.puntos;
    const updated = { ...streamer, puntos: nuevosPuntos };

    setStreamer(updated);
    localStorage.setItem('user', JSON.stringify(updated));

    lanzarAlerta(
      '🎁 REGALO RECIBIDO',
      `Han enviado ${regalo.nombre} a tu stream. ¡Has ganado +${regalo.puntos} puntos!`
    );
  };

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
        <div className="video-player-container">
          <h1 className="video-placeholder">
            {isStreaming ? 'EN DIRECTO' : 'STREAM APAGADO'}
          </h1>
        </div>

        <div className="stream-info-bar">
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <div
              className="profile-avatar"
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              {streamer.nombre?.charAt(0).toUpperCase() || 'S'}
            </div>

            <div className="stream-text-container">
              <h1 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>
                Directo de {streamer.nombre || 'Invitado'}
              </h1>

              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <span className="text-neon bold">{streamer.nombre}</span>
                <span className="category-tag">IRL</span>
                <span className="text-muted">
                  • {isStreaming ? 'En vivo ahora mismo' : 'Offline'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
              >
                <button
                  className="btn-neon-compact"
                  onClick={handleStartStream}
                  disabled={isStreaming}
                >
                  INICIAR STREAM
                </button>
                <button
                  className="btn-danger-small"
                  onClick={handleStopStream}
                  disabled={!isStreaming}
                >
                  DETENER STREAM
                </button>
                <span
                  className="text-muted"
                  style={{ marginLeft: '8px', fontWeight: 600 }}
                >
                  ⏱ {formatTime(elapsedSeconds)}{' '}
                  {isStreaming ? '(En vivo)' : '(Detenido)'}
                </span>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div className="progress-bar-container-compact">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Nivel Streamer: {currentLevelDisplay}/{MAX_STREAM_LEVEL} ·
                  Horas totales: {totalHoursNow.toFixed(1)}h{' '}
                  {isMaxLevel
                    ? '· Nivel máximo alcanzado 🎉'
                    : `· Faltan ${hoursToNextLevel.toFixed(
                        1
                      )}h para Nivel ${currentLevelDisplay + 1}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-column">
        <div className="gifts-tab-content">
          <h3
            className="section-title"
            style={{ borderBottom: 'none', marginBottom: '10px' }}
          >
            Panel de Streamer
          </h3>

          <div className="dashboard-stats" style={{ marginBottom: '20px' }}>
            <div className="stat-card money">
              <h2 className="stat-number text-neon">
                💰 {streamer.monedas?.toLocaleString() || 0}
              </h2>
              <p className="text-muted">Monedas disponibles</p>
            </div>

            <div className="stat-card">
              <h2 className="stat-number">
                {streamer.puntos?.toLocaleString() || 0}
              </h2>
              <p className="text-muted">Puntos acumulados</p>
            </div>
          </div>

          <h4 style={{ textAlign: 'center', marginTop: '10px' }}>
            🎁 Regalos configurados
          </h4>
          <p
            className="text-muted"
            style={{ textAlign: 'center', fontSize: '0.9rem' }}
          >
            Estos son los regalos que tus espectadores pueden enviarte desde la
            sala de stream.
          </p>
          {/* ⭐ AQUÍ VA LA NUEVA SECCIÓN */}
<ConfiguracionNiveles />

          <div className="gift-grid-compact">
            {regalos.length > 0 ? (
              regalos.map((regalo) => (
                <div key={regalo.id} className="gift-card-compact">
                  <span className="gift-icon-big">{regalo.icono}</span>
                  <h4>{regalo.nombre}</h4>
                  <div className="gift-info-row-compact">
                    <span className="text-neon">💰 {regalo.costo}</span>
                    <span className="text-muted">+{regalo.puntos} pts</span>
                  </div>

                  <button
                    onClick={() => handleSimularRegalo(regalo)}
                    className="btn-neon-compact w-100"
                  >
                    SIMULAR REGALO
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">
                Aún no has configurado regalos. Crea regalos en tu Dashboard.
              </p>
            )}
          </div>

          <div className="text-center mt-20">
            <Link to="/dashboard">
              <button className="btn-regresar">Volver a tu Perfil</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiStream;
