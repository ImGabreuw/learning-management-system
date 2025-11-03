"use client"

import Navigation from "@/components/navigation"
import { ProfileManagement } from "@/components/profile-management"
import ProtectedRoute from "@/components/ProtectedRoute"

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <ProfileManagement />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  )
}
