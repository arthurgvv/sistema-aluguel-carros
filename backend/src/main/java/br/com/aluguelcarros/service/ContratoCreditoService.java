package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.ContratoCredito;
import br.com.aluguelcarros.repository.ContratoCreditoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ContratoCreditoService {

    private final ContratoCreditoRepository contratoCreditoRepository;

    public ContratoCreditoService(ContratoCreditoRepository contratoCreditoRepository) {
        this.contratoCreditoRepository = contratoCreditoRepository;
    }

    @Transactional
    public ContratoCredito criarContrato(ContratoCredito contrato) {
        contrato.setId(null);
        if (contrato.getStatus() == null) {
            contrato.setStatus("PENDENTE");
        }
        if (contrato.getDataConcessao() == null) {
            contrato.setDataConcessao(LocalDate.now());
        }
        return contratoCreditoRepository.save(contrato);
    }

    @Transactional(readOnly = true)
    public List<ContratoCredito> listarContratos() {
        return contratoCreditoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ContratoCredito buscarContratoPorId(Long id) {
        return contratoCreditoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Contrato de credito nao encontrado."));
    }

    @Transactional
    public ContratoCredito aprovar(Long id) {
        ContratoCredito contrato = buscarContratoPorId(id);
        contrato.setStatus("APROVADO");
        return contratoCreditoRepository.save(contrato);
    }

    @Transactional
    public ContratoCredito recusar(Long id) {
        ContratoCredito contrato = buscarContratoPorId(id);
        contrato.setStatus("RECUSADO");
        return contratoCreditoRepository.save(contrato);
    }

    @Transactional
    public void deletarContrato(Long id) {
        ContratoCredito contrato = buscarContratoPorId(id);
        contratoCreditoRepository.delete(contrato);
    }
}
