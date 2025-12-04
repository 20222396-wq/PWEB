// src/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  coins: number;      // Antes 'monedas' (en tabla separada), ahora directo
  points: number;
  nivelStreamer?: string; // Nombre del planeta (ej: "Tierra")
  currentLevelId?: string;
}

export interface NivelGlobal {
  id: string;
  nombre: string;     // Mercurio, Venus...
  puntosRequeridos: number;
  image?: string;
  recompensa?: string;
}

export interface Regalo {
  id: string;
  nombre: string;
  costo: number;
  puntos: number;
  icono: string;
  streamerId: string;
}

export interface StreamResponse {
  msg: string;
  streamId: string;
}