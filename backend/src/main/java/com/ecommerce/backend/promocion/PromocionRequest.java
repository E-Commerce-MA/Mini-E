package com.ecommerce.backend.promocion;

import java.time.LocalDate;

public class PromocionRequest {
    private String codigo;
    private String descripcion;
    private Double valor;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer usoMaximo;

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public Integer getUsoMaximo() { return usoMaximo; }
    public void setUsoMaximo(Integer usoMaximo) { this.usoMaximo = usoMaximo; }
}