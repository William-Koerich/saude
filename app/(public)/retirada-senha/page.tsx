"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Users, CheckCircle2 } from "lucide-react";

type Tipo = "PREFERENCIAL" | "NORMAL" | null;

export default function RetiradaSenhaPage() {
  const [tipo, setTipo] = useState<Tipo>(null);
  const [senhaGerada, setSenhaGerada] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [contador, setContador] = useState(10);
  const [loadingChamada, setLoadingChamada] = useState(false);

  // chama número sequencial persistido em localStorage
  function getNextNumber(): number {
    const cur = parseInt(localStorage.getItem("ultimo-numero") || "0", 10);
    const next = cur + 1;
    localStorage.setItem("ultimo-numero", String(next));
    return next;
  }

  function formatSenha(num: number, tipo: Tipo): string {
    const padded = String(num).padStart(2, "0");
    return tipo === "PREFERENCIAL" ? `P${padded}` : `N${padded}`;
  }
  console.log(contador);

  async function confirmarAtendimento() {
    try {
      setLoadingChamada(true);

      // gera senha sequencial localmente
      const next = getNextNumber();
      const senha = formatSenha(next, tipo);
      setSenhaGerada(senha);

      const response = await fetch("http://localhost:3010/fila", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-unidade-id": "35018f68-6023-43a6-b8df-5fd5f18c0b6d", // 👈 importante
        },
        body: JSON.stringify({
          nome: senha,
          tipo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao criar senha");
      }

      console.log("Senha criada:", data);

      setContador(10);
      setConfirmado(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Erro ao criar senha:", error);
        alert(error.message);
      } else {
        alert("Erro inesperado");
      }
    } finally {
      setLoadingChamada(false);
    }
  }

  function resetarTudo() {
    setTipo(null);
    setSenhaGerada(null);
    setConfirmado(false);
    setContador(10);
  }

  // Temporizador automático
  useEffect(() => {
    if (!confirmado) return;

    const interval = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          resetarTudo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmado]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {!tipo && !confirmado && (
            <motion.div
              key="selecionar"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold text-white">
                  Retirada de Atendimento
                </h1>
                <p className="text-slate-400 text-base">
                  Escolha o tipo de atendimento desejado
                </p>
              </div>

              <div className="grid gap-5">
                <button
                  onClick={() => setTipo("PREFERENCIAL")}
                  className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 active:scale-[0.98] transition text-left"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <HeartPulse className="text-emerald-400 w-6 h-6" />
                    <span className="text-emerald-300 font-semibold text-lg">
                      Atendimento Preferencial
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Idosos, gestantes e prioridades legais.
                  </p>
                </button>

                <button
                  onClick={() => setTipo("NORMAL")}
                  className="p-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 active:scale-[0.98] transition text-left"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <Users className="text-blue-400 w-6 h-6" />
                    <span className="text-blue-300 font-semibold text-lg">
                      Atendimento Normal
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Atendimento por ordem de chegada.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {tipo && !confirmado && (
            <motion.div
              key="formulario"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-7"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Gerar senha {tipo === "PREFERENCIAL" ? "preferencial" : "normal"}
                </h2>
                <p className="text-slate-400 text-base">
                  Clique no botão abaixo para receber seu número de senha
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <Button
                  disabled={loadingChamada}
                  onClick={confirmarAtendimento}
                  className="w-full h-14 text-lg font-semibold bg-linear-to-r from-emerald-500 to-emerald-600 rounded-2xl"
                >
                  {loadingChamada
                    ? "Gerando senha..."
                    : "Confirmar Atendimento"}
                </Button>

                <Button
                  onClick={resetarTudo}
                  className="w-full h-14 text-lg bg-slate-800 border border-slate-700 rounded-2xl"
                >
                  Voltar
                </Button>
              </div>
            </motion.div>
          )}

          {confirmado && (
            <motion.div
              key="confirmado"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
            >
              <CheckCircle2 className="mx-auto text-emerald-400 w-16 h-16" />

              <h2 className="text-3xl font-bold text-emerald-400">
                Atendimento Confirmado
              </h2>

              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-3xl p-10">
                <p className="text-slate-400 mb-4">Senha</p>

                <p className="text-4xl font-bold text-emerald-400 wrap-break-words">
                  {senhaGerada}
                </p>
              </div>

              <p className="text-slate-300 text-lg">
                Aguarde a chamada no painel.
              </p>

              <Button
                onClick={resetarTudo}
                className="w-full h-14 text-lg bg-slate-800 border border-slate-700 rounded-2xl"
              >
                Voltar para Início
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
