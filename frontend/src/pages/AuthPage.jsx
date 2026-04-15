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
  tipo: "EMPRESA",
  ramoAtividade: "",
  setor: "",
  codigo: "",
  taxaJuros: ""
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
      const payloadAgente = {
        login: cadastroAgenteForm.login,
        senha: cadastroAgenteForm.senha,
        nomeFantasia: cadastroAgenteForm.nomeFantasia,
        cnpj: cadastroAgenteForm.cnpj || null,
        tipo: cadastroAgenteForm.tipo
      };
      if (cadastroAgenteForm.tipo === "EMPRESA") {
        payloadAgente.ramoAtividade = cadastroAgenteForm.ramoAtividade || null;
        payloadAgente.setor = cadastroAgenteForm.setor || null;
      } else if (cadastroAgenteForm.tipo === "BANCO") {
        payloadAgente.codigo = cadastroAgenteForm.codigo || null;
        payloadAgente.taxaJuros = cadastroAgenteForm.taxaJuros ? parseFloat(cadastroAgenteForm.taxaJuros) : null;
      }
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
      {/* Left panel */}
      <div className="auth-split-left">
        <div className="auth-split-left-content">
          <div className="auth-brand-eyebrow">
            <span className="auth-brand-eyebrow-line" />
            <span className="auth-brand-eyebrow-text">Plataforma de Aluguel</span>
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
                            onChange={atualizarCampo(setCadastroAgenteForm)}
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
                            onChange={atualizarCampo(setCadastroAgenteForm)}
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
                            onChange={atualizarCampo(setCadastroAgenteForm)}
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
                            onChange={atualizarCampo(setCadastroAgenteForm)}
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
