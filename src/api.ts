import type { NivelGlobal, Regalo } from "./types";

export type ApiOptions = {
  baseUrl?: string;
  getToken?: () => string | null;
};

const DEFAULT_TIMEOUT_MS = 15000;

// Set your Render backend URL here to avoid using env vars.
// Example: https://your-service.onrender.com
export const BASE_URL = 'https://pweb-backend.onrender.com';

function getBaseUrl(options?: ApiOptions) {
  return (
    options?.baseUrl || BASE_URL || ''
  ).replace(/\/$/, '');
}

async function request<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
  options?: ApiOptions
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  const baseUrl = getBaseUrl(options);
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  const token = options?.getToken?.();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...init,
    headers,
    signal: controller.signal,
    credentials: 'include',
  });

  clearTimeout(timeout);

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (data as any)?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export type RegisterPayload = {
  nombre?: string;
  apellido?: string;
  usuario: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token?: string;
  user?: any;
  message?: string;
};

export function registerUser(payload: RegisterPayload, options?: ApiOptions) {
  return request<AuthResponse>('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, options);
}

export function login(payload: { usuario?: string; email?: string; password: string }, options?: ApiOptions) {
  return request<AuthResponse>('/api/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, options);
}

// --- NUEVAS FUNCIONES ---

// Obtener niveles globales (Planetas)
export async function obtenerNiveles(): Promise<{ success: boolean; niveles: NivelGlobal[] }> {
  return request('/api/streamer/obtener-niveles', { method: 'GET' });
}

// Obtener regalos de un streamer
export function obtenerRegalos(streamerId: string) {
  return request<Regalo[]>(`/api/regalos/${streamerId}`, { method: 'GET' });
}

// Enviar un regalo (Gastar monedas, ganar puntos)
export function enviarRegalo(regaloId: string, token: string) {
  return request<{ msg: string; nuevoSaldo: number; nuevosPuntos: number }>(
    '/api/regalos/enviar',
    {
      method: 'POST',
      body: JSON.stringify({ regaloId }),
      headers: { Authorization: `Bearer ${token}` } // Importante enviar el token
    }
  );
}

// Iniciar Stream
export function iniciarStream(usuario: string, titulo: string, token: string) {
    return request<{ msg: string; streamId: string }>(
        '/api/streams/start',
        {
            method: 'POST',
            body: JSON.stringify({ usuario, titulo, categoria: 'General' }),
            headers: { Authorization: `Bearer ${token}` }
        }
    );
}

// Recuerda exportar todo en tu objeto api
export const api = {
  // ... anteriores
  obtenerNiveles,
  obtenerRegalos,
  enviarRegalo,
  iniciarStream
};

