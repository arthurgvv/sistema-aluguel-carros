package br.com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@DiscriminatorValue("CLIENTE")
@PrimaryKeyJoinColumn(name = "usuario_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cliente extends Usuario {

    @Column(length = 20)
    private String rg;

    @Column(length = 14)
    private String cpf;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(length = 255)
    private String endereco;

    @Column(length = 120)
    private String profissao;

    @JsonManagedReference("cliente-empregadores")
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Empregador> empregadores = new ArrayList<>();

    public Cliente() {
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<Empregador> getEmpregadores() {
        return empregadores;
    }

    public void setEmpregadores(List<Empregador> empregadores) {
        this.empregadores = empregadores;
    }

    /**
     * Backward compatibility: expose login field as email.
     */
    public String getEmail() {
        return getLogin();
    }

    public void setEmail(String email) {
        setLogin(email);
    }
}
