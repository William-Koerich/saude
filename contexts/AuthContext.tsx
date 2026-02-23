"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

export type User = {
  cpf: string
  name?: string
  role?: "ADMIN" | "USER"
}

type AuthContextType = {
  user: User | null
  signIn: (cpf: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // ✅ Inicialização correta sem useEffect
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem("token")

    if (!token) return null

    // 🔥 depois você vai decodificar o JWT aqui
    return {
      cpf: "mock-user",
      role: "USER",
    }
  })

  async function signIn(cpf: string, password: string) {
    if (cpf && password) {
      const fakeToken = "jwt.mock.token"

      localStorage.setItem("token", fakeToken)

      setUser({
        cpf,
        role: "USER",
      })

      router.push("/dashboard")
    }
  }

  function signOut() {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}