package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.entity.LikeStockItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeStockItemsRepository extends JpaRepository<LikeStockItems, Long> {
    int deleteByUserIdAndStockItemsId(Long userId, Long stockItemId);
    List<LikeStockItems> findByUserId(Long userId);
}