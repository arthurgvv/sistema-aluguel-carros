package br.com.aluguelcarros.repository;

import br.com.aluguelcarros.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    boolean existsByMatriculaIgnoreCase(String matricula);

    boolean existsByMatriculaIgnoreCaseAndIdNot(String matricula, Long id);

    boolean existsByPlacaIgnoreCase(String placa);

    boolean existsByPlacaIgnoreCaseAndIdNot(String placa, Long id);

    Optional<Automovel> findByMatriculaIgnoreCase(String matricula);

    List<Automovel> findByIsDisponivelTrue();

    List<Automovel> findAllByOrderByMarcaAscModeloAsc();
}
