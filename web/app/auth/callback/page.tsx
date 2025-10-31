// web/app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // 1. Extrai os tokens da URL
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      // 2. Chama a função 'login' do nosso AuthContext
      login(accessToken, refreshToken)
        .then(() => {
          // 3. Sucesso! Redireciona para o dashboard
          console.log("Login via callback com sucesso. Redirecionando...");
          router.push("/");
        })
        .catch((err) => {
          console.error("Falha ao processar login no callback:", err);
          // 4. Falha. Redireciona de volta para o login
          router.push("/login");
        });
    } else {
      // 5. Tokens não encontrados na URL.
      console.error("Tokens não encontrados nos parâmetros da URL.");
      //router.push("/login");
    }
  }, [searchParams, login, router]);

  // Página de "Carregando" enquanto processa os tokens
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-xl font-medium">Autenticando...</div>
        <p className="text-slate-600">Por favor, aguarde enquanto validamos sua sessão.</p>
      </div>
    </div>
  );
}