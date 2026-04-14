package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Agente;
import br.com.aluguelcarros.model.LoginRequest;
import br.com.aluguelcarros.repository.AgenteRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AgenteService {

    private final AgenteRepository agenteRepository;

    public AgenteService(AgenteRepository agenteRepository) {
        this.agenteRepository = agenteRepository;
    }

    @Transactional
    public Agente criarAgente(Agente agente) {
        validarCamposObrigatorios(agente);

        String loginNormalizado = normalizarLogin(agente.getLogin());
        if (agenteRepository.existsByLoginIgnoreCase(loginNormalizado)) {
            throw new IllegalArgumentException("Ja existe um agente cadastrado com este login.");
        }
        if (agente.getCnpj() != null && agenteRepository.existsByCnpjIgnoreCase(agente.getCnpj())) {
            throw new IllegalArgumentException("Ja existe um agente cadastrado com este CNPJ.");
        }

        agente.setId(null);
        agente.setLogin(loginNormalizado);
        agente.setSenha(agente.getSenha().trim());
        if (agente.getNomeFantasia() != null) {
            agente.setNomeFantasia(agente.getNomeFantasia().trim());
        }
        return agenteRepository.save(agente);
    }

    @Transactional(readOnly = true)
    public List<Agente> listarAgentes() {
        return agenteRepository.findAll(Sort.by(Sort.Direction.ASC, "nomeFantasia"));
    }

    @Transactional(readOnly = true)
    public Agente buscarAgentePorId(Long id) {
        return agenteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agente nao encontrado."));
    }

    @Transactional
    public Agente atualizarAgente(Long id, Agente agenteAtualizado) {
        validarCamposObrigatorios(agenteAtualizado);

        Agente agenteExistente = buscarAgentePorId(id);
        String loginNormalizado = normalizarLogin(agenteAtualizado.getLogin());

        if (agenteRepository.existsByLoginIgnoreCaseAndIdNot(loginNormalizado, id)) {
            throw new IllegalArgumentException("Ja existe outro agente cadastrado com este login.");
        }
        if (agenteAtualizado.getCnpj() != null &&
                agenteRepository.existsByCnpjIgnoreCaseAndIdNot(agenteAtualizado.getCnpj(), id)) {
            throw new IllegalArgumentException("Ja existe outro agente cadastrado com este CNPJ.");
        }

        agenteExistente.setLogin(loginNormalizado);
        agenteExistente.setSenha(agenteAtualizado.getSenha().trim());
        agenteExistente.setNomeFantasia(agenteAtualizado.getNomeFantasia() != null
                ? agenteAtualizado.getNomeFantasia().trim()
                : null);
        agenteExistente.setCnpj(agenteAtualizado.getCnpj());
        agenteExistente.setTipo(agenteAtualizado.getTipo());

        return agenteRepository.save(agenteExistente);
    }

    @Transactional
    public void deletarAgente(Long id) {
        Agente agente = buscarAgentePorId(id);
        agenteRepository.delete(agente);
    }

    public Agente login(LoginRequest loginRequest) {
        if (loginRequest == null) {
            throw new IllegalArgumentException("Os dados de login devem ser informados.");
        }
        String identifier = loginRequest.getLogin();
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("O login deve ser informado.");
        }
        if (loginRequest.getSenha() == null || loginRequest.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha deve ser informada.");
        }

        String loginNormalizado = normalizarLogin(identifier);
        Agente agente = agenteRepository.findByLoginIgnoreCase(loginNormalizado)
                .orElseThrow(() -> new IllegalArgumentException("Agente nao encontrado."));

        if (!agente.getSenha().equals(loginRequest.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return agente;
    }

    private void validarCamposObrigatorios(Agente agente) {
        if (agente == null) {
            throw new IllegalArgumentException("Os dados do agente devem ser informados.");
        }
        if (agente.getLogin() == null || agente.getLogin().isBlank()) {
            throw new IllegalArgumentException("O login do agente e obrigatorio.");
        }
        if (agente.getSenha() == null || agente.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha do agente e obrigatoria.");
        }
        if (agente.getTipo() == null) {
            throw new IllegalArgumentException("O tipo do agente e obrigatorio.");
        }
    }

    private String normalizarLogin(String login) {
        return login.trim().toLowerCase();
    }
}
