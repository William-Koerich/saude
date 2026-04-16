"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NOMEM } from "dns/promises";

type Prioridade = "VERMELHO" | "LARANJA" | "AMARELO" | "VERDE" | "AZUL";

const PRIORIDADE_CONFIG: Record<
  Prioridade,
  { label: string; bg: string; border: string; text: string }
> = {
  VERMELHO: {
    label: "Vermelho — Emergência",
    bg: "bg-red-600/20",
    border: "border-red-500",
    text: "text-red-400",
  },
  LARANJA: {
    label: "Laranja — Muito Urgente",
    bg: "bg-orange-600/20",
    border: "border-orange-500",
    text: "text-orange-400",
  },
  AMARELO: {
    label: "Amarelo — Urgente",
    bg: "bg-yellow-600/20",
    border: "border-yellow-500",
    text: "text-yellow-400",
  },
  VERDE: {
    label: "Verde — Pouco Urgente",
    bg: "bg-green-600/20",
    border: "border-green-500",
    text: "text-green-400",
  },
  AZUL: {
    label: "Azul — Não Urgente",
    bg: "bg-blue-600/20",
    border: "border-blue-500",
    text: "text-blue-400",
  },
};

export default function TriagemPage() {
  const [senhaChamada, setSenhaChamada] = useState(false);
  const [numeroSenha, setNumeroSenha] = useState<string | null>(null);
  const [loadingChamada, setLoadingChamada] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [localAtendimento, setLocalAtendimento] = useState("");

  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [queixaPrincipal, setQueixaPrincipal] = useState("");
  const [historiaClinica, setHistoriaClinica] = useState("");
  const [escalaDor, setEscalaDor] = useState<number>(0);
  const [prioridade, setPrioridade] = useState<Prioridade | "">("");
  const [pressaoArterial, setPressaoArterial] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("");
  const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState("");
  const [saturacaoOxigenio, setSaturacaoOxigenio] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [glicemia, setGlicemia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  async function chamarPaciente() {
    try {
      if (!localAtendimento) {
        alert("Informe o local de atendimento");
        return;
      }
      setLoadingChamada(true);

      const response = await fetch("http://localhost:3010/fila/chamar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-unidade-id": localStorage.getItem("unidadeId") ?? "",
        },
        body: JSON.stringify({
          localAtendimento,
          setor: "TRIAGEM",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Erro ao chamar paciente");

      setNumeroSenha(data.nome ?? "A001");
      setSenhaChamada(true);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setLoadingChamada(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!queixaPrincipal || !tipoAtendimento || !prioridade) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      setLoadingSubmit(true);

      const body = {
        nome: numeroSenha,
        tipoAtendimento,
        queixaPrincipal,
        historiaClinica: historiaClinica || undefined,
        escalaDor,
        prioridade,
        pressaoArterial: pressaoArterial || undefined,
        temperatura: temperatura ? parseFloat(temperatura) : undefined,
        frequenciaCardiaca: frequenciaCardiaca ? parseInt(frequenciaCardiaca) : undefined,
        frequenciaRespiratoria: frequenciaRespiratoria ? parseInt(frequenciaRespiratoria) : undefined,
        saturacaoOxigenio: saturacaoOxigenio ? parseFloat(saturacaoOxigenio) : undefined,
        peso: peso ? parseFloat(peso) : undefined,
        altura: altura ? parseFloat(altura) : undefined,
        glicemia: glicemia ? parseFloat(glicemia) : undefined,
        observacoes: observacoes || undefined,
      };

      const response = await fetch("http://localhost:3010/triagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-unidade-id": localStorage.getItem("unidadeId") ?? "",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Erro ao registrar triagem");

      alert("Triagem registrada! Paciente encaminhado para fila de CONSULTA.");
      setSenhaChamada(false);
      setNumeroSenha(null);
      setTipoAtendimento("");
      setQueixaPrincipal("");
      setHistoriaClinica("");
      setEscalaDor(0);
      setPrioridade("");
      setPressaoArterial("");
      setTemperatura("");
      setFrequenciaCardiaca("");
      setFrequenciaRespiratoria("");
      setSaturacaoOxigenio("");
      setPeso("");
      setAltura("");
      setGlicemia("");
      setObservacoes("");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setLoadingSubmit(false);
    }
  }

  const prioridadeAtual = prioridade ? PRIORIDADE_CONFIG[prioridade] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Triagem</h1>
        <p className="text-slate-400 text-sm mt-1">
          Chame a senha e registre os dados clínicos do paciente
        </p>
      </div>

      {/* LOCAL + BOTÃO */}
      {!senhaChamada && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-slate-200">Local de Atendimento *</Label>
            <Input
              value={localAtendimento}
              onChange={(e) => setLocalAtendimento(e.target.value)}
              placeholder="Ex: Sala de Triagem / Consultório 1"
              className="h-10 bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <Button
            onClick={chamarPaciente}
            disabled={loadingChamada || !localAtendimento}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl"
          >
            {loadingChamada ? "Chamando..." : "Chamar senha"}
          </Button>
        </div>
      )}

      {senhaChamada && (
        <div className="space-y-8">
          {/* SENHA CHAMADA */}
          <div
            className="bg-blue-600/20 border border-blue-500 rounded-2xl p-8 text-center shadow-lg"
            role="status"
            aria-live="polite"
          >
            <p className="text-blue-300 text-sm uppercase tracking-wide">
              Senha chamada
            </p>
            <h2 className="text-5xl font-bold text-white mt-3">{numeroSenha}</h2>
          </div>

          {/* CLASSIFICAÇÃO DE RISCO MANCHESTER */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Classificação de Risco — Protocolo de Manchester
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(PRIORIDADE_CONFIG) as Prioridade[]).map((p) => {
                const cfg = PRIORIDADE_CONFIG[p];
                const selected = prioridade === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrioridade(p)}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      selected
                        ? `${cfg.bg} ${cfg.border} ${cfg.text} font-semibold scale-105`
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    <span className="block text-sm">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
            {prioridadeAtual && (
              <p
                className={`mt-4 text-sm font-medium ${prioridadeAtual.text}`}
              >
                Prioridade selecionada: {prioridadeAtual.label}
              </p>
            )}
          </div>

          {/* FORMULÁRIO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Dados Clínicos
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de atendimento */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tipoAtendimento" className="text-slate-200">
                  Tipo de Atendimento *
                </Label>
                <select
                  id="tipoAtendimento"
                  required
                  value={tipoAtendimento}
                  onChange={(e) => setTipoAtendimento(e.target.value)}
                  className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3"
                >
                  <option value="">Selecione</option>
                  <option value="URGENCIA">Urgência</option>
                  <option value="CONSULTA">Consulta</option>
                  <option value="RETORNO">Retorno</option>
                </select>
              </div>

              {/* Escala de dor */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="escalaDor" className="text-slate-200">
                  Escala de Dor (0–10): <span className="text-blue-400 font-bold">{escalaDor}</span>
                </Label>
                <input
                  id="escalaDor"
                  type="range"
                  min={0}
                  max={10}
                  value={escalaDor}
                  onChange={(e) => setEscalaDor(Number(e.target.value))}
                  className="accent-blue-500 h-2 w-full cursor-pointer mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 — Sem dor</span>
                  <span>10 — Insuportável</span>
                </div>
              </div>

              {/* Queixa principal */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="queixaPrincipal" className="text-slate-200">
                  Queixa Principal *
                </Label>
                <Input
                  id="queixaPrincipal"
                  required
                  value={queixaPrincipal}
                  onChange={(e) => setQueixaPrincipal(e.target.value)}
                  placeholder="Descreva o motivo da consulta"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* História clínica */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="historiaClinica" className="text-slate-200">
                  História Clínica
                </Label>
                <textarea
                  id="historiaClinica"
                  rows={3}
                  value={historiaClinica}
                  onChange={(e) => setHistoriaClinica(e.target.value)}
                  placeholder="Histórico de doenças, cirurgias, alergias..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sinais vitais */}
              <div className="md:col-span-2">
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-4">
                  Sinais Vitais
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="pressaoArterial" className="text-slate-200">
                      Pressão Arterial
                    </Label>
                    <Input
                      id="pressaoArterial"
                      value={pressaoArterial}
                      onChange={(e) => setPressaoArterial(e.target.value)}
                      placeholder="120/80 mmHg"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="temperatura" className="text-slate-200">
                      Temperatura (°C)
                    </Label>
                    <Input
                      id="temperatura"
                      type="number"
                      step="0.1"
                      value={temperatura}
                      onChange={(e) => setTemperatura(e.target.value)}
                      placeholder="36.5"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="frequenciaCardiaca" className="text-slate-200">
                      Freq. Cardíaca (bpm)
                    </Label>
                    <Input
                      id="frequenciaCardiaca"
                      type="number"
                      value={frequenciaCardiaca}
                      onChange={(e) => setFrequenciaCardiaca(e.target.value)}
                      placeholder="80"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="frequenciaRespiratoria" className="text-slate-200">
                      Freq. Respiratória (irpm)
                    </Label>
                    <Input
                      id="frequenciaRespiratoria"
                      type="number"
                      value={frequenciaRespiratoria}
                      onChange={(e) => setFrequenciaRespiratoria(e.target.value)}
                      placeholder="16"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="saturacaoOxigenio" className="text-slate-200">
                      Saturação O₂ (%)
                    </Label>
                    <Input
                      id="saturacaoOxigenio"
                      type="number"
                      step="0.1"
                      value={saturacaoOxigenio}
                      onChange={(e) => setSaturacaoOxigenio(e.target.value)}
                      placeholder="98"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="glicemia" className="text-slate-200">
                      Glicemia (mg/dL)
                    </Label>
                    <Input
                      id="glicemia"
                      type="number"
                      step="0.1"
                      value={glicemia}
                      onChange={(e) => setGlicemia(e.target.value)}
                      placeholder="100"
                      className="h-10 bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Antropometria */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="peso" className="text-slate-200">
                  Peso (kg)
                </Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="70.0"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="altura" className="text-slate-200">
                  Altura (cm)
                </Label>
                <Input
                  id="altura"
                  type="number"
                  step="0.1"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  placeholder="170"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="observacoes" className="text-slate-200">
                  Observações
                </Label>
                <textarea
                  id="observacoes"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Notas adicionais..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Ações */}
              <div className="md:col-span-2 flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loadingSubmit}
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl"
                >
                  {loadingSubmit ? "Registrando..." : "Registrar Triagem"}
                </Button>

                <Button
                  type="button"
                  className="flex-1 h-14 text-lg bg-slate-800 border border-slate-700 rounded-2xl"
                  onClick={() => {
                    setSenhaChamada(false);
                    setNumeroSenha(null);
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
  );
}
