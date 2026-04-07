package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<?> criarCliente(@RequestBody Cliente cliente) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criarCliente(cliente));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarClientePorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(clienteService.buscarClientePorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        try {
            return ResponseEntity.ok(clienteService.atualizarCliente(id, cliente));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCliente(@PathVariable Long id) {
        try {
            clienteService.deletarCliente(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
