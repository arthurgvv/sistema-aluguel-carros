import { useEffect, useState } from "react";
import { consumirMensagemTemporaria, deletarCliente, listarClientes } from "../services/clientesApi";

export default function ClientesPage({ onEditarCliente, onNovoCliente }) {
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
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
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
      <header className="page-header">
        <div>
          <p className="eyebrow">Painel do agente</p>
          <h1>Clientes</h1>
          <p className="page-subtitle">
            Gerencie os clientes cadastrados no sistema.
          </p>
        </div>
      </header>

      <div className="toolbar">
        <button type="button" className="primary-button" onClick={onNovoCliente}>
          + Novo cliente
        </button>
        <button type="button" className="ghost-button" onClick={carregarClientes}>
          Atualizar
        </button>
      </div>

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state">
          <h2>Carregando clientes...</h2>
        </div>
      )}

      {!carregando && clientes.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum cliente cadastrado</h2>
          <p>Clique em &ldquo;Novo cliente&rdquo; para cadastrar o primeiro.</p>
        </div>
      )}

      {!carregando && clientes.length > 0 && (
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Profissao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cpf || "—"}</td>
                  <td>{cliente.profissao || "—"}</td>
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
      )}
    </section>
  );
}
