package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.ContratoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoAluguelRepository extends JpaRepository<ContratoAluguel, Long> {
}
