import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const STREAMS_FAKE = [
  { id: 1, usuario: "ElRubius", titulo: "TORNEO DE MINECRAFT EXTREMO 🔥", categoria: "Minecraft", tipo: "Juegos", viewers: "45.2k", avatar: "R", color: "#ff0000", isReal: false },
  { id: 2, usuario: "Ibai", titulo: "Charlando con la comunidad y viendo memes", categoria: "Just Chatting", tipo: "IRL", viewers: "80.1k", avatar: "I", color: "#aaff00", isReal: false },
  { id: 3, usuario: "AuronPlay", titulo: "GTA V Roleplay - El regreso", categoria: "GTA V", tipo: "Juegos", viewers: "110k", avatar: "A", color: "#00ffff", isReal: false },
  { id: 4, usuario: "Rivers", titulo: "Jugando Valorant hasta subir a Radiante", categoria: "Valorant", tipo: "Juegos", viewers: "22k", avatar: "R", color: "#ff00ff", isReal: false },
  { id: 5, usuario: "Spreen", titulo: "Speedrun de todo lo que encuentre", categoria: "Varios", tipo: "Juegos", viewers: "35k", avatar: "S", color: "#ffff00", isReal: false },
  { id: 6, usuario: "IlloJuan", titulo: "Probando juegos de PS1 nostálgicos", categoria: "Retro", tipo: "Juegos", viewers: "18k", avatar: "J", color: "#00ff41", isReal: false },
  { id: 7, usuario: "JordiWild", titulo: "The Wild Project: Debate en vivo", categoria: "Podcast", tipo: "IRL", viewers: "50k", avatar: "W", color: "#ff4444", isReal: false },
];

export const Inicio = () => {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [listaStreams, setListaStreams] = useState<any[]>(STREAMS_FAKE);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch('https://pweb-backend.onrender.com/api/streams');
        const streamsReales = await res.json();
        setListaStreams([...streamsReales, ...STREAMS_FAKE]);
      } catch (error) {
        console.error("Error cargando streams:", error);
      }
    };
    
    fetchStreams();
    const intervalo = setInterval(fetchStreams, 5000); // Refrescar cada 5s
    return () => clearInterval(intervalo);
  }, []);

  const streamsVisibles = filtroActivo === 'Todos' 
    ? listaStreams 
    : listaStreams.filter(s => s.tipo === filtroActivo || s.categoria === filtroActivo);

  return (
    <div className="full-width">
      

      <div className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">DESTACADO</span>
          <h1 className="hero-title">LA VELADA DEL AÑO</h1>
          <p className="hero-subtitle">El evento más grande de boxeo entre streamers.</p>
          <button className="btn-neon btn-hero">VER AHORA</button>
        </div>
      </div>

      <div className="container">

        <div className="filters-container">
          {['Todos', 'Juegos', 'IRL', 'Minecraft', 'Podcast'].map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setFiltroActivo(cat)}
              className={`btn-filter ${filtroActivo === cat ? "btn-neon" : "btn-secondary"}`}
            >
              {cat}
            </button>
          ))}
        </div>


        <div className="grid-header">
          <h2 className="text-neon no-margin">
            {filtroActivo === 'Todos' ? 'Canales Recomendados' : `Resultados: ${filtroActivo}`}
          </h2>
          <span className="text-muted text-small">{streamsVisibles.length} canales</span>
        </div>


        <div className="stream-grid">
          {streamsVisibles.length > 0 ? (
            streamsVisibles.map((stream) => (
              <Link to={`/stream/${stream.id}`} key={stream.id} className="link-reset">

                <div className={`stream-card ${stream.isReal ? 'stream-card-real' : ''}`}>
                  
                  <div className="stream-thumbnail">

                    <div 
                      className="thumb-gradient" 
                      style={{ background: `linear-gradient(45deg, #111, ${stream.color || '#00ff41'}40)` }}
                    ></div>
                    
                    <span className="live-badge" style={{position: 'absolute', top: '10px', left: '10px'}}>EN VIVO</span>
                    <div className="viewer-count">
                      <span className="dot-live"></span> {stream.viewers}
                    </div>
                  </div>

                  <div className="stream-info">
                    <div className="stream-avatar">
                      {stream.avatar}
                    </div>
                    <div className="stream-text">
                      <h4 className="stream-title">{stream.titulo}</h4>
                      <p className="stream-user">{stream.usuario}</p>
                      <span className="stream-category">{stream.categoria}</span>
                    </div>
                  </div>

                </div>
              </Link>
            ))
          ) : (
            <div className="text-center w-100 text-muted">No hay streams en esta categoría :(</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Nosotros = () => {
    return (
        <div className="container text-center">
            <h1 className="section-title">NUESTRO EQUIPO</h1>
            <p className="text-muted mb-20">Desarrolladores apasionados por el streaming.</p>
            <div className="gift-grid">
              {['Cesar Alegre Flores', 'Oscar Meza', 'Franco Calderon', 'Rodrigo Sarria', 'Angelo Diaz'].map((dev, i) => (
                <div key={i} className="gift-card">
                  <div className="profile-avatar" style={{margin:'0 auto 15px'}}>{dev.charAt(0)}</div>
                  <h4>{dev}</h4>
                  <p className="text-muted">StreamZone@gmail.com</p>
                  <p className="text-muted">Full Stack Developer</p>
                </div>
              ))}
            </div>
            <Link to="/"><button className="btn-regresar">Volver al Inicio</button></Link>
        </div>
    );
};

export const TyC = () => (
  <div className="container">
    <h1 className="section-title">Términos y Condiciones</h1>
    <div className="form-box text-center">
      <div className="tyc-placeholder">
        <img src="Normas.jpeg" alt="Error" />
      </div>
      <div className="tyc-content text-muted">
        <p>1. El respeto es fundamental en el chat. No se toleran insultos ni conductas ofensivas.</p> 
        <p>2. No se permite contenido prohibido, violento o protegido por derechos de autor.</p>
        <p>3. Las monedas y compras dentro de la plataforma no son reembolsables.</p> 
        <p>4. Prohibido el acoso, discriminación o amenazas hacia cualquier usuario o creador.</p> 
        <p>5. No se permite compartir información personal propia o de terceros.</p> 
        <p>6. Está prohibido realizar spam, publicidad no autorizada o enviar enlaces maliciosos.</p> 
        <p>7. No se permite transmitir contenido sexual explícito, actos peligrosos o actividades ilegales.</p>
        <p>8. Los creadores son responsables del contenido que transmiten y del comportamiento de su chat.</p>
        <p>9. Se prohíbe el uso de bots, hacks o cualquier herramienta que afecte el funcionamiento de la plataforma.</p>
        <p>10. Las cuentas que infrinjan las normas pueden ser suspendidas o eliminadas sin previo aviso.</p> 
        <p>11. Los menores deben estar acompañados por un adulto si aparecen en transmisiones.</p> 
        <p>12. El uso de música o videos requiere autorización o derechos correspondientes.</p> 
        <p>13. La plataforma puede aplicar sanciones si detecta conductas fraudulentas o engañosas.</p>
        <p>14. El chat debe mantenerse limpio: no se permite lenguaje NSFW, gore o contenido perturbador.</p> 
        <p>15. La plataforma puede actualizar las reglas en cualquier momento; el uso continuo implica aceptación.</p>
        
      </div>
    </div>
    <div className="text-center"><Link to="/"><button className="btn-regresar">Regresar</button></Link></div>
  </div>
);