import { useEffect, useState } from "react";
import { consumirMensagemTemporaria, deletarCliente, listarClientes } from "../services/clientesApi";

export default function ClientesPage({ clienteLogado, onEditarCliente, onNovoCliente, onSair }) {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState(() => consumirMensagemTemporaria() || "");

  async function carregarClientes() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await listarClientes();
      setClientes(resposta || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os clientes.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function excluir(id) {
    const confirmou = window.confirm("Deseja realmente excluir este cliente?");
    if (!confirmou) {
      return;
    }

    try {
      await deletarCliente(id);
      setMensagem("Cliente excluido com sucesso.");
      await carregarClientes();
    } catch (error) {
      setErro(error.message || "Nao foi possivel excluir o cliente.");
    }
  }

  return (
    <section className="page-card">
      <header className="split-header">
        <div>
          <p className="eyebrow">Tela principal do CRUD</p>
          <h1>Clientes cadastrados</h1>
          <p className="page-subtitle">
            Liste, edite e exclua clientes em uma pagina separada do formulario.
          </p>
        </div>

        <div className="header-actions">
          <div className="user-chip">
            <strong>{clienteLogado?.nome}</strong>
            <span>{clienteLogado?.email}</span>
          </div>

          <button type="button" className="secondary-button" onClick={onSair}>
            Sair
          </button>
        </div>
      </header>

      <div className="toolbar">
        <button type="button" className="primary-button" onClick={onNovoCliente}>
          Novo cliente
        </button>
        <button type="button" className="ghost-button" onClick={carregarClientes}>
          Atualizar lista
        </button>
      </div>

      {erro ? <p className="feedback error">{erro}</p> : null}
      {mensagem ? <p className="feedback success">{mensagem}</p> : null}

      {carregando ? (
        <div className="empty-state">
          <h2>Carregando clientes...</h2>
          <p>Aguarde a leitura dos registros no banco H2.</p>
        </div>
      ) : null}

      {!carregando && clientes.length === 0 ? (
        <div className="empty-state">
          <h2>Nenhum cliente cadastrado</h2>
          <p>Crie o primeiro cliente para iniciar o CRUD completo.</p>
        </div>
      ) : null}

      {!carregando && clientes.length > 0 ? (
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onEditarCliente(cliente.id)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => excluir(cliente.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
