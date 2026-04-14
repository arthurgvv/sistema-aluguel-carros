package br.com.aluguelcarros.controller;

import br.com.aluguelcarros.model.Cliente;
import br.com.aluguelcarros.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class ClienteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ClienteRepository clienteRepository;

    @BeforeEach
    void setup() {
        clienteRepository.deleteAll();
    }

    @Test
    void deveExecutarCrudCompletoDeCliente() throws Exception {
        // Create client - using 'email' field (backward compat with login field)
        String novoCliente = """
                {
                  "nome": "Ana Silva",
                  "email": "ana@email.com",
                  "senha": "123456"
                }
                """;

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novoCliente))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome").value("Ana Silva"))
                .andExpect(jsonPath("$.email").value("ana@email.com"));

        Cliente cliente = clienteRepository.findAll().get(0);

        mockMvc.perform(get("/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("ana@email.com"));

        mockMvc.perform(get("/clientes/{id}", cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana Silva"));

        String clienteAtualizado = """
                {
                  "nome": "Ana Souza",
                  "email": "ana@email.com",
                  "senha": "654321"
                }
                """;

        mockMvc.perform(put("/clientes/{id}", cliente.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(clienteAtualizado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana Souza"));

        mockMvc.perform(delete("/clientes/{id}", cliente.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/clientes/{id}", cliente.getId()))
                .andExpect(status().isNotFound());
    }
}
