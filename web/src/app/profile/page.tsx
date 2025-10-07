"use client"

import Navigation from "@/components/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProfileManagement } from "@/components/profile-management"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Meu Perfil" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Meu Perfil</h1>
          <p className="text-slate-600">Gerencie suas informações pessoais e preferências</p>
        </div>
        <ProfileManagement
          onSave={(profile) => {
            console.log("[v0] Profile updated:", profile)
          }}
        />
      </div>
    </div>
  )
}
