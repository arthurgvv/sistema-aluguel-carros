export const CPF_TAMANHO = 11;
export const RG_TAMANHO = 9;
export const CNPJ_TAMANHO = 14;

function extrairDigitos(valor) {
  return (valor || "").replace(/\D/g, "");
}

function limparTexto(valor) {
  const texto = valor?.trim();
  return texto ? texto : null;
}

export function sanitizarNomePessoa(valor) {
  return (valor || "").replace(/\d/g, "");
}

export function sanitizarNumeros(valor, tamanhoMaximo) {
  return extrairDigitos(valor).slice(0, tamanhoMaximo);
}

export function sanitizarCampoCliente(nomeCampo, valor) {
  if (nomeCampo === "nome") {
    return sanitizarNomePessoa(valor);
  }
  if (nomeCampo === "cpf") {
    return sanitizarNumeros(valor, CPF_TAMANHO);
  }
  if (nomeCampo === "rg") {
    return sanitizarNumeros(valor, RG_TAMANHO);
  }
  return valor;
}

export function sanitizarCampoAgente(nomeCampo, valor) {
  if (nomeCampo === "cnpj") {
    return sanitizarNumeros(valor, CNPJ_TAMANHO);
  }
  return valor;
}

export function validarFormularioCliente(formulario) {
  const nome = sanitizarNomePessoa(formulario.nome).trim();
  if (!nome) {
    return "O nome do cliente e obrigatorio.";
  }

  const cpf = extrairDigitos(formulario.cpf);
  if (cpf && cpf.length !== CPF_TAMANHO) {
    return "O CPF deve ter 11 numeros.";
  }

  const rg = extrairDigitos(formulario.rg);
  if (rg && rg.length !== RG_TAMANHO) {
    return "O RG deve ter 9 numeros.";
  }

  return "";
}

export function validarFormularioAgente(formulario) {
  const cnpj = extrairDigitos(formulario.cnpj);
  if (cnpj && cnpj.length !== CNPJ_TAMANHO) {
    return "O CNPJ deve ter 14 numeros.";
  }

  return "";
}

export function montarPayloadCliente(formulario) {
  return {
    nome: sanitizarNomePessoa(formulario.nome).trim(),
    email: (formulario.email || "").trim(),
    senha: formulario.senha || "",
    cpf: limparTexto(extrairDigitos(formulario.cpf)),
    rg: limparTexto(extrairDigitos(formulario.rg)),
    profissao: limparTexto(formulario.profissao),
    endereco: limparTexto(formulario.endereco)
  };
}

export function montarPayloadAgente(formulario) {
  const payload = {
    login: (formulario.login || "").trim(),
    senha: formulario.senha || "",
    nomeFantasia: limparTexto(formulario.nomeFantasia) || "",
    cnpj: limparTexto(extrairDigitos(formulario.cnpj)),
    tipo: formulario.tipo
  };

  if (formulario.tipo === "EMPRESA") {
    payload.ramoAtividade = limparTexto(formulario.ramoAtividade);
    payload.setor = limparTexto(formulario.setor);
  } else if (formulario.tipo === "BANCO") {
    payload.codigo = limparTexto(formulario.codigo);
    payload.taxaJuros = formulario.taxaJuros ? parseFloat(formulario.taxaJuros) : null;
  }

  return payload;
}
