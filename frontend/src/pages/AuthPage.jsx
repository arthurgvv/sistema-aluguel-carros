import { useState } from "react";
import {
  cadastrarAgente,
  cadastrarCliente,
  loginUnificado
} from "../services/clientesApi";

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
  tipo: "EMPRESA"
};

export default function AuthPage({ onLoginSucesso }) {
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

  function atualizarCampo(setter) {
    return (event) => {
      const { name, value } = event.target;
      setter((atual) => ({ ...atual, [name]: value }));
    };
  }

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
    setCarregando(true);

    try {
      await cadastrarCliente({
        nome: cadastroClienteForm.nome,
        email: cadastroClienteForm.email,
        senha: cadastroClienteForm.senha,
        cpf: cadastroClienteForm.cpf || null,
        rg: cadastroClienteForm.rg || null,
        profissao: cadastroClienteForm.profissao || null,
        endereco: cadastroClienteForm.endereco || null
      });
      setCadastroClienteForm(cadastroClienteInicial);
      setLoginForm({ login: cadastroClienteForm.email, senha: "" });
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
    setCarregando(true);

    try {
      await cadastrarAgente({
        login: cadastroAgenteForm.login,
        senha: cadastroAgenteForm.senha,
        nomeFantasia: cadastroAgenteForm.nomeFantasia,
        cnpj: cadastroAgenteForm.cnpj || null,
        tipo: cadastroAgenteForm.tipo
      });
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
      {/* Left panel */}
      <div className="auth-split-left">
        <div className="auth-split-left-content">
          <div className="auth-brand-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="14" fill="rgba(255,255,255,0.12)" />
              <path d="M10 30 L14 20 C14.8 18.2 16.6 17 18.5 17 L37.5 17 C39.4 17 41.2 18.2 42 20 L46 30 L46 38 C46 39.1 45.1 40 44 40 L42 40 C42 41.7 40.7 43 39 43 C37.3 43 36 41.7 36 40 L20 40 C20 41.7 18.7 43 17 43 C15.3 43 14 41.7 14 40 L12 40 C10.9 40 10 39.1 10 38 Z" fill="white" opacity="0.9"/>
              <circle cx="17" cy="40" r="3" fill="rgba(17,93,67,0.8)" />
              <circle cx="39" cy="40" r="3" fill="rgba(17,93,67,0.8)" />
              <rect x="16" y="21" width="24" height="8" rx="2" fill="rgba(17,93,67,0.6)" />
              <rect x="10" y="31" width="36" height="2" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
          <h1 className="auth-brand-title">Sistema de<br />Aluguel de<br />Carros</h1>
          <p className="auth-brand-subtitle">
            Gerencie pedidos, contratos e veiculos em um unico lugar. Acesso para clientes e agentes.
          </p>
          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-dot" />
              Pedidos de aluguel online
            </div>
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-dot" />
              Contratos digitais
            </div>
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-dot" />
              Gestao de frota em tempo real
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {abaAtiva === "login" ? "Entrar na conta" : "Criar conta"}
            </h2>
            <p className="auth-form-subtitle">
              {abaAtiva === "login"
                ? "Informe suas credenciais para acessar o sistema."
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
                  onChange={atualizarCampo(setLoginForm)}
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
                  onChange={atualizarCampo(setLoginForm)}
                  required
                />
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
                        onChange={atualizarCampo(setCadastroClienteForm)}
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
                        onChange={atualizarCampo(setCadastroClienteForm)}
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
                        onChange={atualizarCampo(setCadastroClienteForm)}
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
                          placeholder="000.000.000-00"
                          value={cadastroClienteForm.cpf}
                          onChange={atualizarCampo(setCadastroClienteForm)}
                        />
                      </div>
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="cad-rg">RG</label>
                        <input
                          id="cad-rg"
                          className="auth-field-input"
                          name="rg"
                          type="text"
                          placeholder="00.000.000-0"
                          value={cadastroClienteForm.rg}
                          onChange={atualizarCampo(setCadastroClienteForm)}
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
                        onChange={atualizarCampo(setCadastroClienteForm)}
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
                        onChange={atualizarCampo(setCadastroClienteForm)}
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
                        onChange={atualizarCampo(setCadastroAgenteForm)}
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
                        onChange={atualizarCampo(setCadastroAgenteForm)}
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
                        onChange={atualizarCampo(setCadastroAgenteForm)}
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
                          placeholder="00.000.000/0000-00"
                          value={cadastroAgenteForm.cnpj}
                          onChange={atualizarCampo(setCadastroAgenteForm)}
                        />
                      </div>
                      <div className="auth-field">
                        <label className="auth-field-label" htmlFor="ag-tipo">Tipo *</label>
                        <select
                          id="ag-tipo"
                          className="auth-field-input auth-field-select"
                          name="tipo"
                          value={cadastroAgenteForm.tipo}
                          onChange={atualizarCampo(setCadastroAgenteForm)}
                          required
                        >
                          <option value="EMPRESA">Empresa</option>
                          <option value="BANCO">Banco</option>
                        </select>
                      </div>
                    </div>
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
