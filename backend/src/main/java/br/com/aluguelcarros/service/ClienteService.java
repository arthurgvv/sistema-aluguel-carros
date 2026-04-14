package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.model.Empregador;
import br.com.aluguelcarros.model.LoginRequest;
import br.com.aluguelcarros.repository.ClienteRepository;
import br.com.aluguelcarros.repository.EmpregadorRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpregadorRepository empregadorRepository;

    public ClienteService(ClienteRepository clienteRepository, EmpregadorRepository empregadorRepository) {
        this.clienteRepository = clienteRepository;
        this.empregadorRepository = empregadorRepository;
    }

    @Transactional
    public Cliente criarCliente(Cliente cliente) {
        validarCamposObrigatorios(cliente);

        String loginNormalizado = normalizarLogin(resolverLogin(cliente));
        if (clienteRepository.existsByLoginIgnoreCase(loginNormalizado)) {
            throw new IllegalArgumentException("Ja existe um cliente cadastrado com este login.");
        }

        cliente.setId(null);
        cliente.setNome(cliente.getNome().trim());
        cliente.setLogin(loginNormalizado);
        cliente.setSenha(cliente.getSenha().trim());
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    @Transactional(readOnly = true)
    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente nao encontrado."));
    }

    @Transactional
    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        validarCamposObrigatorios(clienteAtualizado);

        Cliente clienteExistente = buscarClientePorId(id);
        String loginNormalizado = normalizarLogin(resolverLogin(clienteAtualizado));

        if (clienteRepository.existsByLoginIgnoreCaseAndIdNot(loginNormalizado, id)) {
            throw new IllegalArgumentException("Ja existe outro cliente cadastrado com este login.");
        }

        clienteExistente.setNome(clienteAtualizado.getNome().trim());
        clienteExistente.setLogin(loginNormalizado);
        clienteExistente.setSenha(clienteAtualizado.getSenha().trim());

        if (clienteAtualizado.getRg() != null) {
            clienteExistente.setRg(clienteAtualizado.getRg().trim());
        }
        if (clienteAtualizado.getCpf() != null) {
            clienteExistente.setCpf(clienteAtualizado.getCpf().trim());
        }
        if (clienteAtualizado.getEndereco() != null) {
            clienteExistente.setEndereco(clienteAtualizado.getEndereco().trim());
        }
        if (clienteAtualizado.getProfissao() != null) {
            clienteExistente.setProfissao(clienteAtualizado.getProfissao().trim());
        }

        return clienteRepository.save(clienteExistente);
    }

    @Transactional
    public void deletarCliente(Long id) {
        Cliente cliente = buscarClientePorId(id);
        clienteRepository.delete(cliente);
    }

    @Transactional
    public Cliente adicionarEmpregador(Long clienteId, Empregador empregador) {
        Cliente cliente = buscarClientePorId(clienteId);

        long total = empregadorRepository.countByClienteId(clienteId);
        if (total >= 3) {
            throw new IllegalStateException("Um cliente pode ter no maximo 3 empregadores.");
        }

        if (empregador.getNomeEmpresa() == null || empregador.getNomeEmpresa().isBlank()) {
            throw new IllegalArgumentException("O nome da empresa e obrigatorio.");
        }
        if (empregador.getRendimento() == null || empregador.getRendimento() <= 0) {
            throw new IllegalArgumentException("O rendimento deve ser um valor positivo.");
        }

        empregador.setId(null);
        empregador.setCliente(cliente);
        empregadorRepository.save(empregador);

        return buscarClientePorId(clienteId);
    }

    @Transactional
    public void removerEmpregador(Long clienteId, Long empregadorId) {
        Empregador empregador = empregadorRepository.findById(empregadorId)
                .orElseThrow(() -> new NoSuchElementException("Empregador nao encontrado."));

        if (!empregador.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException("Este empregador nao pertence ao cliente informado.");
        }

        empregadorRepository.delete(empregador);
    }

    public Cliente login(LoginRequest loginRequest) {
        if (loginRequest == null) {
            throw new IllegalArgumentException("Os dados de login devem ser informados.");
        }
        String identifier = loginRequest.getLogin();
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("O login (e-mail) deve ser informado.");
        }
        if (loginRequest.getSenha() == null || loginRequest.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha deve ser informada.");
        }

        String loginNormalizado = normalizarLogin(identifier);
        Cliente cliente = clienteRepository.findByLoginIgnoreCase(loginNormalizado)
                .orElseThrow(() -> new IllegalArgumentException("Cliente nao encontrado."));

        if (!cliente.getSenha().equals(loginRequest.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return cliente;
    }

    private void validarCamposObrigatorios(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Os dados do cliente devem ser informados.");
        }
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do cliente e obrigatorio.");
        }
        String login = resolverLogin(cliente);
        if (login == null || login.isBlank()) {
            throw new IllegalArgumentException("O login (e-mail) do cliente e obrigatorio.");
        }
        if (cliente.getSenha() == null || cliente.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha do cliente e obrigatoria.");
        }
    }

    private String resolverLogin(Cliente cliente) {
        // Support either login or email field sent from frontend
        if (cliente.getLogin() != null && !cliente.getLogin().isBlank()) {
            return cliente.getLogin();
        }
        return cliente.getEmail();
    }

    private String normalizarLogin(String login) {
        return login.trim().toLowerCase();
    }
}
