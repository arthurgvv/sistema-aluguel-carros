package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Automovel;
import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.model.ContratoAluguel;
import br.com.aluguelcarros.model.PedidoAluguel;
import br.com.aluguelcarros.model.StatusPedido;
import br.com.aluguelcarros.repository.AutomovelRepository;
import br.com.aluguelcarros.repository.ClienteRepository;
import br.com.aluguelcarros.repository.PedidoAluguelRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoAluguelService {

    private final PedidoAluguelRepository pedidoAluguelRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoAluguelService(PedidoAluguelRepository pedidoAluguelRepository,
                                 ClienteRepository clienteRepository,
                                 AutomovelRepository automovelRepository) {
        this.pedidoAluguelRepository = pedidoAluguelRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public PedidoAluguel criarPedido(PedidoAluguel pedido) {
        validarPedido(pedido);

        Cliente cliente = clienteRepository.findById(pedido.getCliente().getId())
                .orElseThrow(() -> new NoSuchElementException("Cliente nao encontrado."));
        Automovel automovel = automovelRepository.findById(pedido.getAutomovel().getId())
                .orElseThrow(() -> new NoSuchElementException("Automovel nao encontrado."));

        if (!Boolean.TRUE.equals(automovel.getIsDisponivel())) {
            throw new IllegalStateException("O automovel selecionado nao esta disponivel.");
        }

        pedido.setId(null);
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataPedido(LocalDate.now());

        if (pedido.getValorTotal() == null) {
            long dias = ChronoUnit.DAYS.between(pedido.getDataInicio(), pedido.getDataFim());
            pedido.setValorTotal((double) (dias > 0 ? dias : 1) * 100.0); // default 100/day
        }

        return pedidoAluguelRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoAluguel> listarTodos() {
        return pedidoAluguelRepository.findAll(Sort.by(Sort.Direction.DESC, "dataPedido"));
    }

    @Transactional(readOnly = true)
    public List<PedidoAluguel> listarPorCliente(Long clienteId) {
        return pedidoAluguelRepository.findByClienteId(clienteId,
                Sort.by(Sort.Direction.DESC, "dataPedido"));
    }

    @Transactional(readOnly = true)
    public PedidoAluguel buscarPorId(Long id) {
        return pedidoAluguelRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido nao encontrado."));
    }

    @Transactional
    public PedidoAluguel modificarPedido(Long id, PedidoAluguel pedidoAtualizado) {
        PedidoAluguel pedidoExistente = buscarPorId(id);

        if (pedidoExistente.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos com status PENDENTE podem ser modificados.");
        }

        if (pedidoAtualizado.getDataInicio() != null) {
            pedidoExistente.setDataInicio(pedidoAtualizado.getDataInicio());
        }
        if (pedidoAtualizado.getDataFim() != null) {
            pedidoExistente.setDataFim(pedidoAtualizado.getDataFim());
        }
        if (pedidoAtualizado.getValorTotal() != null) {
            pedidoExistente.setValorTotal(pedidoAtualizado.getValorTotal());
        }
        if (pedidoAtualizado.getAutomovel() != null && pedidoAtualizado.getAutomovel().getId() != null) {
            Automovel novoAutomovel = automovelRepository.findById(pedidoAtualizado.getAutomovel().getId())
                    .orElseThrow(() -> new NoSuchElementException("Automovel nao encontrado."));
            if (!Boolean.TRUE.equals(novoAutomovel.getIsDisponivel())) {
                throw new IllegalStateException("O automovel selecionado nao esta disponivel.");
            }
            pedidoExistente.setAutomovel(novoAutomovel);
        }

        return pedidoAluguelRepository.save(pedidoExistente);
    }

    @Transactional
    public PedidoAluguel cancelarPedido(Long id) {
        PedidoAluguel pedido = buscarPorId(id);

        if (pedido.getStatus() == StatusPedido.APROVADO || pedido.getStatus() == StatusPedido.CONCLUIDO) {
            throw new IllegalStateException("Pedido aprovado ou concluido nao pode ser cancelado.");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        return pedidoAluguelRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel avaliarPedido(Long id) {
        PedidoAluguel pedido = buscarPorId(id);

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos PENDENTES podem ser colocados em analise.");
        }

        pedido.setStatus(StatusPedido.EM_ANALISE);
        return pedidoAluguelRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel aprovarPedido(Long id) {
        PedidoAluguel pedido = buscarPorId(id);

        if (pedido.getStatus() != StatusPedido.EM_ANALISE && pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos PENDENTES ou EM_ANALISE podem ser aprovados.");
        }

        pedido.setStatus(StatusPedido.APROVADO);

        // Create ContratoAluguel automatically
        ContratoAluguel contrato = new ContratoAluguel();
        contrato.setAtivo(true);
        contrato.setDataAssinatura(LocalDate.now());
        contrato.setProprietario(pedido.getCliente().getNome());
        pedido.setContratoAluguel(contrato);

        // Mark automovel as unavailable
        Automovel automovel = pedido.getAutomovel();
        automovel.setIsDisponivel(false);
        automovelRepository.save(automovel);

        return pedidoAluguelRepository.save(pedido);
    }

    @Transactional
    public PedidoAluguel rejeitarPedido(Long id) {
        PedidoAluguel pedido = buscarPorId(id);

        if (pedido.getStatus() != StatusPedido.EM_ANALISE && pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos PENDENTES ou EM_ANALISE podem ser rejeitados.");
        }

        pedido.setStatus(StatusPedido.REJEITADO);
        return pedidoAluguelRepository.save(pedido);
    }

    private void validarPedido(PedidoAluguel pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Os dados do pedido devem ser informados.");
        }
        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            throw new IllegalArgumentException("O cliente e obrigatorio.");
        }
        if (pedido.getAutomovel() == null || pedido.getAutomovel().getId() == null) {
            throw new IllegalArgumentException("O automovel e obrigatorio.");
        }
        if (pedido.getDataInicio() == null) {
            throw new IllegalArgumentException("A data de inicio e obrigatoria.");
        }
        if (pedido.getDataFim() == null) {
            throw new IllegalArgumentException("A data de fim e obrigatoria.");
        }
        if (!pedido.getDataFim().isAfter(pedido.getDataInicio())) {
            throw new IllegalArgumentException("A data de fim deve ser posterior a data de inicio.");
        }
    }
}
