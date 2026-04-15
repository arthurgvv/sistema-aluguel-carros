const NAV_EMPRESA = [
  { rota: "clientes",   label: "Clientes" },
  { rota: "pedidos",    label: "Pedidos" },
  { rota: "automoveis", label: "Automoveis" },
  { rota: "perfil",     label: "Perfil" },
];

const NAV_BANCO = [
  { rota: "pedidos",           label: "Pedidos" },
  { rota: "automoveis",      label: "Frota" },
  { rota: "contratos-credito", label: "Contratos" },
  { rota: "perfil",            label: "Perfil" },
];

const NAV_CLIENTE = [
  { rota: "pedidos",      label: "Meus Pedidos" },
  { rota: "ofertas-credito", label: "Ofertas de Credito" },
  { rota: "automoveis",   label: "Frota" },
  { rota: "empregadores", label: "Empregadores" },
  { rota: "perfil",       label: "Perfil" },
];

const ROTA_PAI = {
  "novo-pedido":    "pedidos",
  "editar-pedido":  "pedidos",
  "credito-pedido": "pedidos",
  "ofertas-credito": "ofertas-credito",
  "novo-cliente":   "clientes",
  "editar-cliente": "clientes",
  "contratos-credito": "contratos-credito",
};

export default function Layout({ usuarioLogado, onSair, onNavegar, rotaAtual, children }) {
  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";
  const links = isAgente
    ? (usuarioLogado?.tipo === "BANCO" ? NAV_BANCO : NAV_EMPRESA)
    : NAV_CLIENTE;
  const nome = usuarioLogado?.nome || usuarioLogado?.nomeFantasia || usuarioLogado?.login || "";
  const tipo = usuarioLogado?.tipo || usuarioLogado?.tipoUsuario || "";
  const rotaAtiva = ROTA_PAI[rotaAtual] ?? rotaAtual;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">Locadora</span>
          <span className="sidebar-brand-sub">Sistema de Aluguel</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <button
              key={link.rota}
              className={`sidebar-link${rotaAtiva === link.rota ? " sidebar-link--active" : ""}`}
              onClick={() => onNavegar(`#/${link.rota}`)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{nome}</strong>
            <span>{tipo}</span>
          </div>
          <button className="sidebar-logout" onClick={onSair}>
            Sair
          </button>
        </div>
      </aside>

      <div className="layout-body">
        <header className="top-bar">
          <div className="top-bar-user">
            <strong>{nome}</strong>
            <span>{tipo}</span>
          </div>
        </header>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
