# Exemplo de Uso - Autenticação Metis

## 1. Protegendo uma Página no Frontend

```tsx
// app/dashboard/page.tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Bem-vindo, {user?.name}!</p>
        <p>Suas roles: {user?.roles.join(', ')}</p>
      </div>
    </ProtectedRoute>
  );
}
```

## 2. Página Apenas para Admins

```tsx
// app/admin/page.tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
        <p>Apenas administradores podem ver esta página</p>
      </div>
    </ProtectedRoute>
  );
}
```

## 3. Botão de Logout

```tsx
// components/Header.tsx
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Metis LMS</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
```

## 4. Fazendo Requisições Autenticadas

```tsx
// app/courses/page.tsx
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await api.get('/api/courses');
        setCourses(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Meus Cursos</h1>
        
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="border p-4 rounded-lg">
                <h2 className="font-bold">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

## 5. Endpoint com Controle de Acesso (Backend)

```java
// backend/src/main/java/com/metis/backend/api/CourseResource.java
package com.metis.backend.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseResource {

    // Qualquer usuário autenticado pode listar cursos
    @GetMapping
    public ResponseEntity<List<CourseDTO>> listCourses(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // userDetails contém o usuário autenticado
        String email = userDetails.getUsername();
        // ... buscar cursos do usuário
        return ResponseEntity.ok(courses);
    }

    // Apenas professores podem criar cursos
    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR') or hasRole('ADMIN')")
    public ResponseEntity<CourseDTO> createCourse(
            @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // ... criar curso
        return ResponseEntity.ok(course);
    }

    // Apenas admins podem deletar cursos
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        // ... deletar curso
        return ResponseEntity.noContent().build();
    }
}
```

## 6. Mostrando Conteúdo Baseado em Roles

```tsx
// components/CourseCard.tsx
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const { user } = useAuth();

  const canEdit = user?.roles.includes('ROLE_PROFESSOR') || user?.roles.includes('ROLE_ADMIN');
  const canDelete = user?.roles.includes('ROLE_ADMIN');

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="font-bold">{course.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{course.description}</p>

      <div className="flex gap-2">
        {canEdit && (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
        
        {canDelete && (
          <Button size="sm" variant="destructive">
            <Trash className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        )}
      </div>
    </div>
  );
}
```

## 7. Configurando Admins

```yaml
# backend/src/main/resources/application-dev.yaml
metis:
  auth:
    admin-emails:
      - admin@mackenzie.br
      - coordenador@mackenzie.br
      - diretor@mackenzie.br
```

Usuários com esses emails automaticamente recebem a role `ROLE_ADMIN`.

## 8. Criando um Middleware de Autorização Customizado

```java
// backend/src/main/java/com/metis/backend/auth/annotation/RequireOwnership.java
package com.metis.backend.auth.annotation;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireOwnership {
    String resourceParam() default "id";
    String ownerField() default "userId";
}
```

```java
// backend/src/main/java/com/metis/backend/auth/aspect/OwnershipAspect.java
package com.metis.backend.auth.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class OwnershipAspect {

    @Before("@annotation(requireOwnership)")
    public void checkOwnership(RequireOwnership requireOwnership) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = auth.getName();
        
        // Lógica para verificar se o usuário é dono do recurso
        // ...
        
        if (!isOwner) {
            throw new AccessDeniedException("Você não tem permissão para acessar este recurso");
        }
    }
}
```

## 9. Layout com Header Protegido

```tsx
// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 10. Tratando Erros de Autenticação

```tsx
// lib/api.ts (estendendo)
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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido, tentar refresh ou logout
        const refreshToken = getRefreshToken();
        
        if (refreshToken) {
          try {
            const newTokens = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            }).then(r => r.json());
            
            setAuthTokens(newTokens.accessToken, newTokens.refreshToken);
            
            // Tentar requisição novamente com novo token
            headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
            });
            return retryResponse.json();
          } catch {
            // Refresh falhou, fazer logout
            removeAuthTokens();
            window.location.href = '/login';
          }
        } else {
          removeAuthTokens();
          window.location.href = '/login';
        }
      }
      
      if (response.status === 403) {
        throw new Error('Você não tem permissão para acessar este recurso');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro na API: ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
```

Este arquivo demonstra os principais padrões de uso do sistema de autenticação implementado. Adapte conforme as necessidades específicas do seu projeto!
