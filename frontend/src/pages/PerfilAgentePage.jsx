import { useEffect, useState } from "react";
import { atualizarAgente, buscarAgentePorId } from "../services/clientesApi";
import {
  CNPJ_TAMANHO,
  montarPayloadAgente,
  sanitizarCampoAgente,
  sanitizarNumeros,
  validarFormularioAgente
} from "../utils/cadastroValidacao";

export default function PerfilAgentePage({ usuarioLogado, onAtualizar }) {
  const [formulario, setFormulario] = useState({
    nomeFantasia: "",
    login: "",
    senha: "",
    cnpj: "",
    ramoAtividade: "",
    setor: "",
    codigo: "",
    taxaJuros: ""
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const isBanco = usuarioLogado?.tipo === "BANCO";

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarAgentePorId(usuarioLogado.id);
        setFormulario({
          nomeFantasia: dados.nomeFantasia || "",
          login: dados.login || "",
          senha: dados.senha || "",
          cnpj: sanitizarNumeros(dados.cnpj || "", CNPJ_TAMANHO),
          ramoAtividade: dados.ramoAtividade || "",
          setor: dados.setor || "",
          codigo: dados.codigo || "",
          taxaJuros: dados.taxaJuros != null ? String(dados.taxaJuros) : ""
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
    setFormulario((atual) => ({ ...atual, [name]: sanitizarCampoAgente(name, value) }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    const erroValidacao = validarFormularioAgente(formulario);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);
    try {
      const atualizado = await atualizarAgente(usuarioLogado.id, montarPayloadAgente({ ...formulario, tipo: usuarioLogado.tipo }));
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
        <p className="page-subtitle">Atualize os dados da sua organizacao.</p>
      </header>

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid form-grid--2col">
          <label>
            Nome fantasia *
            <input name="nomeFantasia" value={formulario.nomeFantasia} onChange={atualizarCampo} required />
          </label>
          <label>
            Login (email) *
            <input name="login" type="email" value={formulario.login} onChange={atualizarCampo} required />
          </label>
          <label>
            Senha *
            <input name="senha" type="password" value={formulario.senha} onChange={atualizarCampo} required />
          </label>
          <label>
            CNPJ
            <input name="cnpj" value={formulario.cnpj} onChange={atualizarCampo} inputMode="numeric" maxLength={CNPJ_TAMANHO} />
          </label>

          {isBanco ? (
            <>
              <label>
                Codigo do banco
                <input name="codigo" value={formulario.codigo} onChange={atualizarCampo} />
              </label>
              <label>
                Taxa de juros (% a.m.)
                <input
                  name="taxaJuros"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.taxaJuros}
                  onChange={atualizarCampo}
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Ramo de atividade
                <input name="ramoAtividade" value={formulario.ramoAtividade} onChange={atualizarCampo} />
              </label>
              <label>
                Setor
                <input name="setor" value={formulario.setor} onChange={atualizarCampo} />
              </label>
            </>
          )}
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
