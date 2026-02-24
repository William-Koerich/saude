"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2 } from "lucide-react"

export default function PainelTV() {
  const [nomeAtual, setNomeAtual] = useState<string | null>(null)

  function chamarPaciente(nome: string) {
  setNomeAtual(nome)

  const audio = new Audio("/sons/chamada.mp3")

  audio.play()

  // Quando o áudio terminar, ele chama o nome
  audio.onended = () => {
    const msg = new SpeechSynthesisUtterance(
      `Atenção, ${nome}, favor dirigir-se à recepção`
    )

    msg.lang = "pt-BR"
    msg.rate = 0.9
    msg.pitch = 1

    speechSynthesis.speak(msg)
  }
}

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-950 flex flex-col items-center justify-center p-10">

      {/* TÍTULO */}
      <div className="absolute top-10 text-center">
        <h1 className="text-5xl text-white font-semibold">
          Painel de Chamadas
        </h1>
        <p className="text-slate-400 text-xl mt-3">
          Aguarde seu nome ser chamado
        </p>
      </div>

      {/* NOME EM DESTAQUE */}
      <AnimatePresence mode="wait">
        {nomeAtual ? (
          <motion.div
            key={nomeAtual}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-8xl font-bold text-emerald-400 drop-shadow-lg wrap-break-words">
              {nomeAtual}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="aguardando"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl text-slate-600"
          >
            Aguardando chamada...
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÃO TEMPORÁRIO PARA TESTE (REMOVER QUANDO TIVER SOCKET) */}
      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={() => chamarPaciente("William Koerich")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Volume2 size={20} />
          Testar Chamada
        </button>

        <button
          onClick={() => setNomeAtual(null)}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition"
        >
          Limpar Tela
        </button>
      </div>

    </div>
  )
}