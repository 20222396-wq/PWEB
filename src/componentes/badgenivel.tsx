import React from 'react';
import './BadgeNivel.css';

interface BadgeNivelProps {
  nivel: number;
  esStreamer?: boolean;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
}

const BadgeNivel: React.FC<BadgeNivelProps> = ({ 
  nivel, 
  esStreamer = false, 
  size = 'small',
  showNumber = true 
}) => {

  const getColorNivel = (nivel: number): string => {
    const colores = [
      '#6B7280',
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#F97316',
    ];
    
    if (esStreamer) return '#FFD700';
    
    if (nivel <= colores.length) {
      return colores[nivel - 1];
    }
    return '#8B5CF6';
  };

  const getIconoNivel = (nivel: number): string => {
    const iconos = ['🌱', '🌿', '🌳', '🔥', '⭐', '🌟', '💫', '👑'];
    
    if (esStreamer) return '👑';
    
    if (nivel <= iconos.length) {
      return iconos[nivel - 1];
    }
    return '👑';
  };

  const color = getColorNivel(nivel);
  const icono = getIconoNivel(nivel);
  
  const sizeClasses = {
    small: 'badge-nivel-sm',
    medium: 'badge-nivel-md',
    large: 'badge-nivel-lg'
  };

  return (
    <div 
      className={`badge-nivel ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: color,
        border: esStreamer ? '2px solid #FFD700' : 'none'
      }}
      title={`Nivel ${nivel}${esStreamer ? ' (Streamer)' : ''}`}
    >
      <span className="badge-icon">{icono}</span>
      {showNumber && <span className="badge-text">Lv.{nivel}</span>}
    </div>
  );
};

export default BadgeNivel;
