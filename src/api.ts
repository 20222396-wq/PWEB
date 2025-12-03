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

export const api = {
  registerUser,
  login,
};

