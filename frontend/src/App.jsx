import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import ClientesPage from "./pages/ClientesPage";

const STORAGE_KEY = "sistema-aluguel-carros-cliente-logado";

function lerClienteLogado() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  return salvo ? JSON.parse(salvo) : null;
}

function lerRota() {
  const hash = window.location.hash || "#/auth";
  const rota = hash.replace(/^#/, "");
  const partes = rota.split("/").filter(Boolean);

  if (partes[0] === "clientes" && partes.length === 1) {
    return { nome: "clientes" };
  }

  if (partes[0] === "clientes" && partes[1] === "novo") {
    return { nome: "novo-cliente" };
  }

  if (partes[0] === "clientes" && partes[1] && partes[2] === "editar") {
    return { nome: "editar-cliente", id: Number(partes[1]) };
  }

  return { nome: "auth" };
}

function navegar(rota) {
  if (window.location.hash === rota) {
    return;
  }

  window.location.hash = rota;
}

export default function App() {
  const [clienteLogado, setClienteLogado] = useState(() => lerClienteLogado());
  const [rotaAtual, setRotaAtual] = useState(() => lerRota());

  useEffect(() => {
    if (!window.location.hash) {
      navegar(clienteLogado ? "#/clientes" : "#/auth");
    }

    const atualizarRota = () => setRotaAtual(lerRota());
    window.addEventListener("hashchange", atualizarRota);

    return () => window.removeEventListener("hashchange", atualizarRota);
  }, [clienteLogado]);

  useEffect(() => {
    if (!clienteLogado && rotaAtual.nome !== "auth") {
      navegar("#/auth");
    }
  }, [clienteLogado, rotaAtual.nome]);

  function registrarSessao(cliente) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cliente));
    setClienteLogado(cliente);
    navegar("#/clientes");
  }

  function encerrarSessao() {
    localStorage.removeItem(STORAGE_KEY);
    setClienteLogado(null);
    navegar("#/auth");
  }

  return (
    <main className="page-shell">
      {rotaAtual.nome === "auth" ? (
        <AuthPage
          clienteLogado={clienteLogado}
          onAbrirClientes={() => navegar("#/clientes")}
          onLoginSucesso={registrarSessao}
        />
      ) : null}

      {rotaAtual.nome === "clientes" ? (
        <ClientesPage
          clienteLogado={clienteLogado}
          onEditarCliente={(id) => navegar(`#/clientes/${id}/editar`)}
          onNovoCliente={() => navegar("#/clientes/novo")}
          onSair={encerrarSessao}
        />
      ) : null}

      {rotaAtual.nome === "novo-cliente" ? (
        <ClienteFormPage
          modo="criar"
          onCancelar={() => navegar("#/clientes")}
          onSalvarSucesso={() => navegar("#/clientes")}
        />
      ) : null}

      {rotaAtual.nome === "editar-cliente" ? (
        <ClienteFormPage
          modo="editar"
          clienteId={rotaAtual.id}
          onCancelar={() => navegar("#/clientes")}
          onSalvarSucesso={() => navegar("#/clientes")}
        />
      ) : null}
    </main>
  );
}
