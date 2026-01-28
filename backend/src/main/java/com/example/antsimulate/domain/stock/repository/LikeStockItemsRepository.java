package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.entity.LikeStockItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeStockItemsRepository extends JpaRepository<LikeStockItems, Long> {
    int deleteByUserIdAndStockItemId(Long userId, Long stockItemId);
}