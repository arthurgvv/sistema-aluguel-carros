package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.PedidoAluguel;
import br.com.aluguelcarros.service.PedidoAluguelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoAluguelController {

    private final PedidoAluguelService pedidoAluguelService;

    public PedidoAluguelController(PedidoAluguelService pedidoAluguelService) {
        this.pedidoAluguelService = pedidoAluguelService;
    }

    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody PedidoAluguel pedido) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoAluguelService.criarPedido(pedido));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<PedidoAluguel>> listarTodos() {
        return ResponseEntity.ok(pedidoAluguelService.listarTodos());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoAluguel>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(pedidoAluguelService.listarPorCliente(clienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.buscarPorId(id));
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarPedido(@PathVariable Long id, @RequestBody PedidoAluguel pedido) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.modificarPedido(id, pedido));
        } catch (IllegalArgumentException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.cancelarPedido(id));
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<?> avaliarPedido(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.avaliarPedido(id));
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovarPedido(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.aprovarPedido(id));
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitarPedido(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoAluguelService.rejeitarPedido(id));
        } catch (IllegalStateException exception) {
            return erro(HttpStatus.UNPROCESSABLE_ENTITY, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
