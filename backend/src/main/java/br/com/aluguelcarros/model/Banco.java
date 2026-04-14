package br.com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "bancos")
@DiscriminatorValue("BANCO")
@PrimaryKeyJoinColumn(name = "agente_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Banco extends Agente {

    @Column(length = 10)
    private String codigo;

    private Double taxaJuros;

    public Banco() {
        setTipo(TipoAgente.BANCO);
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Double getTaxaJuros() {
        return taxaJuros;
    }

    public void setTaxaJuros(Double taxaJuros) {
        this.taxaJuros = taxaJuros;
    }
}
