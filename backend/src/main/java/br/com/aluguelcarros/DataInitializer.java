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

    private static final String IMG_TOYOTA     = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBkMTExNyIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iIzNmYjg4MjIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iIzNmYjg4MjMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBkMTExNyIgc3Ryb2tlPSIjM2ZiODgyNTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwZDExMTciIHN0cm9rZT0iIzNmYjg4MjU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjM2ZiODgyNjYiIGxldHRlci1zcGFjaW5nPSI0Ij5UT1lPVEE8L3RleHQ+PC9zdmc+";
    private static final String IMG_HONDA      = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBhMGUxNCIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iIzEwYjk4MTIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iIzEwYjk4MTMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBhMGUxNCIgc3Ryb2tlPSIjMTBiOTgxNTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwYTBlMTQiIHN0cm9rZT0iIzEwYjk4MTU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTBiOTgxNjYiIGxldHRlci1zcGFjaW5nPSI0Ij5IT05EQTwvdGV4dD48L3N2Zz4=";
    private static final String IMG_VOLKSWAGEN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBkMTExNyIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iIzYwYTVmYTIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iIzYwYTVmYTMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBkMTExNyIgc3Ryb2tlPSIjNjBhNWZhNTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwZDExMTciIHN0cm9rZT0iIzYwYTVmYTU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNjBhNWZhNjYiIGxldHRlci1zcGFjaW5nPSI0Ij5WT0xLU1dBR0VOPC90ZXh0Pjwvc3ZnPg==";
    private static final String IMG_CHEVROLET  = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBhMGUxNCIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iI2Y1OWUwYjIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iI2Y1OWUwYjMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBhMGUxNCIgc3Ryb2tlPSIjZjU5ZTBiNTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwYTBlMTQiIHN0cm9rZT0iI2Y1OWUwYjU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZjU5ZTBiNjYiIGxldHRlci1zcGFjaW5nPSI0Ij5DSEVWUk9MRVQ8L3RleHQ+PC9zdmc+";
    private static final String IMG_HYUNDAI    = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBkMTExNyIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iI2E3OGJmYTIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iI2E3OGJmYTMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBkMTExNyIgc3Ryb2tlPSIjYTc4YmZhNTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwZDExMTciIHN0cm9rZT0iI2E3OGJmYTU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjYTc4YmZhNjYiIGxldHRlci1zcGFjaW5nPSI0Ij5IWVVOREFJPC90ZXh0Pjwvc3ZnPg==";
    private static final String IMG_FORD       = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBhMGUxNCIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iI2ZiNzE4NTIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iI2ZiNzE4NTMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBhMGUxNCIgc3Ryb2tlPSIjZmI3MTg1NTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwYTBlMTQiIHN0cm9rZT0iI2ZiNzE4NTU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmI3MTg1NjYiIGxldHRlci1zcGFjaW5nPSI0Ij5GT1JEPC90ZXh0Pjwvc3ZnPg==";
    private static final String IMG_FIAT       = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBkMTExNyIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iIzM0ZDM5OTIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iIzM0ZDM5OTMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBkMTExNyIgc3Ryb2tlPSIjMzRkMzk5NTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwZDExMTciIHN0cm9rZT0iIzM0ZDM5OTU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMzRkMzk5NjYiIGxldHRlci1zcGFjaW5nPSI0Ij5GSUFUPC90ZXh0Pjwvc3ZnPg==";
    private static final String IMG_RENAULT    = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzBhMGUxNCIvPjxwYXRoIGQ9Ik01NSAxNTUgTDgwIDExMiBDODggOTcgMTA2IDg4IDEzMCA4OCBMMjcwIDg4IEMyOTQgODggMzEyIDk3IDMyMCAxMTIgTDM0NSAxNTUgTDM0NSAxNzMgUTM0NSAxODAgMzM3IDE4MCBMMzE4IDE4MCBRMzE2IDE5NSAzMDAgMTk1IFEyODQgMTk1IDI4MiAxODAgTDExOCAxODAgUTExNiAxOTUgMTAwIDE5NSBRODQgMTk1IDgyIDE4MCBMNjMgMTgwIFE1NSAxODAgNTUgMTczWiIgZmlsbD0iI2ZiYmYyNDIyIi8+PHBhdGggZD0iTTEzMCA4OCBMMTUwIDU4IEMxNTYgNDcgMTY3IDQyIDE4MiA0MiBMMjE4IDQyIEMyMzMgNDIgMjQ0IDQ3IDI1MCA1OCBMMjcwIDg4WiIgZmlsbD0iI2ZiYmYyNDMzIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTg4IiByPSIyMCIgZmlsbD0iIzBhMGUxNCIgc3Ryb2tlPSIjZmJiZjI0NTUiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4OCIgcj0iMjAiIGZpbGw9IiMwYTBlMTQiIHN0cm9rZT0iI2ZiYmYyNDU1IiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmJiZjI0NjYiIGxldHRlci1zcGFjaW5nPSI0Ij5SRU5BVUxUPC90ZXh0Pjwvc3ZnPg==";

    private void seedAutomoveis() {
        if (automovelRepository.count() == 0) {
            automovelRepository.save(automovel("ABC-001", "BRA2E19", "Toyota",     "Corolla",  2022, IMG_TOYOTA));
            automovelRepository.save(automovel("ABC-002", "DEF3F20", "Honda",      "Civic",    2023, IMG_HONDA));
            automovelRepository.save(automovel("ABC-003", "GHI4G21", "Volkswagen", "Polo",     2021, IMG_VOLKSWAGEN));
            automovelRepository.save(automovel("ABC-004", "JKL5H22", "Chevrolet",  "Onix",     2023, IMG_CHEVROLET));
            automovelRepository.save(automovel("ABC-005", "MNO6I23", "Hyundai",    "HB20",     2022, IMG_HYUNDAI));
            automovelRepository.save(automovel("ABC-006", "PQR7J24", "Ford",       "Ka",       2020, IMG_FORD));
            automovelRepository.save(automovel("ABC-007", "STU8K25", "Fiat",       "Argo",     2023, IMG_FIAT));
            automovelRepository.save(automovel("ABC-008", "VWX9L26", "Renault",    "Kwid",     2021, IMG_RENAULT));
        } else {
            preencherImagensAusentes();
        }
    }

    private void preencherImagensAusentes() {
        java.util.Map<String, String> imagens = new java.util.HashMap<>();
        imagens.put("Toyota",     IMG_TOYOTA);
        imagens.put("Honda",      IMG_HONDA);
        imagens.put("Volkswagen", IMG_VOLKSWAGEN);
        imagens.put("Chevrolet",  IMG_CHEVROLET);
        imagens.put("Hyundai",    IMG_HYUNDAI);
        imagens.put("Ford",       IMG_FORD);
        imagens.put("Fiat",       IMG_FIAT);
        imagens.put("Renault",    IMG_RENAULT);

        automovelRepository.findAll().forEach(auto -> {
            if (auto.getImagemBase64() == null || auto.getImagemBase64().isBlank()) {
                String img = imagens.get(auto.getMarca());
                if (img != null) {
                    auto.setImagemBase64(img);
                    automovelRepository.save(auto);
                }
            }
        });
    }

    private Automovel automovel(String matricula, String placa, String marca, String modelo, int ano, String imagem) {
        Automovel a = new Automovel();
        a.setMatricula(matricula);
        a.setPlaca(placa);
        a.setMarca(marca);
        a.setModelo(modelo);
        a.setAno(ano);
        a.setIsDisponivel(true);
        a.setImagemBase64(imagem);
        return a;
    }
}
