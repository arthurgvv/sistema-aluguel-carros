import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import AutomoveisPage from "./pages/AutomoveisPage";
import ClienteFormPage from "./pages/ClienteFormPage";
import ClientesPage from "./pages/ClientesPage";
import ContratoCreditoPage from "./pages/ContratoCreditoPage";
import EditarPedidoPage from "./pages/EditarPedidoPage";
import EmpregadoresPage from "./pages/EmpregadoresPage";
import NovoPedidoPage from "./pages/NovoPedidoPage";
import PedidosPage from "./pages/PedidosPage";
import PerfilClientePage from "./pages/PerfilClientePage";
import PerfilAgentePage from "./pages/PerfilAgentePage";
import Layout from "./components/Layout";

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
  if (partes[0] === "clientes" && partes[1] && partes[2] === "editar") return { nome: "editar-cliente", id: Number(partes[1]) };
  if (partes[0] === "clientes" && partes[1] === "empregadores") return { nome: "empregadores" };
  if (partes[0] === "empregadores") return { nome: "empregadores" };
  if (partes[0] === "automoveis") return { nome: "automoveis" };
  if (partes[0] === "pedidos" && partes.length === 1) return { nome: "pedidos" };
  if (partes[0] === "pedidos" && partes[1] === "novo") return { nome: "novo-pedido" };
  if (partes[0] === "pedidos" && partes[1] && partes[2] === "editar") return { nome: "editar-pedido", id: Number(partes[1]) };
  if (partes[0] === "pedidos" && partes[1] === "credito") return { nome: "credito-pedido" };
  if (partes[0] === "perfil") return { nome: "perfil" };

  return { nome: "auth" };
}

function navegar(rota) {
  if (window.location.hash === rota) return;
  window.location.hash = rota;
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => lerUsuarioLogado());
  const [rotaAtual, setRotaAtual] = useState(() => lerRota());
  const [pedidoCredito, setPedidoCredito] = useState(null);

  useEffect(() => {
    if (!window.location.hash) {
      navegar(usuarioLogado ? rotaInicial(usuarioLogado) : "#/auth");
    }
    const atualizarRota = () => setRotaAtual(lerRota());
    window.addEventListener("hashchange", atualizarRota);
    return () => window.removeEventListener("hashchange", atualizarRota);
  }, [usuarioLogado]);

  useEffect(() => {
    const logado = !!usuarioLogado;
    const agente = usuarioLogado?.tipoUsuario === "AGENTE";
    const rota = rotaAtual.nome;

    // Não logado tentando acessar rota protegida
    if (!logado && rota !== "auth") {
      navegar("#/auth");
      return;
    }

    // Logado tentando acessar tela de login
    if (logado && rota === "auth") {
      navegar(rotaInicial(usuarioLogado));
      return;
    }

    // Acesso indevido por perfil
    const banco = agente && usuarioLogado?.tipo === "BANCO";
    const empresa = agente && usuarioLogado?.tipo === "EMPRESA";
    const apenasEmpresa = ["clientes", "novo-cliente", "editar-cliente"];
    const apenasBanco   = ["credito-pedido"];
    const apenasCliente = ["novo-pedido", "editar-pedido", "empregadores"];
    if (logado && !agente && (apenasEmpresa.includes(rota) || apenasBanco.includes(rota))) {
      navegar(rotaInicial(usuarioLogado));
      return;
    }
    if (logado && agente && apenasCliente.includes(rota)) {
      navegar(rotaInicial(usuarioLogado));
      return;
    }
    if (logado && banco && apenasEmpresa.includes(rota)) {
      navegar(rotaInicial(usuarioLogado));
      return;
    }
    if (logado && empresa && apenasBanco.includes(rota)) {
      navegar(rotaInicial(usuarioLogado));
      return;
    }

    // #/pedidos/credito sem estado (ex: F5) → volta para pedidos
    if (rota === "credito-pedido" && !pedidoCredito) {
      navegar("#/pedidos");
    }
  }, [usuarioLogado, rotaAtual.nome, pedidoCredito]);

  function rotaInicial(usuario) {
    if (usuario?.tipoUsuario === "AGENTE" && usuario?.tipo !== "BANCO") return "#/clientes";
    return "#/pedidos";
  }

  function registrarSessao(usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    setUsuarioLogado(usuario);
    navegar(rotaInicial(usuario));
  }

  function atualizarSessao(usuario) {
    const atualizado = { ...usuarioLogado, ...usuario };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    setUsuarioLogado(atualizado);
  }

  function encerrarSessao() {
    localStorage.removeItem(STORAGE_KEY);
    setUsuarioLogado(null);
    navegar("#/auth");
  }

  function abrirCreditoPedido(pedido) {
    setPedidoCredito(pedido);
    navegar("#/pedidos/credito");
  }

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";
  const isBanco  = isAgente && usuarioLogado?.tipo === "BANCO";
  const isEmpresa = isAgente && usuarioLogado?.tipo === "EMPRESA";

  if (rotaAtual.nome === "auth") {
    return (
      <main className="page-shell">
        <AuthPage onLoginSucesso={registrarSessao} />
      </main>
    );
  }

  return (
    <Layout
      usuarioLogado={usuarioLogado}
      onSair={encerrarSessao}
      onNavegar={navegar}
      rotaAtual={rotaAtual.nome}
    >
      {/* Agente empresa: gestão de clientes */}
      {rotaAtual.nome === "clientes" && isEmpresa && (
        <ClientesPage
          onEditarCliente={(id) => navegar(`#/clientes/${id}/editar`)}
          onNovoCliente={() => navegar("#/clientes/novo")}
        />
      )}

      {/* Agente empresa: criar / editar cliente */}
      {rotaAtual.nome === "novo-cliente" && isEmpresa && (
        <ClienteFormPage
          modo="criar"
          onCancelar={() => navegar("#/clientes")}
          onSalvarSucesso={() => navegar("#/clientes")}
        />
      )}
      {rotaAtual.nome === "editar-cliente" && isEmpresa && (
        <ClienteFormPage
          modo="editar"
          clienteId={rotaAtual.id}
          onCancelar={() => navegar("#/clientes")}
          onSalvarSucesso={() => navegar("#/clientes")}
        />
      )}

      {/* Cliente: empregadores */}
      {rotaAtual.nome === "empregadores" && !isAgente && (
        <EmpregadoresPage usuarioLogado={usuarioLogado} />
      )}

      {/* Ambos: frota */}
      {rotaAtual.nome === "automoveis" && (
        <AutomoveisPage usuarioLogado={usuarioLogado} />
      )}

      {/* Ambos: pedidos */}
      {rotaAtual.nome === "pedidos" && (
        <PedidosPage
          usuarioLogado={usuarioLogado}
          onNovoPedido={!isAgente ? () => navegar("#/pedidos/novo") : null}
          onConcederCredito={isBanco ? abrirCreditoPedido : null}
        />
      )}

      {/* Cliente: criar / editar pedido */}
      {rotaAtual.nome === "novo-pedido" && !isAgente && (
        <NovoPedidoPage
          usuarioLogado={usuarioLogado}
          onCancelar={() => navegar("#/pedidos")}
          onSucesso={() => navegar("#/pedidos")}
        />
      )}
      {rotaAtual.nome === "editar-pedido" && !isAgente && (
        <EditarPedidoPage
          pedidoId={rotaAtual.id}
          onCancelar={() => navegar("#/pedidos")}
          onSucesso={() => navegar("#/pedidos")}
        />
      )}

      {/* Perfil */}
      {rotaAtual.nome === "perfil" && !isAgente && (
        <PerfilClientePage usuarioLogado={usuarioLogado} onAtualizar={atualizarSessao} />
      )}
      {rotaAtual.nome === "perfil" && isAgente && (
        <PerfilAgentePage usuarioLogado={usuarioLogado} onAtualizar={atualizarSessao} />
      )}

      {/* Agente banco: conceder crédito */}
      {rotaAtual.nome === "credito-pedido" && isBanco && pedidoCredito && (
        <ContratoCreditoPage
          pedido={pedidoCredito}
          usuarioLogado={usuarioLogado}
          onCancelar={() => navegar("#/pedidos")}
          onSucesso={() => {
            setPedidoCredito(null);
            navegar("#/pedidos");
          }}
        />
      )}
    </Layout>
  );
}
