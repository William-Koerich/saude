"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConsultaPage() {
  const [senhaChamada, setSenhaChamada] = useState(false);
  const [numeroSenha, setNumeroSenha] = useState<string | null>(null);
  const [loadingChamada, setLoadingChamada] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [localAtendimento, setLocalAtendimento] = useState("");

  // Campos obrigatórios
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [queixaPrincipal, setQueixaPrincipal] = useState("");
  const [cid, setCid] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [conduta, setConduta] = useState("");

  // Campos opcionais
  const [anamnese, setAnamnese] = useState("");
  const [exameFisico, setExameFisico] = useState("");
  const [hipoteseDiagnostica, setHipoteseDiagnostica] = useState("");
  const [prescricao, setPrescricao] = useState("");
  const [examesSolicitados, setExamesSolicitados] = useState("");
  const [encaminhamento, setEncaminhamento] = useState("");
  const [dataRetorno, setDataRetorno] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function resetForm() {
    setSenhaChamada(false);
    setNumeroSenha(null);
    setTipoConsulta("");
    setQueixaPrincipal("");
    setCid("");
    setDiagnostico("");
    setConduta("");
    setAnamnese("");
    setExameFisico("");
    setHipoteseDiagnostica("");
    setPrescricao("");
    setExamesSolicitados("");
    setEncaminhamento("");
    setDataRetorno("");
    setObservacoes("");
  }

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
        body: JSON.stringify({ localAtendimento, setor: "CONSULTA" }),
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

    try {
      setLoadingSubmit(true);

      const body: Record<string, string> = {
        nome: numeroSenha ?? "",
        tipoConsulta,
        queixaPrincipal,
        cid,
        diagnostico,
        conduta,
      };

      if (anamnese) body.anamnese = anamnese;
      if (exameFisico) body.exameFisico = exameFisico;
      if (hipoteseDiagnostica) body.hipoteseDiagnostica = hipoteseDiagnostica;
      if (prescricao) body.prescricao = prescricao;
      if (examesSolicitados) body.examesSolicitados = examesSolicitados;
      if (encaminhamento) body.encaminhamento = encaminhamento;
      if (dataRetorno) body.dataRetorno = dataRetorno;
      if (observacoes) body.observacoes = observacoes;

      const response = await fetch("http://localhost:3010/consulta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-unidade-id": localStorage.getItem("unidadeId") ?? "",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Erro ao registrar consulta");

      alert("Consulta registrada com sucesso!");
      resetForm();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Consulta Médica</h1>
        <p className="text-slate-400 text-sm mt-1">
          Chame a senha e registre os dados da consulta
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
              placeholder="Ex: Consultório 1 / Sala 2"
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

          {/* FORMULÁRIO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Dados da Consulta
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Tipo de consulta */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tipoConsulta" className="text-slate-200">
                  Tipo de Consulta *
                </Label>
                <select
                  id="tipoConsulta"
                  required
                  value={tipoConsulta}
                  onChange={(e) => setTipoConsulta(e.target.value)}
                  className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3"
                >
                  <option value="">Selecione</option>
                  <option value="PRIMEIRA_VEZ">Primeira vez</option>
                  <option value="RETORNO">Retorno</option>
                  <option value="URGENCIA">Urgência</option>
                </select>
              </div>

              {/* CID */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="cid" className="text-slate-200">
                  CID *
                </Label>
                <Input
                  id="cid"
                  required
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  placeholder="Ex: M13.9"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
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
                  placeholder="Motivo da consulta"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* Anamnese */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="anamnese" className="text-slate-200">
                  Anamnese
                </Label>
                <textarea
                  id="anamnese"
                  rows={4}
                  value={anamnese}
                  onChange={(e) => setAnamnese(e.target.value)}
                  placeholder="História da doença atual, antecedentes..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Exame físico */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="exameFisico" className="text-slate-200">
                  Exame Físico
                </Label>
                <textarea
                  id="exameFisico"
                  rows={3}
                  value={exameFisico}
                  onChange={(e) => setExameFisico(e.target.value)}
                  placeholder="Achados do exame físico..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Hipótese diagnóstica */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="hipoteseDiagnostica" className="text-slate-200">
                  Hipótese Diagnóstica
                </Label>
                <Input
                  id="hipoteseDiagnostica"
                  value={hipoteseDiagnostica}
                  onChange={(e) => setHipoteseDiagnostica(e.target.value)}
                  placeholder="Ex: Artrite reumatoide"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* Diagnóstico */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="diagnostico" className="text-slate-200">
                  Diagnóstico *
                </Label>
                <Input
                  id="diagnostico"
                  required
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  placeholder="Diagnóstico definitivo"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* Conduta */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="conduta" className="text-slate-200">
                  Conduta *
                </Label>
                <textarea
                  id="conduta"
                  rows={3}
                  required
                  value={conduta}
                  onChange={(e) => setConduta(e.target.value)}
                  placeholder="Plano terapêutico, orientações..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Prescrição */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="prescricao" className="text-slate-200">
                  Prescrição
                </Label>
                <textarea
                  id="prescricao"
                  rows={3}
                  value={prescricao}
                  onChange={(e) => setPrescricao(e.target.value)}
                  placeholder="Medicamentos, posologia..."
                  className="rounded-md bg-slate-950 border border-slate-700 text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Exames solicitados */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="examesSolicitados" className="text-slate-200">
                  Exames Solicitados
                </Label>
                <Input
                  id="examesSolicitados"
                  value={examesSolicitados}
                  onChange={(e) => setExamesSolicitados(e.target.value)}
                  placeholder="Ex: Hemograma, PCR, VHS"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              {/* Encaminhamento e data de retorno */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="encaminhamento" className="text-slate-200">
                  Encaminhamento
                </Label>
                <Input
                  id="encaminhamento"
                  value={encaminhamento}
                  onChange={(e) => setEncaminhamento(e.target.value)}
                  placeholder="Ex: Reumatologia"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="dataRetorno" className="text-slate-200">
                  Data de Retorno
                </Label>
                <Input
                  id="dataRetorno"
                  type="date"
                  value={dataRetorno}
                  onChange={(e) => setDataRetorno(e.target.value)}
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
                  rows={2}
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
                  {loadingSubmit ? "Registrando..." : "Finalizar Consulta"}
                </Button>

                <Button
                  type="button"
                  className="flex-1 h-14 text-lg bg-slate-800 border border-slate-700 rounded-2xl"
                  onClick={resetForm}
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
