<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { createChart, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts'
import { useMarketStore } from '../stores/market'

const containerRef = ref(null)
const store = useMarketStore()

let chart = null
let candleSeries = null
let maSeries = null
let emaSeries = null
let rsiSeries = null
let resizeObserver = null

function initChart() {
  if (!containerRef.value) return

  const panelColor = '#1e2026'
  
  try {
    chart = createChart(containerRef.value, {
      layout: { 
        background: { type: 'solid', color: panelColor }, 
        textColor: '#eaecf0',
        fontSize: 12
      },
      grid: { 
        vertLines: { color: '#2b2f36', style: 0 }, 
        horzLines: { color: '#2b2f36', style: 0 } 
      },
      rightPriceScale: { 
        borderColor: '#2b2f36',
        scaleMargins: { top: 0.1, bottom: 0.1 }
      },
      leftPriceScale: {
        visible: false
      },
      timeScale: { 
        borderColor: '#2b2f36', 
        timeVisible: true, 
        secondsVisible: false 
      },
      crosshair: { 
        mode: 0,
        vertLine: { color: '#848e9c', width: 1, style: 2 },
        horzLine: { color: '#848e9c', width: 1, style: 2 }
      },
      autoSize: true,
    })

    candleSeries = chart.addSeries(CandlestickSeries, { 
      upColor: '#0ecb81', 
      downColor: '#f6465d', 
      borderVisible: false, 
      wickUpColor: '#0ecb81', 
      wickDownColor: '#f6465d' 
    })

    maSeries = chart.addSeries(LineSeries, { 
      color: '#ffcc00', 
      priceLineVisible: false, 
      lineWidth: 2,
      title: 'MA 20'
    })
    
    emaSeries = chart.addSeries(LineSeries, { 
      color: '#66d9ef', 
      priceLineVisible: false, 
      lineWidth: 2,
      title: 'EMA 20'
    })
    
    rsiSeries = chart.addSeries(HistogramSeries, { 
      color: '#9b59b6', 
      priceFormat: { type: 'volume' }, 
      priceScaleId: 'right', 
      priceLineVisible: false 
    })

    if (store.candles && store.candles.length > 0) {
      updateChartData(store.candles)
    }

    resizeObserver = new ResizeObserver(() => {
      if (chart && containerRef.value) {
        chart.timeScale().fitContent()
      }
    })
    resizeObserver.observe(containerRef.value)
  } catch (err) {
    console.error('Chart init error:', err)
  }
}

function updateChartData(data) {
  if (!chart || !candleSeries || !data || data.length === 0) return

  try {
    const formattedData = data.map(c => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }))

    candleSeries.setData(formattedData)
    
    if (store.indicators.ma) {
      const maData = computeMA(data, 20)
      maSeries.setData(maData)
    } else {
      maSeries.setData([])
    }

    if (store.indicators.ema) {
      const emaData = computeEMA(data, 20)
      emaSeries.setData(emaData)
    } else {
      emaSeries.setData([])
    }

    if (store.indicators.rsi) {
      const rsiData = computeRSI(data, 14)
      rsiSeries.setData(rsiData)
    } else {
      rsiSeries.setData([])
    }

    chart.timeScale().fitContent()
  } catch (err) {
    console.error('Chart update error:', err)
  }
}

function computeMA(data, period) {
  const result = []
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close
    if (i >= period) sum -= data[i - period].close
    if (i >= period - 1) {
      result.push({ 
        time: data[i].time, 
        value: Number((sum / period).toFixed(2)) 
      })
    }
  }
  return result
}

function computeEMA(data, period) {
  const k = 2 / (period + 1)
  const result = []
  let prev
  for (let i = 0; i < data.length; i++) {
    const price = data[i].close
    prev = i === 0 ? price : price * k + prev * (1 - k)
    result.push({ 
      time: data[i].time, 
      value: Number(prev.toFixed(2)) 
    })
  }
  return result
}

function computeRSI(data, period) {
  const result = []
  let gains = 0, losses = 0
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close
    if (i <= period) {
      if (change >= 0) gains += change
      else losses -= change
      if (i === period) {
        const rs = gains / (losses || 1)
        const rsi = 100 - 100 / (1 + rs)
        result.push({ 
          time: data[i].time, 
          value: Number(rsi.toFixed(2)) 
        })
      }
    } else {
      const prevChange = data[i - period].close - data[i - period - 1].close
      if (prevChange >= 0) gains -= prevChange
      else losses += prevChange
      if (change >= 0) gains += change
      else losses -= change
      const rs = gains / (losses || 1)
      const rsi = 100 - 100 / (1 + rs)
      result.push({ 
        time: data[i].time, 
        value: Number(rsi.toFixed(2)) 
      })
    }
  }
  return result
}

onMounted(async () => {
  await nextTick()
  
  const checkAndInit = () => {
    if (containerRef.value && containerRef.value.clientWidth > 0 && containerRef.value.clientHeight > 0) {
      initChart()
    } else {
      setTimeout(checkAndInit, 50)
    }
  }
  
  checkAndInit()

  const stopWatchCandles = watch(() => store.candles, (newCandles) => {
    if (newCandles && newCandles.length > 0 && chart) {
      updateChartData(newCandles)
    }
  }, { deep: true })

  const stopWatchIndicators = watch(() => store.indicators, () => {
    if (store.candles && store.candles.length > 0 && chart) {
      updateChartData(store.candles)
    }
  }, { deep: true })

  onBeforeUnmount(() => {
    stopWatchCandles()
    stopWatchIndicators()
  })
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (chart) {
    chart.remove()
    chart = null
  }
})
</script>

<template>
  <div class="flex-1 min-h-0 w-full h-full" ref="containerRef" style="min-height: 300px; position: relative;"></div>
</template>

<style scoped>
</style>
