"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  
  // Captura erros da URL
  const error = searchParams.get('error')
  const errorMessage = searchParams.get('message')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleMicrosoftLogin = () => {
    console.log("Redirecionando para o fluxo OAuth2 do backend")
    setIsLoading(true)
    // Redirect to Microsoft OAuth
    window.location.href = `${API_BASE_URL}/oauth2/authorization/microsoft`;
  }

  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case 'domain_not_allowed':
        return errorMessage || 'Email não permitido. Use um email @mackenzie.br, @mackenzista.com.br ou @outlook.com';
      case 'authentication_failed':
        return 'Falha na autenticação. Por favor, tente novamente.';
      default:
        return errorMessage || 'Ocorreu um erro durante o login.';
    }
  }
  
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-xl font-medium">Verificando sessão...</div>
      </div>
    );
  }

 return (
    !isAuthenticated && (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Metis</h1>
            <p className="text-gray-600">Acesse sua plataforma de aprendizado</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center">Entrar</CardTitle>
              <CardDescription className="text-center">
                Use sua conta Microsoft para acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Microsoft/Outlook Login - Botão Principal */}
                <Button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                  className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-white font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Redirecionando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h11v11H0z" fill="#f25022" />
                        <path d="M12 0h11v11H12z" fill="#00a4ef" />
                        <path d="M0 12h11v11H0z" fill="#7fba00" />
                        <path d="M12 12h11v11H12z" fill="#ffb900" />
                      </svg>
                      <span>Entrar com Microsoft</span>
                    </div>
                  )}
                </Button>

                {/* Info sobre domínios permitidos */}
                <div className="text-center mt-4 text-xs text-gray-500">
                  <p>Domínios permitidos:</p>
                  <p>@mackenzie.br • @mackenzista.com.br • @outlook.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2025 Universidade Presbiteriana Mackenzie</p>
          </div>
        </div>
      </div>
    )
  );
}
