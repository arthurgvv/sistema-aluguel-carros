import { useState } from "react";
import { cadastrarCliente, loginCliente } from "../services/clientesApi";

const loginInicial = {
  email: "",
  senha: ""
};

const cadastroInicial = {
  nome: "",
  email: "",
  senha: ""
};

export default function AuthPage({ clienteLogado, onAbrirClientes, onLoginSucesso }) {
  const [abaAtiva, setAbaAtiva] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInicial);
  const [cadastroForm, setCadastroForm] = useState(cadastroInicial);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  function atualizarFormulario(setter) {
    return (event) => {
      const campo = event.target.dataset.field;
      const { value } = event.target;
      setter((atual) => ({
        ...atual,
        [campo]: value
      }));
    };
  }

  async function enviarLogin(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      const cliente = await loginCliente(loginForm);
      setLoginForm(loginInicial);
      onLoginSucesso(cliente);
    } catch (error) {
      setErro(error.message || "Nao foi possivel realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCadastro(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");
    setCarregando(true);

    try {
      await cadastrarCliente(cadastroForm);
      setCadastroForm(cadastroInicial);
      setLoginForm({
        email: cadastroForm.email,
        senha: ""
      });
      setAbaAtiva("login");
      setMensagem("Cliente cadastrado com sucesso. Agora faca o login.");
    } catch (error) {
      setErro(error.message || "Nao foi possivel cadastrar o cliente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="page-card auth-card">
      <header className="page-header auth-header">
        <h1 className="auth-title">Sistema de Aluguel de Carros</h1>
      </header>

      {clienteLogado ? (
        <div className="session-banner">
          <div>
            <strong>Cliente logado:</strong> {clienteLogado.nome}
            <span>{clienteLogado.email}</span>
          </div>

          <button type="button" className="secondary-button" onClick={onAbrirClientes}>
            Abrir CRUD de clientes
          </button>
        </div>
      ) : null}

      <div className="auth-switch" role="tablist" aria-label="Autenticacao">
        <button
          type="button"
          className={abaAtiva === "login" ? "auth-switch-button active" : "auth-switch-button"}
          onClick={() => {
            setAbaAtiva("login");
            setErro("");
            setMensagem("");
          }}
        >
          Iniciar sessao
        </button>
        <span className="auth-switch-separator">ou</span>
        <button
          type="button"
          className={abaAtiva === "cadastro" ? "auth-switch-button active" : "auth-switch-button"}
          onClick={() => {
            setAbaAtiva("cadastro");
            setErro("");
            setMensagem("");
          }}
        >
          Registrar-se
        </button>
      </div>

      {erro ? <p className="feedback auth-feedback error">{erro}</p> : null}
      {mensagem ? <p className="feedback auth-feedback success">{mensagem}</p> : null}

      {abaAtiva === "login" ? (
        <form
          className="form-card auth-form"
          onSubmit={enviarLogin}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
        >
          <div className="autofill-trap" aria-hidden="true">
            <input tabIndex="-1" type="text" name="fake_login_user" autoComplete="username" />
            <input tabIndex="-1" type="password" name="fake_login_password" autoComplete="current-password" />
          </div>

          <div className="form-grid">
            <label>
              E-mail
              <input
                name="login_identificador"
                data-field="email"
                type="text"
                autoComplete="off"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                value={loginForm.email}
                onChange={atualizarFormulario(setLoginForm)}
                required
              />
            </label>

            <label>
              Senha
              <input
                name="login_chave"
                data-field="senha"
                type="password"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                value={loginForm.senha}
                onChange={atualizarFormulario(setLoginForm)}
                required
              />
            </label>
          </div>
          <button className="primary-button auth-submit" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form
          className="form-card auth-form"
          onSubmit={enviarCadastro}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
        >
          <div className="autofill-trap" aria-hidden="true">
            <input tabIndex="-1" type="text" name="fake_signup_user" autoComplete="username" />
            <input tabIndex="-1" type="password" name="fake_signup_password" autoComplete="new-password" />
          </div>

          <div className="form-grid">
            <label>
              Nome
              <input
                name="cadastro_nome"
                data-field="nome"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                value={cadastroForm.nome}
                onChange={atualizarFormulario(setCadastroForm)}
                required
              />
            </label>

            <label>
              E-mail
              <input
                name="cadastro_identificador"
                data-field="email"
                type="text"
                autoComplete="off"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                value={cadastroForm.email}
                onChange={atualizarFormulario(setCadastroForm)}
                required
              />
            </label>

            <label>
              Senha
              <input
                name="cadastro_chave"
                data-field="senha"
                type="password"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                value={cadastroForm.senha}
                onChange={atualizarFormulario(setCadastroForm)}
                required
              />
            </label>
          </div>
          <button className="primary-button auth-submit" type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar cliente"}
          </button>
        </form>
      )}
    </section>
  );
}
