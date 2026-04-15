package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.ContratoCredito;
import br.com.aluguelcarros.model.PedidoAluguel;
import br.com.aluguelcarros.repository.ContratoCreditoRepository;
import br.com.aluguelcarros.repository.PedidoAluguelRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ContratoCreditoService {

    private final ContratoCreditoRepository contratoCreditoRepository;
    private final PedidoAluguelRepository pedidoAluguelRepository;

    public ContratoCreditoService(ContratoCreditoRepository contratoCreditoRepository,
                                   PedidoAluguelRepository pedidoAluguelRepository) {
        this.contratoCreditoRepository = contratoCreditoRepository;
        this.pedidoAluguelRepository = pedidoAluguelRepository;
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

        PedidoAluguel pedido = null;
        if (contrato.getPedidoAluguel() != null && contrato.getPedidoAluguel().getId() != null) {
            Long pedidoId = contrato.getPedidoAluguel().getId();
            pedido = pedidoAluguelRepository.findById(pedidoId)
                    .orElseThrow(() -> new NoSuchElementException("Pedido de aluguel nao encontrado."));
            if (pedido.getContratoCredito() != null) {
                throw new IllegalStateException("Este pedido ja possui um contrato de credito.");
            }
        }

        contrato.setPedidoAluguel(null); // evita conflito com mappedBy ao salvar
        ContratoCredito salvo = contratoCreditoRepository.save(contrato);

        if (pedido != null) {
            pedido.setContratoCredito(salvo);
            pedidoAluguelRepository.save(pedido);
        }

        return salvo;
    }

    @Transactional(readOnly = true)
    public List<ContratoCredito> listarContratos() {
        List<ContratoCredito> contratos = contratoCreditoRepository.findAll();
        contratos.forEach(this::anexarPedidoAluguel);
        return removerOrfaosEDuplicados(contratos);
    }

    @Transactional(readOnly = true)
    public List<ContratoCredito> listarContratosPorCliente(Long clienteId) {
        List<PedidoAluguel> pedidos = pedidoAluguelRepository.findByClienteId(
                clienteId,
                Sort.by(Sort.Direction.DESC, "dataPedido")
        );

        List<ContratoCredito> contratos = pedidos.stream()
                .map(PedidoAluguel::getContratoCredito)
                .filter(contrato -> contrato != null && contrato.getId() != null)
                .collect(Collectors.toList());

        contratos.forEach(contrato -> {
            if (contrato.getPedidoAluguel() == null) {
                contrato.setPedidoAluguel(pedidos.stream()
                        .filter(pedido -> pedido.getContratoCredito() != null
                                && contrato.getId().equals(pedido.getContratoCredito().getId()))
                        .findFirst()
                        .orElse(null));
            }
        });

        return removerOrfaosEDuplicados(contratos);
    }

    @Transactional(readOnly = true)
    public ContratoCredito buscarContratoPorId(Long id) {
        ContratoCredito contrato = contratoCreditoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Contrato de credito nao encontrado."));
        anexarPedidoAluguel(contrato);
        return contrato;
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
    public ContratoCredito cancelar(Long id) {
        ContratoCredito contrato = buscarContratoPorId(id);
        if (!"PENDENTE".equals(contrato.getStatus())) {
            throw new IllegalStateException("Apenas contratos PENDENTES podem ser cancelados.");
        }
        contrato.setStatus("CANCELADO");
        ContratoCredito salvo = contratoCreditoRepository.save(contrato);
        // desvincula do pedido para liberar nova emissão
        if (salvo.getPedidoAluguel() != null) {
            PedidoAluguel pedido = pedidoAluguelRepository.findById(salvo.getPedidoAluguel().getId())
                    .orElse(null);
            if (pedido != null) {
                pedido.setContratoCredito(null);
                pedidoAluguelRepository.save(pedido);
            }
        }
        return salvo;
    }

    @Transactional
    public void deletarContrato(Long id) {
        ContratoCredito contrato = buscarContratoPorId(id);
        contratoCreditoRepository.delete(contrato);
    }

    private void anexarPedidoAluguel(ContratoCredito contrato) {
        if (contrato == null || contrato.getId() == null || contrato.getPedidoAluguel() != null) {
            return;
        }
        pedidoAluguelRepository.findByContratoCreditoId(contrato.getId())
                .ifPresent(contrato::setPedidoAluguel);
    }

    private List<ContratoCredito> removerOrfaosEDuplicados(List<ContratoCredito> contratos) {
        if (contratos == null || contratos.isEmpty()) {
            return List.of();
        }

        // Nao exibe contratos sem pedido vinculado para evitar "Cliente #— / Pedido #—".
        List<ContratoCredito> comPedido = contratos.stream()
                .filter(contrato -> contrato.getPedidoAluguel() != null
                        && contrato.getPedidoAluguel().getId() != null)
                .collect(Collectors.toList());

        // Garante um unico contrato por pedido, mantendo o mais recente (maior id do contrato).
        Map<Long, ContratoCredito> porPedido = new LinkedHashMap<>();
        for (ContratoCredito contrato : comPedido) {
            Long pedidoId = contrato.getPedidoAluguel().getId();
            ContratoCredito existente = porPedido.get(pedidoId);
            if (existente == null || contrato.getId() > existente.getId()) {
                porPedido.put(pedidoId, contrato);
            }
        }

        return porPedido.values().stream()
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .collect(Collectors.toList());
    }
}
