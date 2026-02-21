package com.example.antsimulate.domain.portfolio.repository;

import com.example.antsimulate.domain.portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
}
