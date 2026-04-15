import { useEffect, useState } from "react";
import { atualizarCliente, buscarClientePorId } from "../services/clientesApi";
import {
  CPF_TAMANHO,
  RG_TAMANHO,
  montarPayloadCliente,
  sanitizarCampoCliente,
  sanitizarNumeros,
  sanitizarNomePessoa,
  validarFormularioCliente
} from "../utils/cadastroValidacao";

export default function PerfilClientePage({ usuarioLogado, onAtualizar }) {
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    rg: "",
    profissao: "",
    endereco: ""
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarClientePorId(usuarioLogado.id);
        setFormulario({
          nome: sanitizarNomePessoa(dados.nome || ""),
          email: dados.email || dados.login || "",
          senha: dados.senha || "",
          cpf: sanitizarNumeros(dados.cpf || "", CPF_TAMANHO),
          rg: sanitizarNumeros(dados.rg || "", RG_TAMANHO),
          profissao: dados.profissao || "",
          endereco: dados.endereco || ""
        });
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar os dados do perfil.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [usuarioLogado.id]);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: sanitizarCampoCliente(name, value) }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    const erroValidacao = validarFormularioCliente(formulario);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);
    try {
      const atualizado = await atualizarCliente(usuarioLogado.id, montarPayloadCliente(formulario));
      setMensagem("Perfil atualizado com sucesso.");
      if (onAtualizar) onAtualizar(atualizado);
    } catch (error) {
      setErro(error.message || "Nao foi possivel salvar as alteracoes.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <section className="page-card">
        <div className="empty-state"><h2>Carregando perfil...</h2></div>
      </section>
    );
  }

  return (
    <section className="page-card form-page">
      <header className="page-header">
        <p className="eyebrow">Conta</p>
        <h1>Meu perfil</h1>
        <p className="page-subtitle">Atualize seus dados pessoais.</p>
      </header>

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid form-grid--2col">
          <label>
            Nome *
            <input name="nome" value={formulario.nome} onChange={atualizarCampo} required />
          </label>
          <label>
            Email *
            <input name="email" type="email" value={formulario.email} onChange={atualizarCampo} required />
          </label>
          <label>
            Senha *
            <input name="senha" type="password" value={formulario.senha} onChange={atualizarCampo} required />
          </label>
          <label>
            CPF
            <input name="cpf" value={formulario.cpf} onChange={atualizarCampo} inputMode="numeric" maxLength={CPF_TAMANHO} />
          </label>
          <label>
            RG
            <input name="rg" value={formulario.rg} onChange={atualizarCampo} inputMode="numeric" maxLength={RG_TAMANHO} />
          </label>
          <label>
            Profissao
            <input name="profissao" value={formulario.profissao} onChange={atualizarCampo} />
          </label>
          <label>
            Endereco
            <input name="endereco" value={formulario.endereco} onChange={atualizarCampo} />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </form>
    </section>
  );
}
