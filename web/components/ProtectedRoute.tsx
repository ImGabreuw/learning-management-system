// web/components/ProtectedRoute.tsx
"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => 
        user.roles?.includes(role)
      );
      
      if (!hasRequiredRole) {
        console.error("Usuário não tem permissão para acessar esta página");
        router.push("/");
      }
    }
  }, [user, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl font-medium">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
