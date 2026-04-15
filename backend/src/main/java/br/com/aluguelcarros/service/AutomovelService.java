package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Automovel;
import br.com.aluguelcarros.repository.AutomovelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelService(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public Automovel criarAutomovel(Automovel automovel) {
        validarCamposObrigatorios(automovel);

        if (automovelRepository.existsByMatriculaIgnoreCase(automovel.getMatricula())) {
            throw new IllegalArgumentException("Ja existe um automovel com esta matricula.");
        }
        if (automovelRepository.existsByPlacaIgnoreCase(automovel.getPlaca())) {
            throw new IllegalArgumentException("Ja existe um automovel com esta placa.");
        }

        automovel.setId(null);
        if (automovel.getIsDisponivel() == null) {
            automovel.setIsDisponivel(true);
        }
        return automovelRepository.save(automovel);
    }

    @Transactional(readOnly = true)
    public List<Automovel> listarAutomoveis() {
        return automovelRepository.findAllByOrderByMarcaAscModeloAsc();
    }

    @Transactional(readOnly = true)
    public List<Automovel> listarDisponiiveis() {
        return automovelRepository.findByIsDisponivelTrue();
    }

    @Transactional(readOnly = true)
    public Automovel buscarAutomovelPorId(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Automovel nao encontrado."));
    }

    @Transactional
    public Automovel atualizarAutomovel(Long id, Automovel automovelAtualizado) {
        validarCamposObrigatorios(automovelAtualizado);

        Automovel automovelExistente = buscarAutomovelPorId(id);

        if (automovelRepository.existsByMatriculaIgnoreCaseAndIdNot(automovelAtualizado.getMatricula(), id)) {
            throw new IllegalArgumentException("Ja existe outro automovel com esta matricula.");
        }
        if (automovelRepository.existsByPlacaIgnoreCaseAndIdNot(automovelAtualizado.getPlaca(), id)) {
            throw new IllegalArgumentException("Ja existe outro automovel com esta placa.");
        }

        automovelExistente.setMatricula(automovelAtualizado.getMatricula().trim());
        automovelExistente.setPlaca(automovelAtualizado.getPlaca().trim());
        automovelExistente.setMarca(automovelAtualizado.getMarca().trim());
        automovelExistente.setModelo(automovelAtualizado.getModelo().trim());
        automovelExistente.setAno(automovelAtualizado.getAno());
        if (automovelAtualizado.getIsDisponivel() != null) {
            automovelExistente.setIsDisponivel(automovelAtualizado.getIsDisponivel());
        }
        automovelExistente.setImagemBase64(automovelAtualizado.getImagemBase64());

        return automovelRepository.save(automovelExistente);
    }

    @Transactional
    public Automovel marcarDisponivel(Long id, boolean disponivel) {
        Automovel automovel = buscarAutomovelPorId(id);
        automovel.setIsDisponivel(disponivel);
        return automovelRepository.save(automovel);
    }

    @Transactional
    public void deletarAutomovel(Long id) {
        Automovel automovel = buscarAutomovelPorId(id);
        automovelRepository.delete(automovel);
    }

    private void validarCamposObrigatorios(Automovel automovel) {
        if (automovel == null) {
            throw new IllegalArgumentException("Os dados do automovel devem ser informados.");
        }
        if (automovel.getMatricula() == null || automovel.getMatricula().isBlank()) {
            throw new IllegalArgumentException("A matricula e obrigatoria.");
        }
        if (automovel.getPlaca() == null || automovel.getPlaca().isBlank()) {
            throw new IllegalArgumentException("A placa e obrigatoria.");
        }
        if (automovel.getMarca() == null || automovel.getMarca().isBlank()) {
            throw new IllegalArgumentException("A marca e obrigatoria.");
        }
        if (automovel.getModelo() == null || automovel.getModelo().isBlank()) {
            throw new IllegalArgumentException("O modelo e obrigatorio.");
        }
        if (automovel.getAno() == null) {
            throw new IllegalArgumentException("O ano e obrigatorio.");
        }
    }
}
