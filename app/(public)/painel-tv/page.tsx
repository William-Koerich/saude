"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2 } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { useSearchParams } from "next/navigation"

export default function PainelTV() {
  const [nomeAtual, setNomeAtual] = useState<string | null>(null)
  const [localAtendimentoAtual, setLocalAtendimentoAtual] = useState<string | null>(null)
  const [ultimosChamados, setUltimosChamados] = useState<Array<{senha: string, localAtendimento: string}>>([])
  const [audioLiberado, setAudioLiberado] = useState(false)

  const searchParams = useSearchParams()
  const unidadeId = searchParams.get("unidade")

  // 🔓 Libera áudio no primeiro clique em qualquer lugar da tela
  useEffect(() => {
    const liberarAudio = () => {
      if (!audioLiberado) {
        const msg = new SpeechSynthesisUtterance("")
        speechSynthesis.speak(msg)
        speechSynthesis.cancel()
        setAudioLiberado(true)
        console.log("🔊 Áudio liberado")
      }
    }

    window.addEventListener("click", liberarAudio)

    return () => {
      window.removeEventListener("click", liberarAudio)
    }
  }, [audioLiberado])

  useEffect(() => {
  speechSynthesis.getVoices()
}, [])

  function chamarPaciente(senha: string, localAtendimento: string) {
    console.log("Chamando paciente:", senha, "para", localAtendimento)
  setNomeAtual(senha)
  setLocalAtendimentoAtual(localAtendimento)

  setUltimosChamados((prev) => {
    const atualizados = [{senha, localAtendimento}, ...prev.filter((n) => n.senha !== senha)]
    return atualizados.slice(0, 3)
  })

  const falar = () => {
    speechSynthesis.cancel()

    const msg = new SpeechSynthesisUtterance(
      `Atenção, ${senha}, favor dirigir-se a ${localAtendimento}`
    )

    const vozes = speechSynthesis.getVoices()

    const vozPtBr =
      vozes.find((v) => v.lang === "pt-BR") ||
      vozes.find((v) => v.lang.startsWith("pt"))

    if (vozPtBr) {
      msg.voice = vozPtBr
    }

    msg.lang = "pt-BR"
    msg.rate = 0.9
    msg.pitch = 1

    speechSynthesis.speak(msg)
  }

  // 🔥 Se as vozes ainda não carregaram, espera carregar
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      falar()
    }
  } else {
    falar()
  }
}

  useEffect(() => {
    if (!unidadeId) return

    const socket: Socket = io("http://localhost:3010", {
      transports: ["websocket"],
      query: {
        unidadeId: unidadeId,
      },
    })

    socket.on("connect", () => {
      console.log("📺 Conectado:", socket.id)
    })

    socket.on("chamarPaciente", (data: { senha: string, localAtendimento: string }) => {
      console.log("📢 Recebido:", data.senha, "para", data.localAtendimento)
      chamarPaciente(data.senha, data.localAtendimento)
    })

    return () => {
      socket.disconnect()
    }
  }, [unidadeId, audioLiberado])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-950 flex flex-col items-center justify-center p-10 relative">

      <div className="absolute top-10 text-center">
        <h1 className="text-5xl text-white font-semibold">
          Painel de Chamadas
        </h1>
        <p className="text-slate-400 text-xl mt-3">
          Aguarde seu nome ser chamado
        </p>
      </div>

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
            {localAtendimentoAtual && (
              <p className="text-3xl text-emerald-300 mt-4 font-medium">
                Dirija-se a {localAtendimentoAtual}
              </p>
            )}
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

      {ultimosChamados.length > 0 && (
        <div className="absolute bottom-28 w-full max-w-4xl">
          <h2 className="text-2xl text-slate-400 text-center mb-6">
            Últimas chamadas
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {ultimosChamados.map((chamada, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 text-center border ${
                  index === 0
                    ? "bg-emerald-900/40 border-emerald-500"
                    : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <p
                  className={`text-2xl font-medium wrap-break-words ${
                    index === 0 ? "text-emerald-300" : "text-slate-300"
                  }`}
                >
                  {chamada.senha}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    index === 0 ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {chamada.localAtendimento}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={() => chamarPaciente("William Koerich", "Recepção")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Volume2 size={20} />
          Testar Chamada
        </button>
      </div>
    </div>
  )
}