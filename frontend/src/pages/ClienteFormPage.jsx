import { useEffect, useState } from "react";
import {
  atualizarCliente,
  buscarClientePorId,
  cadastrarCliente,
  salvarMensagemTemporaria
} from "../services/clientesApi";

const formularioInicial = {
  nome: "",
  email: "",
  senha: ""
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
          nome: cliente.nome || "",
          email: cliente.email || "",
          senha: ""
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
      [name]: value
    }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      if (modo === "editar") {
        await atualizarCliente(clienteId, formulario);
        salvarMensagemTemporaria("Cliente atualizado com sucesso.");
      } else {
        await cadastrarCliente(formulario);
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
              Nome
              <input name="nome" value={formulario.nome} onChange={atualizarCampo} required />
            </label>

            <label>
              E-mail
              <input
                name="email"
                type="email"
                value={formulario.email}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Senha
              <input
                name="senha"
                type="password"
                value={formulario.senha}
                onChange={atualizarCampo}
                required
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
