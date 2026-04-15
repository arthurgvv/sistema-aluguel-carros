package br.com.aluguelcarros.service;

import br.com.aluguelcarros.model.Agente;
import br.com.aluguelcarros.model.Banco;
import br.com.aluguelcarros.model.Empresa;
import br.com.aluguelcarros.model.LoginRequest;
import br.com.aluguelcarros.repository.AgenteRepository;
import br.com.aluguelcarros.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final UsuarioRepository usuarioRepository;

    public AgenteService(AgenteRepository agenteRepository, UsuarioRepository usuarioRepository) {
        this.agenteRepository = agenteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Agente criarAgente(Agente agente) {
        validarCamposObrigatorios(agente);

        String loginNormalizado = normalizarLogin(agente.getLogin());
        String cnpjNormalizado = CadastroValidationUtils.normalizarDocumento(agente.getCnpj(), "CNPJ", 14);
        if (usuarioRepository.existsByLoginIgnoreCase(loginNormalizado)) {
            throw new IllegalArgumentException("Ja existe um usuario cadastrado com este login.");
        }
        if (cnpjJaExiste(cnpjNormalizado, null)) {
            throw new IllegalArgumentException("Ja existe um agente cadastrado com este CNPJ.");
        }

        agente.setId(null);
        agente.setLogin(loginNormalizado);
        agente.setSenha(agente.getSenha().trim());
        agente.setNomeFantasia(CadastroValidationUtils.normalizarTextoOpcional(agente.getNomeFantasia()));
        agente.setCnpj(cnpjNormalizado);
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
        String cnpjNormalizado = CadastroValidationUtils.normalizarDocumento(agenteAtualizado.getCnpj(), "CNPJ", 14);

        if (usuarioRepository.existsByLoginIgnoreCaseAndIdNot(loginNormalizado, id)) {
            throw new IllegalArgumentException("Ja existe outro usuario cadastrado com este login.");
        }
        if (cnpjJaExiste(cnpjNormalizado, id)) {
            throw new IllegalArgumentException("Ja existe outro agente cadastrado com este CNPJ.");
        }

        agenteExistente.setLogin(loginNormalizado);
        agenteExistente.setSenha(agenteAtualizado.getSenha().trim());
        agenteExistente.setNomeFantasia(CadastroValidationUtils.normalizarTextoOpcional(agenteAtualizado.getNomeFantasia()));
        agenteExistente.setCnpj(cnpjNormalizado);

        if (agenteExistente instanceof Banco bancoExistente && agenteAtualizado instanceof Banco bancoAtualizado) {
            bancoExistente.setCodigo(bancoAtualizado.getCodigo());
            bancoExistente.setTaxaJuros(bancoAtualizado.getTaxaJuros());
        } else if (agenteExistente instanceof Empresa empresaExistente && agenteAtualizado instanceof Empresa empresaAtualizada) {
            empresaExistente.setRamoAtividade(empresaAtualizada.getRamoAtividade());
            empresaExistente.setSetor(empresaAtualizada.getSetor());
        }

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

    private boolean cnpjJaExiste(String cnpjNormalizado, Long idIgnorado) {
        if (cnpjNormalizado == null) {
            return false;
        }

        return agenteRepository.findAll().stream()
                .filter(agente -> idIgnorado == null || !agente.getId().equals(idIgnorado))
                .map(agente -> CadastroValidationUtils.extrairDigitos(agente.getCnpj()))
                .anyMatch(cnpjNormalizado::equals);
    }
}
