package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.Agente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

    Optional<Agente> findByLoginIgnoreCase(String login);

    boolean existsByLoginIgnoreCase(String login);

    boolean existsByLoginIgnoreCaseAndIdNot(String login, Long id);

    boolean existsByCnpjIgnoreCase(String cnpj);

    boolean existsByCnpjIgnoreCaseAndIdNot(String cnpj, Long id);
}
