package com.ecommerce.backend.promocion;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    public Promocion crear(PromocionRequest request) {
        // Validar código único PRIMERO
        if (promocionRepository.existsByCodigo(request.getCodigo().toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ya existe una promoción con ese código.");
        }

        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio.");
        }

        Promocion promocion = new Promocion();
        promocion.setCodigo(request.getCodigo().toUpperCase());
        promocion.setValor(request.getValor());
        promocion.setDescripcion(request.getDescripcion());
        promocion.setFechaInicio(request.getFechaInicio());
        promocion.setFechaFin(request.getFechaFin());
        promocion.setUsoMaximo(request.getUsoMaximo());
        return promocionRepository.save(promocion);
    }

    public Promocion validar(String codigo) {
        Promocion promocion = promocionRepository.findByCodigo(codigo.toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Código de promoción no válido."));

        if (!promocion.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Esta promoción ya no está activa.");
        }

        if (java.time.LocalDate.now().isAfter(promocion.getFechaFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Esta promoción ha vencido.");
        }

        return promocion;
    }
}