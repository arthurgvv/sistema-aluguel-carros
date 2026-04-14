package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {
}
