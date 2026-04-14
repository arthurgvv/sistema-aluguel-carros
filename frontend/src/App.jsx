import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import AutomoveisPage from "./pages/AutomoveisPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import ClientesPage from "./pages/ClientesPage";
import NovoPedidoPage from "./pages/NovoPedidoPage";
import PedidosPage from "./pages/PedidosPage";

const STORAGE_KEY = "sistema-aluguel-carros-usuario-logado";

function lerUsuarioLogado() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
}

function lerRota() {
  const hash = window.location.hash || "#/auth";
  const rota = hash.replace(/^#/, "");
  const partes = rota.split("/").filter(Boolean);

  if (partes[0] === "clientes" && partes.length === 1) return { nome: "clientes" };
  if (partes[0] === "clientes" && partes[1] === "novo") return { nome: "novo-cliente" };
  if (partes[0] === "clientes" && partes[1] && partes[2] === "editar") {
    return { nome: "editar-cliente", id: Number(partes[1]) };
  }
  if (partes[0] === "automoveis") return { nome: "automoveis" };
  if (partes[0] === "pedidos" && partes.length === 1) return { nome: "pedidos" };
  if (partes[0] === "pedidos" && partes[1] === "novo") return { nome: "novo-pedido" };

  return { nome: "auth" };
}

function navegar(rota) {
  if (window.location.hash === rota) return;
  window.location.hash = rota;
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => lerUsuarioLogado());
  const [rotaAtual, setRotaAtual] = useState(() => lerRota());

  useEffect(() => {
    if (!window.location.hash) {
      navegar(usuarioLogado ? rotaInicial(usuarioLogado) : "#/auth");
    }
    const atualizarRota = () => setRotaAtual(lerRota());
    window.addEventListener("hashchange", atualizarRota);
    return () => window.removeEventListener("hashchange", atualizarRota);
  }, [usuarioLogado]);

  useEffect(() => {
    if (!usuarioLogado && rotaAtual.nome !== "auth") {
      navegar("#/auth");
    }
  }, [usuarioLogado, rotaAtual.nome]);

  function rotaInicial(usuario) {
    if (usuario?.tipoUsuario === "AGENTE") return "#/pedidos";
    return "#/clientes";
  }

  function registrarSessao(usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    setUsuarioLogado(usuario);
    navegar(rotaInicial(usuario));
  }

  function encerrarSessao() {
    localStorage.removeItem(STORAGE_KEY);
    setUsuarioLogado(null);
    navegar("#/auth");
  }

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";

  return (
    <main className="page-shell">
      {rotaAtual.nome === "auth" ? (
        <AuthPage
          onLoginSucesso={registrarSessao}
        />
      ) : null}

      {rotaAtual.nome === "clientes" && !isAgente ? (
        <ClientesPage
          clienteLogado={usuarioLogado}
          onEditarCliente={(id) => navegar(`#/clientes/${id}/editar`)}
          onNovoCliente={() => navegar("#/clientes/novo")}
          onSair={encerrarSessao}
          onVerAutomoveis={() => navegar("#/automoveis")}
          onVerPedidos={() => navegar("#/pedidos")}
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

      {rotaAtual.nome === "automoveis" ? (
        <AutomoveisPage
          usuarioLogado={usuarioLogado}
          onSair={encerrarSessao}
          onVoltar={() => navegar(isAgente ? "#/pedidos" : "#/clientes")}
        />
      ) : null}

      {rotaAtual.nome === "pedidos" ? (
        <PedidosPage
          usuarioLogado={usuarioLogado}
          onNovoPedido={() => navegar("#/pedidos/novo")}
          onSair={encerrarSessao}
          onVoltar={!isAgente ? () => navegar("#/clientes") : null}
        />
      ) : null}

      {rotaAtual.nome === "novo-pedido" && !isAgente ? (
        <NovoPedidoPage
          usuarioLogado={usuarioLogado}
          onCancelar={() => navegar("#/pedidos")}
          onSucesso={() => {
            navegar("#/pedidos");
          }}
        />
      ) : null}
    </main>
  );
}
