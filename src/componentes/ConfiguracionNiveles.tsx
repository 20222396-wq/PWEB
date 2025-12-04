import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './ConfiguracionNiveles.css';
import type { NivelGlobal } from '../types';

const ConfiguracionNiveles = () => {
  const [niveles, setNiveles] = useState<NivelGlobal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        const data = await api.obtenerNiveles();
        if (data && data.niveles) {
          setNiveles(data.niveles);
        }
      } catch (error) {
        console.error('Error al cargar niveles:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarNiveles();
  }, []);

  return (
    <div className="config-niveles-container">
      <div className="config-header">
        <h3 className="config-title">🪐 SISTEMA DE NIVELES GLOBAL (PLANETAS)</h3>
        <p className="config-subtitle">Avanza por el sistema solar consiguiendo puntos.</p>
      </div>

      {loading ? (
        <p>Cargando sistema solar...</p>
      ) : (
        <div className="niveles-grid">
          {niveles.map((nivel) => (
            <div key={nivel.id} className="nivel-item" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {nivel.image && <img src={nivel.image} alt={nivel.nombre} style={{width: '50px', marginBottom: '10px'}} />}
              <div className="nivel-badge">
                <span className="nivel-numero">{nivel.nombre.toUpperCase()}</span>
              </div>
              <div className="nivel-info">
                <p><strong>XP Requerido:</strong> {nivel.puntosRequeridos}</p>
                {nivel.recompensa && <p className="recompensa">🏆 {nivel.recompensa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <p>💡 <strong>Info:</strong> Estos niveles son globales para toda la plataforma. ¡Compite por llegar a Neptuno!</p>
      </div>
    </div>
  );
};

export default ConfiguracionNiveles;