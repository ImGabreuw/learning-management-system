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
  // Campos de perfil estendido
  phone?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
}

// Interfaces para Disciplinas
export interface Subject {
  id: string;
  name: string;
  description: string;
  teacherUserId: string;
  studentsUserId: string[];
  occursIn: string[];
  subjectDocumentsIds: string[];
}

export interface SubjectTask {
  id: string;
  description: string;
  startAt: string;
  endAt: string;
  subjectId: string;
  studentsSubmissions: any[];
  type: string;
}

// Interfaces para Oportunidades
export interface OpportunityRequest {
  title: string;
  description: string;
  company?: string;
  location?: string;
  duration?: string;
  salary?: string;
  difficulty?: string;
  type: string;
  skills: string[];
  requirements?: string[];
}

export interface UserProfileRequest {
  userId: string;
  interests: string[];
  technicalSkills: string[];
  careerGoals: string[];
}

export interface OpportunityResponse {
  id: string;
  title: string;
  description: string;
  company?: string;
  location?: string;
  duration?: string;
  salary?: string;
  difficulty?: string;
  type: string;
  skills: string[];
  requirements?: string[];
  match?: number;
}

// Interface para Upload de Arquivo
export interface FileMetadata {
  title: string;
  description?: string;
  fileType: string;
  tags?: string[];
}

export interface FileResponse {
  id: string;
  title: string;
  description?: string;
  filename: string;
  fileType: string;
  contentType: string;
  size: number;
  tags?: string[];
  uploadedBy: string;
  uploadedAt: string;
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

// ==================== DISCIPLINAS ====================

export const getDisciplines = async (role?: 'teacher' | 'student'): Promise<Subject[]> => {
  const params = role ? `?role=${role}` : '';
  return api.get(`/api/subjects${params}`);
};

export const getDisciplineById = async (id: string): Promise<Subject> => {
  return api.get(`/api/subjects/${id}`);
};

export const getDisciplineTasks = async (subjectId: string): Promise<SubjectTask[]> => {
  return api.get(`/api/subjects/${subjectId}/tasks`);
};

export const createDiscipline = async (subject: Partial<Subject>): Promise<Subject> => {
  return api.post('/api/subjects', subject);
};

export const createTask = async (task: Partial<SubjectTask>): Promise<SubjectTask> => {
  return api.post('/api/subjects/tasks', task);
};

// ==================== USUÁRIOS ====================

export const getUserProfile = async (userId: string): Promise<User> => {
  return api.get(`/api/users/${userId}`);
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  return api.put(`/api/users/${userId}`, updates);
};

// ==================== ARQUIVOS ====================

export const uploadFile = async (file: File, metadata: FileMetadata): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro ao fazer upload: ${response.statusText}`);
  }

  return response.json();
};

export const downloadFile = async (fileId: string): Promise<Blob> => {
  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro ao baixar arquivo: ${response.statusText}`);
  }

  return response.blob();
};

export const listFiles = async (filters?: {
  title?: string;
  fileType?: string;
  tags?: string[];
  page?: number;
  size?: number;
}): Promise<{ content: FileResponse[]; totalElements: number; totalPages: number }> => {
  const params = new URLSearchParams();
  if (filters?.title) params.append('title', filters.title);
  if (filters?.fileType) params.append('fileType', filters.fileType);
  if (filters?.tags) filters.tags.forEach(tag => params.append('tags', tag));
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());

  const queryString = params.toString();
  return api.get(`/api/files${queryString ? `?${queryString}` : ''}`);
};

export const deleteFile = async (fileId: string): Promise<void> => {
  return api.delete(`/api/files/${fileId}`);
};

// ==================== OPORTUNIDADES ====================

export const getRecommendations = async (
  userId: string,
  topN: number = 10
): Promise<OpportunityResponse[]> => {
  return api.get(`/api/opportunities/recommendations/${userId}?topN=${topN}`);
};

export const saveUserProfile = async (profile: UserProfileRequest): Promise<{ id: string }> => {
  return api.post('/api/opportunities/user-profile', profile);
};

export const saveOpportunity = async (opportunity: OpportunityRequest): Promise<{ id: string }> => {
  return api.post('/api/opportunities', opportunity);
};

export const saveOpportunitiesBatch = async (
  opportunities: OpportunityRequest[]
): Promise<{ id: string }[]> => {
  return api.post('/api/opportunities/batch', opportunities);
};

// ==================== NOTIFICAÇÕES ====================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'TASK_DUE_SOON' | 'GRADE_PUBLISHED' | 'NEW_MATERIAL' | 'ANNOUNCEMENT' | 'OPPORTUNITY_MATCH' | 'GENERAL';
  read: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  return api.get('/api/notifications');
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  return api.get('/api/notifications/unread');
};

export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  return api.get('/api/notifications/count');
};

export const createNotification = async (notification: Partial<Notification>): Promise<Notification> => {
  return api.post('/api/notifications', notification);
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  return api.put(`/api/notifications/${id}/read`, {});
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  return api.put('/api/notifications/read-all', {});
};

export const deleteNotification = async (id: string): Promise<void> => {
  return api.delete(`/api/notifications/${id}`);
};

export const deleteAllNotifications = async (): Promise<void> => {
  return api.delete('/api/notifications');
};
