package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.Agente;
import br.com.aluguelcarros.service.AgenteService;
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
@RequestMapping("/agentes")
@CrossOrigin(origins = "http://localhost:5173")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @PostMapping
    public ResponseEntity<?> criarAgente(@RequestBody Agente agente) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(agenteService.criarAgente(agente));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Agente>> listarAgentes() {
        return ResponseEntity.ok(agenteService.listarAgentes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarAgentePorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(agenteService.buscarAgentePorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAgente(@PathVariable Long id, @RequestBody Agente agente) {
        try {
            return ResponseEntity.ok(agenteService.atualizarAgente(id, agente));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAgente(@PathVariable Long id) {
        try {
            agenteService.deletarAgente(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
