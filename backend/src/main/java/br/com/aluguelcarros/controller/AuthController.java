package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.Agente;
import br.com.aluguelcarros.model.Banco;
import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.model.Empresa;
import br.com.aluguelcarros.model.LoginRequest;
import br.com.aluguelcarros.service.AgenteService;
import br.com.aluguelcarros.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final ClienteService clienteService;
    private final AgenteService agenteService;

    public AuthController(ClienteService clienteService, AgenteService agenteService) {
        this.clienteService = clienteService;
        this.agenteService = agenteService;
    }

    /**
     * Unified login: tries Cliente first, then Agente.
     * Returns the authenticated user with a "tipoUsuario" field appended.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", "Os dados de login devem ser informados."));
        }

        // Try as Cliente
        try {
            Cliente cliente = clienteService.login(loginRequest);
            Map<String, Object> resposta = clienteToMap(cliente);
            resposta.put("tipoUsuario", "CLIENTE");
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException ignored) {
            // not a client or wrong password - try agente
        }

        // Try as Agente
        try {
            Agente agente = agenteService.login(loginRequest);
            Map<String, Object> resposta = agenteToMap(agente);
            resposta.put("tipoUsuario", "AGENTE");
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", "Login ou senha incorretos."));
        }
    }

    /**
     * Explicit login for clients.
     */
    @PostMapping("/cliente/login")
    public ResponseEntity<?> loginCliente(@RequestBody LoginRequest loginRequest) {
        try {
            Cliente cliente = clienteService.login(loginRequest);
            Map<String, Object> resposta = clienteToMap(cliente);
            resposta.put("tipoUsuario", "CLIENTE");
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", exception.getMessage()));
        }
    }

    /**
     * Explicit login for agents.
     */
    @PostMapping("/agente/login")
    public ResponseEntity<?> loginAgente(@RequestBody LoginRequest loginRequest) {
        try {
            Agente agente = agenteService.login(loginRequest);
            Map<String, Object> resposta = agenteToMap(agente);
            resposta.put("tipoUsuario", "AGENTE");
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", exception.getMessage()));
        }
    }

    private Map<String, Object> clienteToMap(Cliente cliente) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", cliente.getId());
        map.put("login", cliente.getLogin());
        map.put("email", cliente.getEmail()); // backward compat
        map.put("nome", cliente.getNome());
        map.put("rg", cliente.getRg());
        map.put("cpf", cliente.getCpf());
        map.put("endereco", cliente.getEndereco());
        map.put("profissao", cliente.getProfissao());
        return map;
    }

    private Map<String, Object> agenteToMap(Agente agente) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", agente.getId());
        map.put("login", agente.getLogin());
        map.put("cnpj", agente.getCnpj());
        map.put("nomeFantasia", agente.getNomeFantasia());
        map.put("tipo", agente.getTipo());
        if (agente instanceof Banco banco) {
            map.put("codigo", banco.getCodigo());
            map.put("taxaJuros", banco.getTaxaJuros());
        } else if (agente instanceof Empresa empresa) {
            map.put("ramoAtividade", empresa.getRamoAtividade());
            map.put("setor", empresa.getSetor());
        }
        return map;
    }
}
