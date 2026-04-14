package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.Empregador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpregadorRepository extends JpaRepository<Empregador, Long> {

    List<Empregador> findByClienteId(Long clienteId);

    long countByClienteId(Long clienteId);
}
