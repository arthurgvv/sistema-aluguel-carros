package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.model.LoginRequest;
import br.com.aluguelcarros.repository.ClienteRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente criarCliente(Cliente cliente) {
        validarCamposObrigatorios(cliente);

        String emailNormalizado = normalizarEmail(cliente.getEmail());
        if (clienteRepository.existsByEmailIgnoreCase(emailNormalizado)) {
            throw new IllegalArgumentException("Ja existe um cliente cadastrado com este e-mail.");
        }

        cliente.setId(null);
        cliente.setNome(cliente.getNome().trim());
        cliente.setEmail(emailNormalizado);
        cliente.setSenha(cliente.getSenha().trim());
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente nao encontrado."));
    }

    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        validarCamposObrigatorios(clienteAtualizado);

        Cliente clienteExistente = buscarClientePorId(id);
        String emailNormalizado = normalizarEmail(clienteAtualizado.getEmail());

        if (clienteRepository.existsByEmailIgnoreCaseAndIdNot(emailNormalizado, id)) {
            throw new IllegalArgumentException("Ja existe outro cliente cadastrado com este e-mail.");
        }

        clienteExistente.setNome(clienteAtualizado.getNome().trim());
        clienteExistente.setEmail(emailNormalizado);
        clienteExistente.setSenha(clienteAtualizado.getSenha().trim());
        return clienteRepository.save(clienteExistente);
    }

    public void deletarCliente(Long id) {
        Cliente cliente = buscarClientePorId(id);
        clienteRepository.delete(cliente);
    }

    public Cliente login(LoginRequest loginRequest) {
        if (loginRequest == null) {
            throw new IllegalArgumentException("Os dados de login devem ser informados.");
        }
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isBlank()) {
            throw new IllegalArgumentException("O e-mail deve ser informado.");
        }
        if (loginRequest.getSenha() == null || loginRequest.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha deve ser informada.");
        }

        String emailNormalizado = normalizarEmail(loginRequest.getEmail());
        Cliente cliente = clienteRepository.findByEmailIgnoreCase(emailNormalizado)
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
        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            throw new IllegalArgumentException("O e-mail do cliente e obrigatorio.");
        }
        if (cliente.getSenha() == null || cliente.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha do cliente e obrigatoria.");
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}
