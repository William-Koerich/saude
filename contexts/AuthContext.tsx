"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export type User = {
  id: string
  cpf: string
  nome: string
  funcao: string
  unidadeId: string
}

type AuthContextType = {
  user: User | null
  signIn: (cpf: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // ✅ Inicialização segura (SEM useEffect)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null

    const storedUser = localStorage.getItem("user")

    return storedUser ? JSON.parse(storedUser) : null
  })

  async function signIn(cpf: string, password: string) {
    const response = await api.post("/funcionarios/login", {
      cpf,
      senha: password,
    })

    const { token, funcionario } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(funcionario))
    localStorage.setItem("unidadeId", funcionario.unidadeId)

    setUser(funcionario)

    router.push("/dashboard")
  }

  function signOut() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("unidadeId")

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