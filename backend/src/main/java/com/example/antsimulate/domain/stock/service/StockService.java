package com.example.antsimulate.domain.stock.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockPriceDailyService {
    private final StockPriceDailyRepository stockPriceDailyRepository;
    private final LikeStockItemsRepository likeStockItemsRepository;

    /**
     *  종목별 차트 조회
     **/
    public List<GetStockPriceDailyResponse> getStockPriceDaily(Long stockItemId){
        return stockPriceDailyRepository.findDailyPrice(stockItemId);
    }

    /**
     *  관심종목 추가 및 삭제
     **/
    public LikeStockItemsResponse createOrDeleteLikeStockItems(Long userId, Long stockItemId){
        User user = userRepository.getReferenceById(userId);
        StockItems stockItems = stockItemsRepository.getReferenceById(stockItemId);

        int count = likeStockItemsRepository.deleteByUserIdAndStockItemId(userId, stockItemId);
        if(count == 0){
            LikeStockItems likeStockItems = LikeStockItems
                                                .builder
                                                .user(user)
                                                .stockItems(stockItem)
                                                .build();
            
            likeStockItemsRepository.save(likeStockItems);
            return new LikeStockItemsResponse("create");
        }

        return new LikeStockItemsResponse("delete");
    }
}
