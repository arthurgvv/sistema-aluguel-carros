package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.ContratoAluguel;
import br.com.aluguelcarros.model.ContratoCredito;
import br.com.aluguelcarros.service.ContratoAluguelService;
import br.com.aluguelcarros.service.ContratoCreditoService;
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
@RequestMapping("/contratos")
@CrossOrigin(origins = "http://localhost:5173")
public class ContratoController {

    private final ContratoAluguelService contratoAluguelService;
    private final ContratoCreditoService contratoCreditoService;

    public ContratoController(ContratoAluguelService contratoAluguelService,
                               ContratoCreditoService contratoCreditoService) {
        this.contratoAluguelService = contratoAluguelService;
        this.contratoCreditoService = contratoCreditoService;
    }

    // ---- Contratos de Aluguel ----

    @GetMapping("/aluguel")
    public ResponseEntity<List<ContratoAluguel>> listarContratosAluguel() {
        return ResponseEntity.ok(contratoAluguelService.listarContratos());
    }

    @GetMapping("/aluguel/{id}")
    public ResponseEntity<?> buscarContratoAluguelPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoAluguelService.buscarContratoPorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PostMapping("/aluguel")
    public ResponseEntity<?> criarContratoAluguel(@RequestBody ContratoAluguel contrato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratoAluguelService.criarContrato(contrato));
    }

    @PutMapping("/aluguel/{id}/assinar")
    public ResponseEntity<?> assinarContratoAluguel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoAluguelService.assinar(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/aluguel/{id}/encerrar")
    public ResponseEntity<?> encerrarContratoAluguel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoAluguelService.encerrar(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @DeleteMapping("/aluguel/{id}")
    public ResponseEntity<?> deletarContratoAluguel(@PathVariable Long id) {
        try {
            contratoAluguelService.deletarContrato(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    // ---- Contratos de Credito ----

    @GetMapping("/credito")
    public ResponseEntity<List<ContratoCredito>> listarContratosCredito() {
        return ResponseEntity.ok(contratoCreditoService.listarContratos());
    }

    @GetMapping("/credito/{id}")
    public ResponseEntity<?> buscarContratoCreditoPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoCreditoService.buscarContratoPorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PostMapping("/credito")
    public ResponseEntity<?> criarContratoCredito(@RequestBody ContratoCredito contrato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratoCreditoService.criarContrato(contrato));
    }

    @PutMapping("/credito/{id}/aprovar")
    public ResponseEntity<?> aprovarContratoCredito(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoCreditoService.aprovar(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/credito/{id}/recusar")
    public ResponseEntity<?> recusarContratoCredito(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contratoCreditoService.recusar(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @DeleteMapping("/credito/{id}")
    public ResponseEntity<?> deletarContratoCredito(@PathVariable Long id) {
        try {
            contratoCreditoService.deletarContrato(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
