package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.ContratoAluguel;
import br.com.aluguelcarros.repository.ContratoAluguelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoAluguelRepository;

    public ContratoAluguelService(ContratoAluguelRepository contratoAluguelRepository) {
        this.contratoAluguelRepository = contratoAluguelRepository;
    }

    @Transactional
    public ContratoAluguel criarContrato(ContratoAluguel contrato) {
        contrato.setId(null);
        contrato.setAtivo(false);
        return contratoAluguelRepository.save(contrato);
    }

    @Transactional(readOnly = true)
    public List<ContratoAluguel> listarContratos() {
        return contratoAluguelRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ContratoAluguel buscarContratoPorId(Long id) {
        return contratoAluguelRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Contrato de aluguel nao encontrado."));
    }

    @Transactional
    public ContratoAluguel assinar(Long id) {
        ContratoAluguel contrato = buscarContratoPorId(id);
        contrato.setAtivo(true);
        contrato.setDataAssinatura(LocalDate.now());
        return contratoAluguelRepository.save(contrato);
    }

    @Transactional
    public ContratoAluguel encerrar(Long id) {
        ContratoAluguel contrato = buscarContratoPorId(id);
        contrato.setAtivo(false);
        return contratoAluguelRepository.save(contrato);
    }

    @Transactional
    public void deletarContrato(Long id) {
        ContratoAluguel contrato = buscarContratoPorId(id);
        contratoAluguelRepository.delete(contrato);
    }
}
