package br.com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "agentes")
@DiscriminatorValue("AGENTE")
@PrimaryKeyJoinColumn(name = "usuario_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Agente extends Usuario {

    @Column(length = 18, unique = true)
    private String cnpj;

    @Column(length = 160)
    private String nomeFantasia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoAgente tipo;

    public Agente() {
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public TipoAgente getTipo() {
        return tipo;
    }

    public void setTipo(TipoAgente tipo) {
        this.tipo = tipo;
    }
}
