package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLoginIgnoreCase(String login);

    boolean existsByLoginIgnoreCase(String login);

    boolean existsByLoginIgnoreCaseAndIdNot(String login, Long id);

    // Backward-compat helpers that delegate to the login column
    default Optional<Cliente> findByEmailIgnoreCase(String email) {
        return findByLoginIgnoreCase(email);
    }

    default boolean existsByEmailIgnoreCase(String email) {
        return existsByLoginIgnoreCase(email);
    }

    default boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id) {
        return existsByLoginIgnoreCaseAndIdNot(email, id);
    }
}
