import { useState } from "react";
import {
  cadastrarAgente,
  cadastrarCliente,
  loginUnificado
} from "../services/clientesApi";
import {
  CNPJ_TAMANHO,
  CPF_TAMANHO,
  RG_TAMANHO,
  montarPayloadAgente,
  montarPayloadCliente,
  sanitizarCampoAgente,
  sanitizarCampoCliente,
  validarFormularioAgente,
  validarFormularioCliente
} from "../utils/cadastroValidacao";

const loginInicial = {
  login: "",
  senha: ""
};

const cadastroClienteInicial = {
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  rg: "",
  profissao: "",
  endereco: ""
};

const cadastroAgenteInicial = {
  login: "",
  senha: "",
  nomeFantasia: "",
  cnpj: "",
  tipo: "EMPRESA",
  ramoAtividade: "",
  setor: "",
  codigo: "",
  taxaJuros: ""
};

export default function AuthPage({ onLoginSucesso, onVoltarInicio }) {
  const [abaAtiva, setAbaAtiva] = useState("login");
  const [tipoRegistro, setTipoRegistro] = useState("cliente");
  const [loginForm, setLoginForm] = useState(loginInicial);
  const [cadastroClienteForm, setCadastroClienteForm] = useState(cadastroClienteInicial);
  const [cadastroAgenteForm, setCadastroAgenteForm] = useState(cadastroAgenteInicial);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  function mudarAba(aba) {
    setAbaAtiva(aba);
    setErro("");
    setMensagem("");
  }

  function atualizarCampo(setter, sanitizarValor) {
    return (event) => {
      const { name, value } = event.target;
      setter((atual) => ({
        ...atual,
        [name]: sanitizarValor ? sanitizarValor(name, value) : value
      }));
    };
  }

  const atualizarLoginForm = atualizarCampo(setLoginForm);
  const atualizarCadastroCliente = atualizarCampo(setCadastroClienteForm, sanitizarCampoCliente);
  const atualizarCadastroAgente = atualizarCampo(setCadastroAgenteForm, sanitizarCampoAgente);

  async function enviarLogin(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      const usuario = await loginUnificado({ login: loginForm.login, senha: loginForm.senha });
      setLoginForm(loginInicial);
      onLoginSucesso(usuario);
    } catch (error) {
      setErro(error.message || "Nao foi possivel realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCadastroCliente(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    const erroValidacao = validarFormularioCliente(cadastroClienteForm);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);

    try {
      const payloadCliente = montarPayloadCliente(cadastroClienteForm);
      await cadastrarCliente(payloadCliente);
      setCadastroClienteForm(cadastroClienteInicial);
      setLoginForm({ login: payloadCliente.email, senha: "" });
      mudarAba("login");
      setMensagem("Cadastro realizado com sucesso. Faca o login para continuar.");
    } catch (error) {
      setErro(error.message || "Nao foi possivel realizar o cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCadastroAgente(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    const erroValidacao = validarFormularioAgente(cadastroAgenteForm);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);

    try {
      const payloadAgente = montarPayloadAgente(cadastroAgenteForm);
      await cadastrarAgente(payloadAgente);
      setCadastroAgenteForm(cadastroAgenteInicial);
      setLoginForm({ login: cadastroAgenteForm.login, senha: "" });
      mudarAba("login");
      setMensagem("Agente cadastrado com sucesso. Faca o login para continuar.");
    } catch (error) {
      setErro(error.message || "Nao foi possivel realizar o cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-split-layout">
      {/* Left panel — foto + marca */}
      <div className="auth-split-left">
        <img src="/bg-car3.jpg" alt="" className="auth-left-img" aria-hidden="true" />
        <div className="auth-left-top">
          {onVoltarInicio && (
            <button type="button" className="auth-back-icon" onClick={onVoltarInicio} title="Voltar ao site">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>
          )}
        </div>
        <div className="auth-left-bottom">
          <p className="auth-left-eyebrow">A experiência VERBUM</p>
          <h2 className="auth-left-tagline">Redefinindo o padrão<br />da mobilidade.</h2>
        </div>
      </div>

      {/* Right panel — formulário */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <p className="auth-form-eyebrow">{abaAtiva === "login" ? "Acesso privado" : "Novo cadastro"}</p>
            <h2 className="auth-form-title">
              {abaAtiva === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h2>
            <p className="auth-form-subtitle">
              {abaAtiva === "login"
                ? "Informe suas credenciais para acessar sua frota."
                : "Preencha os dados para criar seu acesso."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab${abaAtiva === "login" ? " auth-tab--active" : ""}`}
              onClick={() => mudarAba("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab${abaAtiva === "cadastro" ? " auth-tab--active" : ""}`}
              onClick={() => mudarAba("cadastro")}
            >
              Cadastro
            </button>
          </div>

          {/* Feedback messages */}
          {erro && (
            <div className="auth-alert auth-alert--error">{erro}</div>
          )}
          {mensagem && (
            <div className="auth-alert auth-alert--success">{mensagem}</div>
          )}

          {/* Login form */}
          {abaAtiva === "login" && (
            <form className="auth-form-body" onSubmit={enviarLogin} autoComplete="off">
              <div className="autofill-trap" aria-hidden="true">
                <input tabIndex="-1" type="text" name="fake_u" autoComplete="username" />
                <input tabIndex="-1" type="password" name="fake_p" autoComplete="current-password" />
              </div>
              <div className="auth-field-grid">
                <div className="auth-field">
                  <label className="auth-field-label" htmlFor="login-email">
                    E-mail ou login
                  </label>
                  <input
                    id="login-email"
                    className="auth-field-input"
                    name="login"
                    type="text"
                    autoComplete="off"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    placeholder="seu@email.com"
                    value={loginForm.login}
                    onChange={atualizarLoginForm}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-field-label" htmlFor="login-senha">
                    Senha
                  </label>
                  <input
                    id="login-senha"
                    className="auth-field-input"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    placeholder="••••••••"
                    value={loginForm.senha}
                    onChange={atualizarLoginForm}
                    required
                  />
                </div>
              </div>
              <button className="auth-submit-btn" type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
              <p className="auth-switch-hint">
                Nao tem conta?{" "}
                <button type="button" className="auth-link-btn" onClick={() => mudarAba("cadastro")}>
                  Criar conta
                </button>
              </p>
            </form>
          )}

          {/* Registration form */}
          {abaAtiva === "cadastro" && (
            <>
              {/* User type selector */}
              <div className="auth-type-selector">
                <button
                  type="button"
                  className={`auth-type-btn${tipoRegistro === "cliente" ? " auth-type-btn--active" : ""}`}
                  onClick={() => setTipoRegistro("cliente")}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  className={`auth-type-btn${tipoRegistro === "agente" ? " auth-type-btn--active" : ""}`}
                  onClick={() => setTipoRegistro("agente")}
                >
                  Agente
                </button>
              </div>

              {/* Cliente registration */}
              {tipoRegistro === "cliente" && (
                <form className="auth-form-body" onSubmit={enviarCadastroCliente} autoComplete="off">
                  <div className="auth-field-grid">
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="cad-nome">Nome completo *</label>
                      <input
                        id="cad-nome"
                        className="auth-field-input"
                        name="nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={cadastroClienteForm.nome}
                        onChange={atualizarCadastroCliente}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="cad-email">E-mail *</label>
                      <input
                        id="cad-email"
                        className="auth-field-input"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        autoCapitalize="none"
                        value={cadastroClienteForm.email}
                        onChange={atualizarCadastroCliente}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="cad-senha">Senha *</label>
                      <input
                        id="cad-senha"
                        className="auth-field-input"
                        name="senha"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={cadastroClienteForm.senha}
                        onChange={atualizarCadastroCliente}
                        required
                      />
                    </div>
                    <div className="auth-field-row">
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="cad-cpf">CPF</label>
                        <input
                        id="cad-cpf"
                        className="auth-field-input"
                        name="cpf"
                        type="text"
                        inputMode="numeric"
                        maxLength={CPF_TAMANHO}
                        placeholder="000.000.000-00"
                        value={cadastroClienteForm.cpf}
                        onChange={atualizarCadastroCliente}
                      />
                      </div>
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="cad-rg">RG</label>
                        <input
                        id="cad-rg"
                        className="auth-field-input"
                        name="rg"
                        type="text"
                        inputMode="numeric"
                        maxLength={RG_TAMANHO}
                        placeholder="00.000.000-0"
                        value={cadastroClienteForm.rg}
                        onChange={atualizarCadastroCliente}
                      />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="cad-profissao">Profissao</label>
                      <input
                        id="cad-profissao"
                        className="auth-field-input"
                        name="profissao"
                        type="text"
                        placeholder="Ex: Engenheiro, Medico..."
                        value={cadastroClienteForm.profissao}
                        onChange={atualizarCadastroCliente}
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="cad-endereco">Endereco</label>
                      <input
                        id="cad-endereco"
                        className="auth-field-input"
                        name="endereco"
                        type="text"
                        placeholder="Rua, numero, bairro, cidade"
                        value={cadastroClienteForm.endereco}
                        onChange={atualizarCadastroCliente}
                      />
                    </div>
                  </div>
                  <button className="auth-submit-btn" type="submit" disabled={carregando}>
                    {carregando ? "Cadastrando..." : "Criar conta de cliente"}
                  </button>
                  <p className="auth-switch-hint">
                    Ja tem conta?{" "}
                    <button type="button" className="auth-link-btn" onClick={() => mudarAba("login")}>
                      Fazer login
                    </button>
                  </p>
                </form>
              )}

              {/* Agente registration */}
              {tipoRegistro === "agente" && (
                <form className="auth-form-body" onSubmit={enviarCadastroAgente} autoComplete="off">
                  <div className="auth-field-grid">
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="ag-login">Login (e-mail) *</label>
                      <input
                        id="ag-login"
                        className="auth-field-input"
                        name="login"
                        type="text"
                        placeholder="agente@empresa.com"
                        autoCapitalize="none"
                        value={cadastroAgenteForm.login}
                        onChange={atualizarCadastroAgente}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="ag-senha">Senha *</label>
                      <input
                        id="ag-senha"
                        className="auth-field-input"
                        name="senha"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={cadastroAgenteForm.senha}
                        onChange={atualizarCadastroAgente}
                        required
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-field-label" htmlFor="ag-nome">Nome fantasia *</label>
                      <input
                        id="ag-nome"
                        className="auth-field-input"
                        name="nomeFantasia"
                        type="text"
                        placeholder="Nome da empresa ou banco"
                        value={cadastroAgenteForm.nomeFantasia}
                        onChange={atualizarCadastroAgente}
                      />
                    </div>
                    <div className="auth-field-row">
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="ag-cnpj">CNPJ</label>
                        <input
                        id="ag-cnpj"
                        className="auth-field-input"
                        name="cnpj"
                        type="text"
                        inputMode="numeric"
                        maxLength={CNPJ_TAMANHO}
                        placeholder="00.000.000/0000-00"
                        value={cadastroAgenteForm.cnpj}
                        onChange={atualizarCadastroAgente}
                      />
                      </div>
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="ag-tipo">Tipo *</label>
                        <select
                          id="ag-tipo"
                          className="auth-field-input auth-field-select"
                          name="tipo"
                          value={cadastroAgenteForm.tipo}
                          onChange={atualizarCadastroAgente}
                          required
                        >
                          <option value="EMPRESA">Empresa</option>
                          <option value="BANCO">Banco</option>
                        </select>
                      </div>
                    </div>

                    {cadastroAgenteForm.tipo === "EMPRESA" && (
                      <div className="auth-field-row">
                        <div className="auth-field">
                          <label className="auth-field-label" htmlFor="ag-ramo">Ramo de atividade</label>
                          <input
                            id="ag-ramo"
                            className="auth-field-input"
                            name="ramoAtividade"
                            type="text"
                            placeholder="Ex: Locacao de veiculos"
                            value={cadastroAgenteForm.ramoAtividade}
                            onChange={atualizarCadastroAgente}
                          />
                        </div>
                        <div className="auth-field">
                          <label className="auth-field-label" htmlFor="ag-setor">Setor</label>
                          <input
                            id="ag-setor"
                            className="auth-field-input"
                            name="setor"
                            type="text"
                            placeholder="Ex: Transporte"
                            value={cadastroAgenteForm.setor}
                            onChange={atualizarCadastroAgente}
                          />
                        </div>
                      </div>
                    )}

                    {cadastroAgenteForm.tipo === "BANCO" && (
                      <div className="auth-field-row">
                        <div className="auth-field">
                          <label className="auth-field-label" htmlFor="ag-codigo">Codigo do banco</label>
                          <input
                            id="ag-codigo"
                            className="auth-field-input"
                            name="codigo"
                            type="text"
                            placeholder="Ex: 001"
                            value={cadastroAgenteForm.codigo}
                            onChange={atualizarCadastroAgente}
                          />
                        </div>
                        <div className="auth-field">
                          <label className="auth-field-label" htmlFor="ag-taxa">Taxa de juros (% a.m.) *</label>
                          <input
                            id="ag-taxa"
                            className="auth-field-input"
                            name="taxaJuros"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex: 1.5"
                            value={cadastroAgenteForm.taxaJuros}
                            onChange={atualizarCadastroAgente}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="auth-submit-btn" type="submit" disabled={carregando}>
                    {carregando ? "Cadastrando..." : "Criar conta de agente"}
                  </button>
                  <p className="auth-switch-hint">
                    Ja tem conta?{" "}
                    <button type="button" className="auth-link-btn" onClick={() => mudarAba("login")}>
                      Fazer login
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
