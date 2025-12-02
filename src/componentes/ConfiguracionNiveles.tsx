import React, { useState, useEffect } from 'react';
import './ConfiguracionNiveles.css';

interface NivelConfig {
  nivel: number;
  xpRequerido: number;
}

const ConfiguracionNiveles = () => {
  const [niveles, setNiveles] = useState<NivelConfig[]>([
    { nivel: 1, xpRequerido: 0 },
    { nivel: 2, xpRequerido: 100 },
    { nivel: 3, xpRequerido: 300 },
    { nivel: 4, xpRequerido: 600 },
    { nivel: 5, xpRequerido: 1000 },
  ]);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Función para actualizar XP de un nivel
  const actualizarXP = (index: number, nuevoXP: string) => {
    const xp = parseInt(nuevoXP) || 0;
    const nuevosNiveles = [...niveles];
    nuevosNiveles[index].xpRequerido = xp;
    setNiveles(nuevosNiveles);
  };

  // Validar que los niveles sean progresivos
  const validarNiveles = (): boolean => {
    for (let i = 1; i < niveles.length; i++) {
      if (niveles[i].xpRequerido <= niveles[i - 1].xpRequerido) {
        setMensaje('⚠️ Los niveles deben ser progresivos (cada nivel debe requerir más XP que el anterior)');
        return false;
      }
    }
    return true;
  };

  // Guardar configuración
  const guardarConfiguracion = async () => {
    if (!validarNiveles()) return;

    setGuardando(true);
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/streamer/configurar-niveles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ niveles })
      });

      if (res.ok) {
        setMensaje('✅ Configuración guardada correctamente');
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const data = await res.json();
        setMensaje(`❌ Error: ${data.msg}`);
      }
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  // Cargar configuración existente
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/streamer/obtener-niveles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.niveles && data.niveles.length > 0) {
            setNiveles(data.niveles);
          }
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    };

    cargarConfiguracion();
  }, []);

  return (
    <div className="config-niveles-container">
      <div className="config-header">
        <h3 className="config-title">⚙️ CONFIGURACIÓN DE NIVELES</h3>
        <p className="config-subtitle">Ajusta los puntos XP requeridos para cada nivel de tus espectadores</p>
      </div>

      <div className="niveles-grid">
        {niveles.map((nivel, index) => (
          <div key={nivel.nivel} className="nivel-item">
            <div className="nivel-badge">
              <span className="nivel-numero">NIVEL {nivel.nivel}</span>
            </div>
            <div className="nivel-input-group">
              <label htmlFor={`xp-${nivel.nivel}`}>XP Requerido:</label>
              <input
                id={`xp-${nivel.nivel}`}
                type="number"
                min="0"
                value={nivel.xpRequerido}
                onChange={(e) => actualizarXP(index, e.target.value)}
                disabled={nivel.nivel === 1}
                className="xp-input"
              />
            </div>
          </div>
        ))}
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
          {mensaje}
        </div>
      )}

      <button 
        onClick={guardarConfiguracion} 
        disabled={guardando}
        className="btn-guardar"
      >
        {guardando ? '⏳ GUARDANDO...' : '💾 GUARDAR CONFIGURACIÓN'}
      </button>

      <div className="info-box">
        <p>💡 <strong>Tip:</strong> Los espectadores ganan XP viendo tu stream, chateando y enviando regalos.</p>
        <p>📊 <strong>Vista previa:</strong> Los espectadores verán su progreso en la barra inferior del chat.</p>
      </div>
    </div>
  );
};

export default ConfiguracionNiveles;