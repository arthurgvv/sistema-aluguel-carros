package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.PedidoAluguel;
import br.com.aluguelcarros.model.StatusPedido;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByClienteId(Long clienteId, Sort sort);

    List<PedidoAluguel> findByStatus(StatusPedido status, Sort sort);

    Optional<PedidoAluguel> findByContratoCreditoId(Long contratoCreditoId);
}
