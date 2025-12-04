import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiModal from '../componentes/Mimodal';


const REGALOS_TIENDA_DEFAULT = [
  { id: 1, nombre: "GG Emote", costo: 10, puntos: 5, icono: "👾" },
  { id: 2, nombre: "Aplausos", costo: 50, puntos: 25, icono: "👏" },
  { id: 3, nombre: "Café Virtual", costo: 100, puntos: 50, icono: "☕" },
  { id: 4, nombre: "Resaltar Msj", costo: 200, puntos: 100, icono: "✨" },
  { id: 5, nombre: "Alerta de Terror", costo: 500, puntos: 250, icono: "👻" },
  { id: 6, nombre: "Fiesta de Bits", costo: 1000, puntos: 500, icono: "🎉" },
  { id: 7, nombre: "VIP por un mes", costo: 2500, puntos: 1500, icono: "👑" },
  { id: 8, nombre: "Suscripción Nivel 1", costo: 5000, puntos: 3000, icono: "⭐" },
];

const TiendaRegalos = () => {
  const userStr = localStorage.getItem('user');

  const baseUser = userStr ? JSON.parse(userStr) : { nombre: 'Invitado', rol: 'espectador' };
  
  const [monedas, setMonedas] = useState(baseUser.monedas !== undefined ? baseUser.monedas : 100);
  const [puntos, setPuntos] = useState(baseUser.puntos !== undefined ? baseUser.puntos : 1250);
  const [regalos, setRegalos] = useState<any[]>([]);
  
  const [modal, setModal] = useState({ isOpen: false, type: 'alert' as 'alert'|'confirm', title: '', message: '' });

  const lanzarAlerta = (title: string, msg: string, type: 'alert'|'confirm' = 'alert') => {
    setModal({ isOpen: true, type, title, message: msg });
  };

  useEffect(() => {
    const updatedUser = { ...baseUser, monedas, puntos };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [monedas, puntos]);

  useEffect(() => {
    const regalosGuardados = localStorage.getItem('regalos_db');
    if (regalosGuardados) {
        const listaParseada = JSON.parse(regalosGuardados);
        if (listaParseada.length > 0) {
          setRegalos(listaParseada);
        } else {
          setRegalos(REGALOS_TIENDA_DEFAULT);
        }
    } else {
      setRegalos(REGALOS_TIENDA_DEFAULT);
      localStorage.setItem('regalos_db', JSON.stringify(REGALOS_TIENDA_DEFAULT));
    }
  }, []);

  const handleEnviarRegalo = (regalo: any) => {
    if (monedas >= regalo.costo) {
      setMonedas((prev: number) => prev - regalo.costo);
      setPuntos((prev: number) => prev + regalo.puntos);
      lanzarAlerta("¡REGALO ENVIADO!", `Has enviado ${regalo.nombre} al streamer.\n\n💰 -${regalo.costo} Monedas\n⭐ +${regalo.puntos} Puntos`);
    } else {
      lanzarAlerta("SALDO INSUFICIENTE", `Necesitas ${regalo.costo - monedas} monedas más para comprar "${regalo.nombre}".`);
    }
  };



  const dashboardPath = baseUser.rol === 'streamer' ? '/dashboard-streamer' : '/dashboard-espectador';


  return (
    <div className="container">
      <MiModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({...modal, isOpen: false})} 
        type={modal.type} 
        title={modal.title} 
        message={modal.message} 
      />

      <div className="dashboard-header">
        <h1 className="text-neon">TIENDA DE REGALOS</h1>
        <p className="text-muted">Canjea tus monedas por interacciones épicas</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h2 className="stat-number">{puntos.toLocaleString()}</h2>
          <p className="text-muted">Mis Puntos</p>
        </div>
        <div className="stat-card money">
          <h2 className="stat-number text-neon">💰 {monedas.toLocaleString()}</h2>
          <p className="text-muted">Saldo Disponible</p>
        </div>
      </div>

      <h3 className="section-title">Catálogo Disponible</h3>
      
      <div className="gift-grid">
        {regalos.map((regalo) => (
          <div key={regalo.id} className="gift-card">
            <span className="gift-icon-big">{regalo.icono}</span>
            <h4>{regalo.nombre}</h4>
            
            <div className="gift-info-row">
              <span className={monedas >= regalo.costo ? "text-neon" : "text-muted"}>
                💰 {regalo.costo}
              </span>
              <span className="text-muted">+{regalo.puntos}pts</span>
            </div>
            
            <button 
              onClick={() => handleEnviarRegalo(regalo)} 
              className="btn-neon w-100 mt-20"
              disabled={monedas < regalo.costo}
            >
              {monedas < regalo.costo ? 'SALDO INS.' : 'COMPRAR'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-40">

        <Link to={dashboardPath}>
          <button className="btn-regresar">Volver a Mi Panel</button>
        </Link>
      </div>
    </div>
  );
};

export default TiendaRegalos;