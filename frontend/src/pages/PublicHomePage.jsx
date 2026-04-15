import AutomoveisPage from "./AutomoveisPage";

export default function PublicHomePage({ onEntrar, onSelecionarAutomovel }) {
  return (
    <div className="public-site">
      <header className="public-top-bar">
        <img src="/bycarspng.png" alt="byCars" className="public-top-bar-logo" />
      </header>

      <section className="public-fleet-section">
        <AutomoveisPage
          usuarioLogado={null}
          onEntrar={onEntrar}
          onSelecionarAutomovel={onSelecionarAutomovel}
          acaoSelecionarLabel="Selecionar carro"
        />
      </section>
    </div>
  );
}
