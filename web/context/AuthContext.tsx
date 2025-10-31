// web/context/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, api, setAuthTokens, removeAuthTokens, getAuthToken, getRefreshToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Efeito para carregar o usuário na inicialização
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const refToken = getRefreshToken();

      if (token && refToken) {
        setAccessToken(token);
        setRefreshToken(refToken);
        try {
          // Valida o token buscando os dados do usuário
          // O `apiFetch` já anexa o token automaticamente
          const userData: User = await api.get("/api/auth/me"); //
          
          // O backend retorna um CurrentUserResponse, precisamos mapeá-lo para nossa interface User
          // O email será o ID principal no frontend
          const userWithId = { ...userData, id: userData.email }; 
          setUser(userWithId);
        } catch (error) {
          console.error("Falha ao validar sessão, limpando tokens:", error);
          // Se /api/auth/me falhar (ex: 401), o interceptor em api.ts (ou o catch aqui)
          // deve limpar os tokens. A lógica no api.ts já faz isso.
          removeAuthTokens();
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newAccessToken: string, newRefreshToken: string) => {
    setIsLoading(true);
    try {
      // 1. Salva os tokens
      setAuthTokens(newAccessToken, newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // 2. Busca os dados do usuário com o novo token
      const userData: User = await api.get("/api/auth/me");
      const userWithId = { ...userData, id: userData.email };
      setUser(userWithId);

    } catch (error) {
      console.error("Erro durante o processo de login:", error);
      // Limpa tudo se o login falhar
      removeAuthTokens();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // 1. (Opcional, mas recomendado) Informa o backend sobre o logout
      // A apiFetch anexará o token de autenticação
      await api.post("/api/auth/logout", {}); //
    } catch (error) {
      console.error("Erro ao notificar backend sobre logout:", error);
      // Continua o logout no frontend independentemente do erro
    } finally {
      // 2. Limpa o estado local
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      removeAuthTokens();
      
      // 3. Redireciona para o login
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};