// web/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('refreshToken');
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}

export function removeAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Interface para os dados do usuário vindos do backend
// Baseado em CurrentUserResponse.java
export interface User {
  id: string; // O backend não envia o ID, mas o email é o username
  email: string;
  name: string;
  roles: string[];
  enabled: boolean;
  lastLoginAt: string | null;
}

/**
 * Cliente de API centralizado
 * A Etapa 2 (plano futuro) adicionará interceptors de refresh token aqui.
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Se o token for inválido (401), a Etapa 2 cuidará do refresh.
    // Por agora, apenas lançamos o erro.
    if (response.status === 401) {
      console.error('API Fetch: Não autorizado (401)');
      // Em uma implementação completa, isso dispararia o refresh token.
      // Por enquanto, vamos deslogar o usuário se isso acontecer.
      removeAuthTokens();
      window.location.href = '/login'; // Redireciona para o login
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro na API: ${response.statusText}`);
  }

  // Se a resposta for 204 No Content (ex: Logout), não há JSON para parsear
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Funções de API específicas
export const api = {
  get: (endpoint: string, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body: any, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: (endpoint: string, body: any, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  delete: (endpoint: string, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }),
};