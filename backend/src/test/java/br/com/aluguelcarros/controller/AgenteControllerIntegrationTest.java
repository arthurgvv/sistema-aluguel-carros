package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.repository.AgenteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb-agente;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class AgenteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AgenteRepository agenteRepository;

    @BeforeEach
    void setup() {
        agenteRepository.deleteAll();
    }

    @Test
    void naoDevePermitirCadastroDeAgenteComCnpjInvalido() throws Exception {
        String novoAgente = """
                {
                  "login": "agente@email.com",
                  "senha": "123456",
                  "nomeFantasia": "Agente Teste",
                  "cnpj": "12345",
                  "tipo": "EMPRESA"
                }
                """;

        mockMvc.perform(post("/agentes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novoAgente))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("O CNPJ deve ter 14 numeros."));
    }
}
