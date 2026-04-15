import { useEffect, useState } from "react";
import {
  atualizarCliente,
  buscarClientePorId,
  cadastrarCliente,
  salvarMensagemTemporaria
} from "../services/clientesApi";
import {
  CPF_TAMANHO,
  RG_TAMANHO,
  montarPayloadCliente,
  sanitizarCampoCliente,
  sanitizarNumeros,
  sanitizarNomePessoa,
  validarFormularioCliente
} from "../utils/cadastroValidacao";

const formularioInicial = {
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  rg: "",
  profissao: "",
  endereco: ""
};

export default function ClienteFormPage({ modo, clienteId, onCancelar, onSalvarSucesso }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [carregando, setCarregando] = useState(modo === "editar");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (modo !== "editar") {
      return;
    }

    async function carregarCliente() {
      setCarregando(true);
      setErro("");

      try {
        const cliente = await buscarClientePorId(clienteId);
        setFormulario({
          nome: sanitizarNomePessoa(cliente.nome || ""),
          email: cliente.email || cliente.login || "",
          senha: "",
          cpf: sanitizarNumeros(cliente.cpf || "", CPF_TAMANHO),
          rg: sanitizarNumeros(cliente.rg || "", RG_TAMANHO),
          profissao: cliente.profissao || "",
          endereco: cliente.endereco || ""
        });
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar o cliente para edicao.");
      } finally {
        setCarregando(false);
      }
    }

    carregarCliente();
  }, [modo, clienteId]);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({
      ...atual,
      [name]: sanitizarCampoCliente(name, value)
    }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");

    const erroValidacao = validarFormularioCliente(formulario);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);

    try {
      const payload = montarPayloadCliente(formulario);

      if (modo === "editar") {
        await atualizarCliente(clienteId, payload);
        salvarMensagemTemporaria("Cliente atualizado com sucesso.");
      } else {
        await cadastrarCliente(payload);
        salvarMensagemTemporaria("Cliente cadastrado com sucesso.");
      }

      onSalvarSucesso();
    } catch (error) {
      setErro(error.message || "Nao foi possivel salvar o cliente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="page-card form-page">
      <header className="split-header">
        <div>
          <p className="eyebrow">{modo === "editar" ? "Edicao de cliente" : "Criacao de cliente"}</p>
          <h1>{modo === "editar" ? "Editar cliente" : "Novo cliente"}</h1>
          <p className="page-subtitle">
            {modo === "editar"
              ? "Atualize os dados e salve para persistir no banco."
              : "Preencha os campos obrigatorios para inserir um novo cliente."}
          </p>
        </div>

        <button type="button" className="secondary-button" onClick={onCancelar}>
          Voltar para listagem
        </button>
      </header>

      {erro ? <p className="feedback error">{erro}</p> : null}

      {carregando ? (
        <div className="empty-state">
          <h2>Carregando formulario...</h2>
          <p>Buscando dados do cliente selecionado.</p>
        </div>
      ) : (
        <form className="form-card" onSubmit={salvar}>
          <div className="form-grid">
            <label>
              Nome *
              <input name="nome" value={formulario.nome} onChange={atualizarCampo} required />
            </label>

            <label>
              E-mail *
              <input
                name="email"
                type="email"
                value={formulario.email}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Senha *
              <input
                name="senha"
                type="password"
                value={formulario.senha}
                onChange={atualizarCampo}
                required
              />
            </label>

            <div className="form-grid form-grid--2col">
              <label>
                CPF
                <input
                  name="cpf"
                  value={formulario.cpf}
                  onChange={atualizarCampo}
                  inputMode="numeric"
                  maxLength={CPF_TAMANHO}
                  placeholder="000.000.000-00"
                />
              </label>
              <label>
                RG
                <input
                  name="rg"
                  value={formulario.rg}
                  onChange={atualizarCampo}
                  inputMode="numeric"
                  maxLength={RG_TAMANHO}
                  placeholder="00.000.000-0"
                />
              </label>
            </div>

            <label>
              Profissao
              <input
                name="profissao"
                value={formulario.profissao}
                onChange={atualizarCampo}
                placeholder="Ex: Engenheiro, Medico..."
              />
            </label>

            <label>
              Endereco
              <input
                name="endereco"
                value={formulario.endereco}
                onChange={atualizarCampo}
                placeholder="Rua, numero, bairro, cidade"
              />
            </label>
          </div>

          {modo === "editar" ? (
            <div className="helper-row">
              <span>Para atualizar o cliente, informe a senha que deve ficar salva no cadastro.</span>
            </div>
          ) : null}

          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="primary-button" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : modo === "editar"
                  ? "Salvar alteracoes"
                  : "Criar cliente"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
