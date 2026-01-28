@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockPriceDailyController {
    private final StockService stockService;

    @GetMapping("/{stockItemId}")
    public ResponseEntity<?> getStockPriceDaily(@PathVariable Long stockItemId){
        List<GetStockPriceDailyResponse> response = stockService.getStockPriceDaily(stockId);
        return ResponseEntity.ok(response); // 상태코드 200
    }

    @PostMapping("/{userId}/{stockItemId}/like")
    public ResponseEntity<?> createOrDeleteLikeStockItems(@PathVariable Long userId                              
                                                        ,@PathVariable Long stockItemId){
        LikeStockItemsResponse response = stockService.createOrDeleteLikeStockItems(userId, stockItemId); 
        return ResponseEntity.ok(response);
    }
}
