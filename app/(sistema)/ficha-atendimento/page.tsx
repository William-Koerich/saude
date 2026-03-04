"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FichaAtendimentoPage() {
  const [senhaChamda, setSenhaChamda] = useState(false)
  const [numeroSenha, setNumeroSenha] = useState<string | null>(null)
  const [loadingChamada, setLoadingChamada] = useState(false)

 async function chamarPacienteBackend(): Promise<void> {
  try {
    setLoadingChamada(true)

    const response = await fetch("http://localhost:3010/fila/chamar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-unidade-id": localStorage.getItem("unidadeId") ?? "",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error ?? "Erro ao chamar paciente")
    }

    // 👇 Ajuste aqui conforme o retorno do backend
    setNumeroSenha(data.nome ?? "A001")
    setSenhaChamda(true)

  } catch (error: unknown) {
    alert(error instanceof Error ? error.message : "Erro inesperado")
  } finally {
    setLoadingChamada(false)
  }
}

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Ficha de Atendimento
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Chame a senha e preencha os dados do paciente
        </p>
      </div>

      {/* BOTÃO INICIAL */}
      {!senhaChamda && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
          <Button
                onClick={chamarPacienteBackend}
                disabled={loadingChamada}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl"
              >
                {loadingChamada ? "Chamando..." : "Chamar senha"}
              </Button>
        </div>
      )}

      {/* APÓS CHAMAR SENHA */}
      {senhaChamda && (
  <div className="space-y-8">

    {/* CARD SENHA */}
    <div
      className="bg-blue-600/20 border border-blue-500 rounded-2xl p-8 text-center shadow-lg"
      role="status"
      aria-live="polite"
    >
      <p className="text-blue-300 text-sm uppercase tracking-wide">
        Senha chamada
      </p>
      <h2 className="text-5xl font-bold text-white mt-3">
        {numeroSenha}
      </h2>
    </div>

    {/* FORMULÁRIO */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

      <h3 className="text-xl font-semibold text-white mb-6">
        Dados do Paciente
      </h3>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nome */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="nome" className="text-slate-200">
            Nome Completo *
          </Label>
          <Input
            id="nome"
            required
            placeholder="Digite o nome completo"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data nascimento */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="nascimento" className="text-slate-200">
            Data de Nascimento *
          </Label>
          <Input
            id="nascimento"
            type="date"
            required
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gênero */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="genero" className="text-slate-200">
            Gênero *
          </Label>
          <select
            id="genero"
            required
            className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Outro</option>
          </select>
        </div>

        {/* Endereço */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="endereco" className="text-slate-200">
            Endereço *
          </Label>
          <Input
            id="endereco"
            required
            placeholder="Rua, número, bairro, cidade"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsapp" className="text-slate-200">
            WhatsApp
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="(00) 00000-0000"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Telefone emergência */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="emergencia" className="text-slate-200">
            Telefone de Emergência
          </Label>
          <Input
            id="emergencia"
            type="tel"
            placeholder="(00) 00000-0000"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nome da mãe */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="mae" className="text-slate-200">
            Nome da Mãe *
          </Label>
          <Input
            id="mae"
            required
            placeholder="Digite o nome da mãe"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Raça */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="raca" className="text-slate-200">
            Raça
          </Label>
          <select
            id="raca"
            className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option>Branca</option>
            <option>Preta</option>
            <option>Parda</option>
            <option>Amarela</option>
            <option>Indígena</option>
          </select>
        </div>

        {/* Nacionalidade */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="nacionalidade" className="text-slate-200">
            Nacionalidade *
          </Label>
          <Input
            id="nacionalidade"
            required
            placeholder="Brasileiro(a)"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="email" className="text-slate-200">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            className="h-10 bg-slate-950 border-slate-700 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BOTÕES */}
        <div className="md:col-span-2 flex gap-4 pt-6">
          <Button
            type="submit"
            className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl"
          >
            Finalizar Atendimento
          </Button>

          <Button
            type="button"
            
            className="flex-1 h-14 text-lg bg-slate-800 border border-slate-700 rounded-2xl"
            onClick={() => {
              setSenhaChamda(false)
              setNumeroSenha(null)
            }}
          >
            Cancelar
          </Button>
        </div>

      </form>
    </div>
  </div>
)}

    </div>
  )
}