import { useRef, useEffect, useMemo } from "react";
import { 
  createChart, 
  ColorType, 
  CrosshairMode, 
  IChartApi, 
  CandlestickData, 
  HistogramData, 
  Time,
  CandlestickSeries,
  HistogramSeries
} from "lightweight-charts";

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  isDark?: boolean;
  height?: number | string;
  showVolume?: boolean;
}

export function CandlestickChart({ 
  data, 
  isDark = true, 
  height = "100%",
  showVolume = true 
}: CandlestickChartProps) {
  const priceChartContainerRef = useRef<HTMLDivElement>(null);
  const volumeChartContainerRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);

  // 차트 높이 계산
  const totalHeight = useMemo(() => {
    if (typeof height === "number") return height;
    return 400;
  }, [height]);

  const priceChartHeight = showVolume ? Math.floor(totalHeight * 0.75) : totalHeight;
  const volumeChartHeight = showVolume ? Math.floor(totalHeight * 0.25) : 0;

  useEffect(() => {
    if (!priceChartContainerRef.current || data.length === 0) return;

    // 기존 차트 제거
    if (priceChartRef.current) {
      priceChartRef.current.remove();
      priceChartRef.current = null;
    }
    if (volumeChartRef.current) {
      volumeChartRef.current.remove();
      volumeChartRef.current = null;
    }

    // === 주가 차트 생성 ===
    const priceChart = createChart(priceChartContainerRef.current, {
      width: priceChartContainerRef.current.clientWidth,
      height: priceChartHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#94a3b8' : '#64748b',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
        horzLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
        horzLine: {
          color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        scaleMargins: { top: 0.05, bottom: 0.05 },
        minimumWidth: 80, // Y축 너비 고정
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        visible: !showVolume, // 거래량 차트가 있으면 주가 차트의 시간축 숨김
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    });

    priceChartRef.current = priceChart;

    // 캔들스틱 시리즈 (한국 스타일: 상승=빨강, 하락=파랑)
    const candlestickSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderUpColor: '#ef4444',
      borderDownColor: '#3b82f6',
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    });

    const candleData: CandlestickData[] = data.map(d => ({
      time: d.date as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candlestickSeries.setData(candleData);

    priceChart.timeScale().fitContent();

    // === 거래량 차트 생성 (showVolume이 true일 때만) ===
    if (showVolume && volumeChartContainerRef.current) {
      const volumeChart = createChart(volumeChartContainerRef.current, {
        width: volumeChartContainerRef.current.clientWidth,
        height: volumeChartHeight,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: isDark ? '#94a3b8' : '#64748b',
        },
        grid: {
          vertLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
          horzLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          },
          horzLine: {
            color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          },
        },
        rightPriceScale: {
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          scaleMargins: { top: 0.15, bottom: 0.05 }, // 상단 여백 늘림
          minimumWidth: 80, // Y축 너비 고정 (주가 차트와 동일)
        },
        timeScale: {
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { mouseWheel: true, pinch: true },
      });

      volumeChartRef.current = volumeChart;

      const volumeSeries = volumeChart.addSeries(HistogramSeries, {
        color: '#6366f1',
        priceFormat: { type: 'volume' },
      });

      const volumeData: HistogramData[] = data.map(d => ({
        time: d.date as Time,
        value: d.volume,
        color: d.close >= d.open 
          ? 'rgba(239, 68, 68, 0.6)' 
          : 'rgba(59, 130, 246, 0.6)',
      }));
      volumeSeries.setData(volumeData);

      volumeChart.timeScale().fitContent();

      // 두 차트의 시간축 동기화
      priceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range && volumeChartRef.current) {
          volumeChartRef.current.timeScale().setVisibleLogicalRange(range);
        }
      });

      volumeChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range && priceChartRef.current) {
          priceChartRef.current.timeScale().setVisibleLogicalRange(range);
        }
      });
    }

    // 리사이즈 핸들러
    const handleResize = () => {
      if (priceChartContainerRef.current && priceChartRef.current) {
        priceChartRef.current.applyOptions({
          width: priceChartContainerRef.current.clientWidth,
        });
      }
      if (volumeChartContainerRef.current && volumeChartRef.current) {
        volumeChartRef.current.applyOptions({
          width: volumeChartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (priceChartRef.current) {
        priceChartRef.current.remove();
        priceChartRef.current = null;
      }
      if (volumeChartRef.current) {
        volumeChartRef.current.remove();
        volumeChartRef.current = null;
      }
    };
  }, [data, isDark, priceChartHeight, volumeChartHeight, showVolume]);

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        차트 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col" style={{ height: totalHeight }}>
      {/* 주가 차트 */}
      <div 
        ref={priceChartContainerRef} 
        className="w-full"
        style={{ height: priceChartHeight }}
      />
      
      {/* 구분선 */}
      {showVolume && (
        <div 
          className={`w-full border-t ${isDark ? 'border-white/20' : 'border-black/10'}`}
          style={{ height: 1 }}
        />
      )}
      
      {/* 거래량 차트 */}
      {showVolume && (
        <div 
          ref={volumeChartContainerRef} 
          className="w-full"
          style={{ height: volumeChartHeight }}
        />
      )}
    </div>
  );
}
