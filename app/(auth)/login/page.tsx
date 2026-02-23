"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { PatternFormat } from "react-number-format"

export default function LoginPage() {
  const { signIn } = useAuth()

  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(cpf, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">

      {/* 🔵 LADO ESQUERDO */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden">

        {/* Glow de fundo estilo SaaS */}
        <div className="absolute w-125 h-125 bg-indigo-600/20 blur-3xl rounded-full" />

        {/* SVG Ilustração */}
        <div className="relative z-10 w-[70%] max-w-lg">
            <Image
                src="/hospital-login.svg"
                alt="Ilustração hospital"
                width={600}
                height={600}
                className="w-full h-auto animate-float"
                priority
            />
        </div>

      </div>

      {/* 🟣 LADO DIREITO */}
      <div className="flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-800 shadow-2xl">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Entre com seu CPF e senha para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
                <Label className="text-slate-300">CPF</Label>

                <PatternFormat
                    value={cpf}
                    onValueChange={(values) => setCpf(values.value)}
                    format="###.###.###-##"
                    mask="_"
                    customInput={Input}
                    className="bg-slate-950 border-slate-700 text-white"
                    placeholder="000.000.000-00"
                    required
                />
            </div>
            <div>
              <Label className="text-slate-300">Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Entrar
            </Button>

          </form>

        </div>
      </div>

    </div>
  )
}