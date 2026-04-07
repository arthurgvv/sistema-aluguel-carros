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

export function loginCliente(payload) {
  return requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

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
