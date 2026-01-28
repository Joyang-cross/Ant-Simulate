package com.example.antsimulate.domain.stock.repository;

import com.example.antsimulate.domain.stock.entity.StockPriceDaily;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockPriceDailyRepository extends JpaRepository<StockPriceDaily, Long> {

    @Query("""
            SELECT new com.example.antsimulate.domain.stock.GetStockPriceDailyResponse(
                spd.id,
                si.stockName,
                spd.tradeDate,
                spd.openPrice,
                spd.highPrice,
                spd.lowPrice,
                spd.closePrice,
                spd.volumn
            ) 
            FROM StockPriceDaily spd
            INNER JOIN spd.stockItems si
            WHERE spd.id = :stockId
            ORDER BY spd.tradeDate
        """)
    List<GetStockPriceDailyResponse> findDailyPrices(@Param("stockId") Long stockId);
}
