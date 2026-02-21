package com.example.antsimulate.domain.portfolio.service;

import com.example.antsimulate.domain.portfolio.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortfolioService {
    private final PortfolioRepository portfolioRepository;

    public void createOrUpdatePortfolio(){

    }
}
