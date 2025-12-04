import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';

interface MensajeChat {
  user: string;
  text: string;
  color: string;
  nivel?: number;     
  puntos?: number;    
  esStreamer?: boolean; 
}

interface UsuarioChat {
  nombre: string;
  nivel: number;
  puntos: number;
  color: string;
  esStreamer?: boolean;
}

const NIVELES_DEFAULT = [
  { nivel: 1, puntos: 0 },     
  { nivel: 2, puntos: 100 },   
  { nivel: 3, puntos: 300 },   
  { nivel: 4, puntos: 600 },    
  { nivel: 5, puntos: 1000 },  
];

const COFRE_REWARD = 15;

const STREAMS_FAKE = [
  { id: 1, titulo: "Juegos Retro y Chill", usuario: "FrankStream", categoria: "Gaming", viewers: 520, avatar: "🎮" },
  { id: 2, titulo: "Diseño Web Avanzado con React", usuario: "CodeMaster", categoria: "Tech", viewers: 1200, avatar: "💻" },
  { id: 3, titulo: "Cocina Rápida y Fácil", usuario: "ChefEmi", categoria: "Food", viewers: 350, avatar: "🍳" },
];

const StreamRoom = () => {
  const { id } = useParams();

  const storageKeyChat = `chat_stream_${id}`;

  const [activeTab, setActiveTab] = useState('chat'); 
  const [mensaje, setMensaje] = useState("");

  const [chat, setChat] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const guardado = localStorage.getItem(storageKeyChat);
        if (guardado) {
          const parsed = JSON.parse(guardado);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.error("Error leyendo chat de localStorage:", error);
    }
    return [
      { user: "StreamZone Bot", text: "Bienvenido al stream!", color: "#00ff41" },
    ];
  });

  const userStr = (typeof window !== "undefined") ? localStorage.getItem('user') : null;
  const initialViewer = userStr ? JSON.parse(userStr) : null;
  const [viewer, setViewer] = useState(initialViewer);

  const [puntos, setPuntos] = useState(initialViewer?.puntos || 0);
  const [nivel, setNivel] = useState(initialViewer?.nivel || 1);
  const [nivelesConfig, setNivelesConfig] = useState(NIVELES_DEFAULT);

  const [regalos, setRegalos] = useState([
    { id: 1, nombre: "GG Emote", costo: 10, puntos: 5, icono: "👾" },
  ]);

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert' as 'alert' | 'confirm',
    title: '',
    message: ''
  });

  const [cofreTimer, setCofreTimer] = useState(10);
  const [cofreReady, setCofreReady] = useState(false);

  useEffect(() => {
    const nivelesDB = localStorage.getItem('niveles_db');
    if (nivelesDB) setNivelesConfig(JSON.parse(nivelesDB));

    const regalosGuardados = localStorage.getItem('regalos_db');
    if (regalosGuardados) setRegalos(JSON.parse(regalosGuardados));
  }, []);

  useEffect(() => {
    try {
      if (chat && chat.length > 0) {
        localStorage.setItem(storageKeyChat, JSON.stringify(chat));
      }
    } catch (error) {
      console.error("Error guardando chat en localStorage:", error);
    }
  }, [chat, storageKeyChat]);

  useEffect(() => {
    if (!viewer) {
      setCofreTimer(10);
      setCofreReady(false);
      return;
    }

    if (cofreReady) return;

    const interval = setInterval(() => {
      setCofreTimer(prev => {
        if (prev <= 1) {
          setCofreReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [viewer, cofreReady]);

  const handleEnviarChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() || !viewer) return;

    const pointsGained = 1;
    let newPuntos = puntos + pointsGained;
    let newNivel = nivel;
    let leveledUp = false;

    const nextLevelReq = nivelesConfig.find(n => n.nivel === nivel + 1);

    if (nextLevelReq && newPuntos >= nextLevelReq.puntos) {
      newNivel = nextLevelReq.nivel; 
      leveledUp = true;
    }

    setPuntos(newPuntos);
    setNivel(newNivel);

    const updatedViewer = { ...viewer, puntos: newPuntos, nivel: newNivel };
    localStorage.setItem('user', JSON.stringify(updatedViewer));
    setViewer(updatedViewer);

    const color = leveledUp ? "#00ff41" : "#ffffff";
    const nuevoMensaje = { user: viewer.nombre, text: mensaje, color: color };
    setChat(prev => [...prev, nuevoMensaje]); 
    setMensaje("");

    if (leveledUp) {
      setModal({
        isOpen: true,
        type: 'alert',
        title: "¡SUBIDA DE NIVEL!",
        message: `🎉 ¡Felicidades, ${viewer.nombre}, has alcanzado el Nivel ${newNivel}!`,
      });
    }
  };

  const handleCambioPuntos = (nivelId: number, nuevosPuntos: string) => {
    if (nivelId === 1) return;

    const nuevosNiveles = nivelesConfig.map(n =>
      n.nivel === nivelId
        ? { ...n, puntos: Math.max(0, Number(nuevosPuntos)) }
        : n
    );
    setNivelesConfig(nuevosNiveles);
  };

  const guardarNiveles = () => {
    localStorage.setItem('niveles_db', JSON.stringify(nivelesConfig));
    setModal({
      isOpen: true,
      type: 'alert',
      title: "CONFIGURACIÓN GUARDADA",
      message: "La progresión de niveles ha sido actualizada.",
    });
  };

  
  const reclamarCofre = () => {
    if (!viewer || !cofreReady) return;

    const newPuntos = puntos + COFRE_REWARD;
    let newNivel = nivel;
    let leveledUp = false;

    const nextLevelReq = nivelesConfig.find(n => n.nivel === nivel + 1);
    if (nextLevelReq && newPuntos >= nextLevelReq.puntos) {
      newNivel = nextLevelReq.nivel;
      leveledUp = true;
    }

    setPuntos(newPuntos);
    setNivel(newNivel);

    const updatedViewer = { ...viewer, puntos: newPuntos, nivel: newNivel };
    localStorage.setItem('user', JSON.stringify(updatedViewer));
    setViewer(updatedViewer);

    let message = `Has ganado +${COFRE_REWARD} puntos.`;
    if (leveledUp) {
      message += ` 🎉 ¡Y has subido al Nivel ${newNivel}!`;
    }

    setModal({
      isOpen: true,
      type: "alert",
      title: "¡COFRE RECLAMADO!",
      message,
    });

    setCofreReady(false);
    setCofreTimer(10);
  };

  const handleEnviarRegalo = (regalo: any) => {
    if (!viewer) {
      setModal({
        isOpen: true,
        type: 'alert',
        title: "ERROR",
        message: "Debes iniciar sesión para enviar regalos.",
      });
      return;
    }
    if (viewer.monedas >= regalo.costo) {
      const newMonedas = viewer.monedas - regalo.costo;
      let newPuntos = puntos + regalo.puntos;
      let newNivel = nivel;
      let leveledUp = false;

      const nextLevelReq = nivelesConfig.find(n => n.nivel === nivel + 1);
      if (nextLevelReq && newPuntos >= nextLevelReq.puntos) {
        newNivel = nextLevelReq.nivel;
        leveledUp = true;
      }

      setPuntos(newPuntos);
      setNivel(newNivel);

      const updatedViewer = { ...viewer, monedas: newMonedas, puntos: newPuntos, nivel: newNivel };
      localStorage.setItem('user', JSON.stringify(updatedViewer));
      setViewer(updatedViewer);

      setChat(prev => [
        ...prev,
        { user: `${viewer.nombre} 🎁`, text: `¡Ha enviado ${regalo.nombre}!`, color: "#ff8c00" }
      ]);

      const extraMsg = leveledUp ? ` 🎉 ¡Y has subido al Nivel ${newNivel}!` : '';
      setModal({
        isOpen: true,
        type: 'alert',
        title: "¡REGALO ENVIADO!",
        message: `Has enviado ${regalo.nombre} a ${stream?.usuario}. -${regalo.costo} monedas. +${regalo.puntos} XP.${extraMsg}`,
      });

    } else {
      setModal({
        isOpen: true,
        type: 'alert',
        title: "SALDO INSUFICIENTE",
        message: `Necesitas ${regalo.costo - viewer.monedas} monedas más para enviar este regalo.`,
      });
    }
  };

  const stream = STREAMS_FAKE.find(s => s.id.toString() === id);
  if (!stream)
    return (
      <div className="container text-center mt-40">
        <h1>Stream no encontrado 😕</h1>
        <Link to="/"><button className="btn-regresar">Volver</button></Link>
      </div>
    );

  const currentLevelThresholdEntry = nivelesConfig.find(n => n.nivel === nivel);
  const currentLevelThreshold = currentLevelThresholdEntry ? currentLevelThresholdEntry.puntos : 0;

  const nextLevelThresholdEntry = nivelesConfig.find(n => n.nivel === nivel + 1);
  const isMaxLevel = !nextLevelThresholdEntry;

  const nextLevelThreshold = isMaxLevel ? puntos : nextLevelThresholdEntry!.puntos;

  const pointsGainedInCurrentLevel = puntos - currentLevelThreshold;
  const pointsNeededForCurrentLevel = nextLevelThreshold - currentLevelThreshold;

  let progressPercent = 0;
  let pointsGoalToDisplay = pointsNeededForCurrentLevel;
  let pointsToDisplay = pointsGainedInCurrentLevel;

  if (isMaxLevel) {
    progressPercent = 100;
    pointsGoalToDisplay = puntos;
    pointsToDisplay = puntos;
  } else if (pointsNeededForCurrentLevel > 0) {
    progressPercent = Math.min(100, (pointsGainedInCurrentLevel / pointsNeededForCurrentLevel) * 100);
  } else {
    progressPercent = 0;
  }

  if (pointsToDisplay < 0) pointsToDisplay = 0;

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
          <h1 className="video-placeholder">EN VIVO: {stream.titulo}</h1>
        </div>

        <div className="stream-info-bar">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
            <div className="profile-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', flexShrink: 0 }}>
              {stream.avatar}
            </div>
            <div className="stream-text-container">
              <h1 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{stream.titulo}</h1>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="text-neon bold">{stream.usuario}</span>
                <span className="category-tag">{stream.categoria}</span>
                <span className="text-muted">• {stream.viewers} espectadores</span>
              </div>
            </div>
          </div>

          {viewer && (
            <div className="viewer-progression-compact">

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-neon bold" style={{ fontSize: '0.9rem' }}>Nivel {nivel}</span>

                <div className="progress-bar-container-compact">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>

                <span className="text-muted" style={{ fontSize: '0.8rem', minWidth: '50px' }}>
                  XP: {pointsToDisplay} / {pointsGoalToDisplay}
                </span>
              </div>

              <div style={{ marginTop: '6px', textAlign: 'center' }}>
                <span className="text-neon bold" style={{ fontSize: '0.9rem' }}>
                  💰 {viewer.monedas} monedas
                </span>
              </div>

              <div
                onClick={reclamarCofre}
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: cofreReady ? "rgba(255, 215, 0, 0.25)" : "rgba(255, 215, 0, 0.08)",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid gold",
                  cursor: cofreReady ? "pointer" : "not-allowed",
                  opacity: cofreReady ? 1 : 0.5,
                  transition: "0.3s"
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>
                  {cofreReady ? "🧰✨" : "🧰"}
                </span>
                <span className="text-neon bold" style={{ fontSize: "0.85rem" }}>
                  {cofreReady
                    ? `Haz click para reclamar +${COFRE_REWARD} XP`
                    : `Cofre en: ${cofreTimer}s`}
                </span>
              </div>

            </div>
          )}

        </div>
      </div>

      <div className="chat-column">

        <div className="chat-tabs">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            CHAT
          </button>
          <button
            className={`tab-button ${activeTab === 'gifts' ? 'active' : ''}`}
            onClick={() => setActiveTab('gifts')}
          >
            🎁 REGALOS
          </button>
         
          {stream.usuario === viewer?.nombre && (
            <button
              className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
              onClick={() => setActiveTab('config')}
            >
              ⚙️ CONFIG
            </button>
          )}
        </div>

        {activeTab === 'chat' && (
          <>
            <div className="chat-messages">
              {chat.map((msg, index) => (
                <p key={index} className="chat-message">
                  <span className="chat-username" style={{ color: msg.color }}>{msg.user}:</span> {msg.text}
                </p>
              ))}
            </div>
            <div className="chat-input-area">
              <form onSubmit={handleEnviarChat}>
                <input
                  type="text"
                  placeholder={viewer ? "Escribe un mensaje para subir de nivel..." : "Debes iniciar sesión para chatear."}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="chat-input"
                  disabled={!viewer}
                />
                <button type="submit" className="btn-chat" disabled={!viewer}>➤</button>
              </form>
            </div>
          </>
        )}

        {activeTab === 'gifts' && (
          <div className="gifts-tab-content">
            <h4 style={{ textAlign: 'center', marginTop: '10px' }}>Tienda de Regalos</h4>
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Apoya al streamer y gana puntos.</p>
            <div className="gift-grid-compact">
              {regalos.length > 0 ? (
                regalos.map((regalo) => (
                  <div key={regalo.id} className="gift-card-compact">
                    <span className="gift-icon-big">{regalo.icono}</span>
                    <h4>{regalo.nombre}</h4>
                    <div className="gift-info-row-compact">
                      <span className="text-neon">💰 {regalo.costo}</span>
                      <span className="text-muted">+{regalo.puntos}pts</span>
                    </div>
                    <button
                      onClick={() => handleEnviarRegalo(regalo)}
                      className="btn-neon-compact w-100"
                      disabled={!viewer || viewer.monedas < regalo.costo}
                    >
                      ENVIAR
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Este streamer aún no tiene regalos configurados.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'config' && stream.usuario === viewer?.nombre && (
          <div className="config-tab-content">
            <h3 className="section-title" style={{ borderBottom: 'none' }}>⚙️ Configurar Progresión</h3>
            <p className="text-muted" style={{ textAlign: 'center', padding: '0 15px' }}>
              Establece la cantidad de puntos de chat para cada nivel de espectador.
            </p>
            <div className="level-config-box-stream">
              {nivelesConfig.map((n) => (
                <div key={n.nivel} className="level-row">
                  <label className="text-neon bold">NIVEL {n.nivel}</label>
                  <div className="level-input-group">
                    <input
                      type="number"
                      value={n.puntos}
                      onChange={(e) => handleCambioPuntos(n.nivel, e.target.value)}
                      className="auth-input input-small"
                      min={n.nivel > 1 ? (nivelesConfig.find(prev => prev.nivel === n.nivel - 1)?.puntos || 0) + 1 : "0"}
                      disabled={n.nivel === 1}
                    />
                    <span className="text-muted">pts (acumulados)</span>
                  </div>
                </div>
              ))}
              <button onClick={guardarNiveles} className="btn-neon w-100 mt-20">GUARDAR CONFIGURACIÓN</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StreamRoom;
