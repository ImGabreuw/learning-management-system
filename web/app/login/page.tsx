"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, GraduationCap, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import {useAuth} from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { is } from "date-fns/locale"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const router = useRouter()
  const {isAuthenticated, isLoading: isAuthLoading} = useAuth()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      window.location.href = "/"
    }, 2000)
  }

  const handleMicrosoftLogin = () => {
    console.log("[v0] Redirecionando para o fluxo OAuth2 do backend")
    // Redirect to Microsoft OAuth
     window.location.href = `${API_BASE_URL}/oauth2/authorization/microsoft`;
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

          {/* Login Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center">Entrar</CardTitle>
              <CardDescription className="text-center">Escolha uma opção para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Microsoft/Outlook Login - Botão Principal */}
                <Button
                  type="button"
                  onClick={handleMicrosoftLogin} // <-- Função atualizada
                  className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-white font-medium"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h11v11H0z" fill="#f25022" />
                      <path d="M12 0h11v11H12z" fill="#00a4ef" />
                      <path d="M0 12h11v11H0z" fill="#7fba00" />
                      <path d="M12 12h11v11H12z" fill="#ffb900" />
                    </svg>
                    <span>Entrar com Outlook / Microsoft</span>
                  </div>
                </Button>
              </div>

            {showEmailLogin && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@mackenzie.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Lembrar de mim
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Entrar</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    Criar conta
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2025 Universidade Presbiteriana Mackenzie</p>
            {/* ... (links de privacidade, etc.) ... */}
          </div>
        </div>
      </div>
    )
  );
}
