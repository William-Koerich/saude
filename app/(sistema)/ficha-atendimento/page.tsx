"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function soDigitos(v: string) {
  return v.replace(/\D/g, "");
}

export default function FichaAtendimentoPage() {
  const [senhaChamada, setSenhaChamada] = useState(false);
  const [numeroSenha, setNumeroSenha] = useState<string | null>(null);
  const [loadingChamada, setLoadingChamada] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [localAtendimento, setLocalAtendimento] = useState("");
  const [numeroProntuario, setNumeroProntuario] = useState<string | null>(null);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telefoneEmergencia, setTelefoneEmergencia] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [raca, setRaca] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [email, setEmail] = useState("");
  const [cns, setCns] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");

  function resetForm() {
    setNome("");
    setDataNascimento("");
    setGenero("");
    setEndereco("");
    setWhatsapp("");
    setTelefoneEmergencia("");
    setNomeMae("");
    setRaca("");
    setNacionalidade("");
    setEmail("");
    setCns("");
    setCpf("");
    setRg("");
    setNumeroProntuario(null);
    setNumeroSenha(null);
    setSenhaChamada(false);
  }

  async function chamarPacienteBackend(): Promise<void> {
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
          "x-unidade-id": localStorage.getItem("unidadeId") ?? "35018f68-6023-43a6-b8df-5fd5f18c0b6d",
        },
        body: JSON.stringify({ localAtendimento, setor: "RECEPCAO" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao chamar paciente");
      }

      setNumeroSenha(data.nome ?? "A001");
      setNumeroProntuario(data.numeroProntuario ?? null);
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
        nome,
        dataNascimento,
        genero,
        endereco,
        nomeMae,
        nacionalidade,
      };

      if (whatsapp) body.whatsapp = soDigitos(whatsapp);
      if (telefoneEmergencia) body.telefoneEmergencia = soDigitos(telefoneEmergencia);
      if (raca) body.raca = raca;
      if (email) body.email = email;
      if (cns) body.cns = soDigitos(cns);
      if (cpf) body.cpf = soDigitos(cpf);
      if (rg) body.rg = rg;

      const response = await fetch("http://localhost:3010/ficha-atendimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-unidade-id": localStorage.getItem("unidadeId") ?? "",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao criar ficha");
      }

      alert("Ficha criada com sucesso! Paciente encaminhado para triagem.");
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
        <h1 className="text-2xl font-semibold text-white">
          Ficha de Atendimento
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Chame a senha e preencha os dados do paciente
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
              placeholder="Ex: Consultório 1 / Sala 2 / Triagem"
              className="h-10 bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <Button
            onClick={chamarPacienteBackend}
            disabled={loadingChamada || !localAtendimento}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl"
          >
            {loadingChamada ? "Chamando..." : "Chamar senha"}
          </Button>
        </div>
      )}

      {senhaChamada && (
        <div className="space-y-8">
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

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Dados do Paciente
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="nome" className="text-slate-200">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome completo"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nascimento" className="text-slate-200">
                  Data de Nascimento *
                </Label>
                <Input
                  id="nascimento"
                  type="date"
                  required
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="genero" className="text-slate-200">
                  Gênero *
                </Label>
                <select
                  id="genero"
                  required
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3"
                >
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="endereco" className="text-slate-200">
                  Endereço *
                </Label>
                <Input
                  id="endereco"
                  required
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="whatsapp" className="text-slate-200">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="emergencia" className="text-slate-200">
                  Telefone de Emergência
                </Label>
                <Input
                  id="emergencia"
                  type="tel"
                  value={telefoneEmergencia}
                  onChange={(e) => setTelefoneEmergencia(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="mae" className="text-slate-200">
                  Nome da Mãe *
                </Label>
                <Input
                  id="mae"
                  required
                  value={nomeMae}
                  onChange={(e) => setNomeMae(e.target.value)}
                  placeholder="Digite o nome da mãe"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="raca" className="text-slate-200">
                  Raça
                </Label>
                <select
                  id="raca"
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                  className="h-10 rounded-md bg-slate-950 border border-slate-700 text-white px-3"
                >
                  <option value="">Selecione</option>
                  <option value="BRANCA">Branca</option>
                  <option value="PRETA">Preta</option>
                  <option value="PARDA">Parda</option>
                  <option value="AMARELA">Amarela</option>
                  <option value="INDIGENA">Indígena</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nacionalidade" className="text-slate-200">
                  Nacionalidade *
                </Label>
                <Input
                  id="nacionalidade"
                  required
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                  placeholder="Brasileiro(a)"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="email" className="text-slate-200">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cns" className="text-slate-200">
                  CNS (Cartão Nacional de Saúde)
                </Label>
                <Input
                  id="cns"
                  value={cns}
                  onChange={(e) => setCns(e.target.value)}
                  placeholder="000 0000 0000 0000"
                  maxLength={18}
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cpf" className="text-slate-200">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rg" className="text-slate-200">
                  RG
                </Label>
                <Input
                  id="rg"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-0"
                  className="h-10 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="prontuario" className="text-slate-200">
                  Número do Prontuário
                </Label>
                <Input
                  id="prontuario"
                  readOnly
                  value={numeroProntuario ?? "Gerado pelo sistema"}
                  className="h-10 bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loadingSubmit}
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl"
                >
                  {loadingSubmit ? "Salvando..." : "Finalizar Atendimento"}
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
