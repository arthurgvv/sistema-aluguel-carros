package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.Automovel;
import br.com.aluguelcarros.service.AutomovelService;
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
@RequestMapping("/automoveis")
@CrossOrigin(origins = "http://localhost:5173")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @PostMapping
    public ResponseEntity<?> criarAutomovel(@RequestBody Automovel automovel) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(automovelService.criarAutomovel(automovel));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Automovel>> listarAutomoveis() {
        return ResponseEntity.ok(automovelService.listarAutomoveis());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Automovel>> listarDisponiveis() {
        return ResponseEntity.ok(automovelService.listarDisponiiveis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarAutomovelPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(automovelService.buscarAutomovelPorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAutomovel(@PathVariable Long id, @RequestBody Automovel automovel) {
        try {
            return ResponseEntity.ok(automovelService.atualizarAutomovel(id, automovel));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/disponivel")
    public ResponseEntity<?> marcarDisponivel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(automovelService.marcarDisponivel(id, true));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/indisponivel")
    public ResponseEntity<?> marcarIndisponivel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(automovelService.marcarDisponivel(id, false));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAutomovel(@PathVariable Long id) {
        try {
            automovelService.deletarAutomovel(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
