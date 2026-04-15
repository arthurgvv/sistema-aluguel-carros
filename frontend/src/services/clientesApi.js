const FLASH_KEY = "sistema-aluguel-carros-flash";

async function lerCorpo(response) {
  const texto = await response.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

async function requisicao(url, options = {}) {
  const config = { ...options };
  const headers = { ...(options.headers || {}) };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  config.headers = headers;

  let response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new Error("Nao foi possivel conectar ao backend Spring Boot em http://localhost:8080.");
  }

  const data = await lerCorpo(response);

  if (!response.ok) {
    throw new Error(data?.erro || `Requisicao falhou com status ${response.status}.`);
  }

  return data;
}

export function salvarMensagemTemporaria(mensagem) {
  sessionStorage.setItem(FLASH_KEY, mensagem);
}

export function consumirMensagemTemporaria() {
  const mensagem = sessionStorage.getItem(FLASH_KEY);
  if (mensagem) {
    sessionStorage.removeItem(FLASH_KEY);
  }
  return mensagem;
}

// ---- Auth ----

export function loginUnificado(payload) {
  return requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginCliente(payload) {
  return requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginAgente(payload) {
  return requisicao("/auth/agente/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// ---- Clientes ----

export function cadastrarCliente(payload) {
  return requisicao("/clientes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listarClientes() {
  return requisicao("/clientes");
}

export function buscarClientePorId(id) {
  return requisicao(`/clientes/${id}`);
}

export function atualizarCliente(id, payload) {
  return requisicao(`/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deletarCliente(id) {
  return requisicao(`/clientes/${id}`, {
    method: "DELETE"
  });
}

export function adicionarEmpregador(clienteId, payload) {
  return requisicao(`/clientes/${clienteId}/empregadores`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function removerEmpregador(clienteId, empregadorId) {
  return requisicao(`/clientes/${clienteId}/empregadores/${empregadorId}`, {
    method: "DELETE"
  });
}

// ---- Agentes ----

export function cadastrarAgente(payload) {
  return requisicao("/agentes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listarAgentes() {
  return requisicao("/agentes");
}

export function buscarAgentePorId(id) {
  return requisicao(`/agentes/${id}`);
}

export function atualizarAgente(id, payload) {
  return requisicao(`/agentes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deletarAgente(id) {
  return requisicao(`/agentes/${id}`, {
    method: "DELETE"
  });
}

// ---- Automoveis ----

export function listarAutomoveis() {
  return requisicao("/automoveis");
}

export function listarAutomoveisDisponiveis() {
  return requisicao("/automoveis/disponiveis");
}

export function buscarAutomovelPorId(id) {
  return requisicao(`/automoveis/${id}`);
}

export function cadastrarAutomovel(payload) {
  return requisicao("/automoveis", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function atualizarAutomovel(id, payload) {
  return requisicao(`/automoveis/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deletarAutomovel(id) {
  return requisicao(`/automoveis/${id}`, {
    method: "DELETE"
  });
}

export function marcarAutomovelDisponivel(id) {
  return requisicao(`/automoveis/${id}/disponivel`, { method: "PUT" });
}

export function marcarAutomovelIndisponivel(id) {
  return requisicao(`/automoveis/${id}/indisponivel`, { method: "PUT" });
}

// ---- Pedidos de Aluguel ----

export function criarPedido(payload) {
  return requisicao("/pedidos", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listarPedidos() {
  return requisicao("/pedidos");
}

export function listarPedidosPorCliente(clienteId) {
  return requisicao(`/pedidos/cliente/${clienteId}`);
}

export function buscarPedidoPorId(id) {
  return requisicao(`/pedidos/${id}`);
}

export function modificarPedido(id, payload) {
  return requisicao(`/pedidos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function cancelarPedido(id) {
  return requisicao(`/pedidos/${id}/cancelar`, { method: "PUT" });
}

export function avaliarPedido(id) {
  return requisicao(`/pedidos/${id}/avaliar`, { method: "PUT" });
}

export function aprovarPedido(id) {
  return requisicao(`/pedidos/${id}/aprovar`, { method: "PUT" });
}

export function rejeitarPedido(id) {
  return requisicao(`/pedidos/${id}/rejeitar`, { method: "PUT" });
}

// ---- Contratos de Aluguel ----

export function listarContratosAluguel() {
  return requisicao("/contratos/aluguel");
}

export function assinarContratoAluguel(id) {
  return requisicao(`/contratos/aluguel/${id}/assinar`, { method: "PUT" });
}

export function encerrarContratoAluguel(id) {
  return requisicao(`/contratos/aluguel/${id}/encerrar`, { method: "PUT" });
}

// ---- Contratos de Credito ----

export function listarContratosCredito() {
  return requisicao("/contratos/credito");
}

export function listarOfertasCreditoCliente(clienteId) {
  return requisicao(`/contratos/credito/cliente/${clienteId}`);
}

export function aprovarContratoCredito(id) {
  return requisicao(`/contratos/credito/${id}/aprovar`, { method: "PUT" });
}

export function recusarContratoCredito(id) {
  return requisicao(`/contratos/credito/${id}/recusar`, { method: "PUT" });
}

export function criarContratoCredito(payload) {
  return requisicao("/contratos/credito", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function cancelarContratoCredito(id) {
  return requisicao(`/contratos/credito/${id}/cancelar`, { method: "PUT" });
}
