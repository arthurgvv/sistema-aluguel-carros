package br.com.aluguelcarros;

import br.com.aluguelcarros.model.Agente;
import br.com.aluguelcarros.model.Automovel;
import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.model.TipoAgente;
import br.com.aluguelcarros.repository.AgenteRepository;
import br.com.aluguelcarros.repository.AutomovelRepository;
import br.com.aluguelcarros.repository.ClienteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;
    private final ClienteRepository clienteRepository;

    public DataInitializer(AutomovelRepository automovelRepository,
                           AgenteRepository agenteRepository,
                           ClienteRepository clienteRepository) {
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
        this.clienteRepository = clienteRepository;
    }

    @Override
    public void run(String... args) {
        seedAgente();
        seedCliente();
        seedAutomoveis();
    }

    private void seedAgente() {
        if (agenteRepository.count() > 0) return;

        Agente agente = new Agente();
        agente.setLogin("agente@locadora.com");
        agente.setSenha("Agente123");
        agente.setNomeFantasia("Locadora Premium Ltda");
        agente.setCnpj("12.345.678/0001-90");
        agente.setTipo(TipoAgente.EMPRESA);
        agenteRepository.save(agente);
    }

    private void seedCliente() {
        if (clienteRepository.count() > 0) return;

        Cliente cliente = new Cliente();
        cliente.setLogin("carlos.mendes@email.com");
        cliente.setSenha("Senha123");
        cliente.setNome("Carlos Eduardo Mendes");
        cliente.setCpf("123.456.789-09");
        cliente.setRg("12.345.678-9");
        cliente.setProfissao("Engenheiro Civil");
        cliente.setEndereco("Rua das Flores, 142, Jardim Paulista, São Paulo");
        clienteRepository.save(cliente);
    }

    private void seedAutomoveis() {
        if (automovelRepository.count() > 0) return;

        automovelRepository.save(automovel("ABC-001", "BRA2E19", "Toyota",     "Corolla",  2022));
        automovelRepository.save(automovel("ABC-002", "DEF3F20", "Honda",      "Civic",    2023));
        automovelRepository.save(automovel("ABC-003", "GHI4G21", "Volkswagen", "Polo",     2021));
        automovelRepository.save(automovel("ABC-004", "JKL5H22", "Chevrolet",  "Onix",     2023));
        automovelRepository.save(automovel("ABC-005", "MNO6I23", "Hyundai",    "HB20",     2022));
        automovelRepository.save(automovel("ABC-006", "PQR7J24", "Ford",       "Ka",       2020));
        automovelRepository.save(automovel("ABC-007", "STU8K25", "Fiat",       "Argo",     2023));
        automovelRepository.save(automovel("ABC-008", "VWX9L26", "Renault",    "Kwid",     2021));
    }

    private Automovel automovel(String matricula, String placa, String marca, String modelo, int ano) {
        Automovel a = new Automovel();
        a.setMatricula(matricula);
        a.setPlaca(placa);
        a.setMarca(marca);
        a.setModelo(modelo);
        a.setAno(ano);
        a.setIsDisponivel(true);
        return a;
    }
}
