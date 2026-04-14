package br.com.aluguelcarros.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "empresas")
@DiscriminatorValue("EMPRESA")
@PrimaryKeyJoinColumn(name = "agente_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Empresa extends Agente {

    @Column(length = 120)
    private String ramoAtividade;

    @Column(length = 120)
    private String setor;

    public Empresa() {
        setTipo(TipoAgente.EMPRESA);
    }

    public String getRamoAtividade() {
        return ramoAtividade;
    }

    public void setRamoAtividade(String ramoAtividade) {
        this.ramoAtividade = ramoAtividade;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }
}
