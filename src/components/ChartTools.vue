<script setup>
import { ref, computed, watch } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()

const viewMode = ref('original')
const viewModes = [
  { id: 'original', label: 'Original' },
  { id: 'tradingview', label: 'TradingView' },
  { id: 'depth', label: 'Depth' },
]

const selectedCandle = computed(() => {
  if (store.candles.length === 0) {
    return {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      open: store.lastPrice,
      high: store.high24h,
      low: store.low24h,
      close: store.lastPrice,
      change: store.priceChangePercent,
      range: ((store.high24h - store.low24h) / store.low24h * 100)
    }
  }
  const last = store.candles[store.candles.length - 1]
  const date = new Date(last.time * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const change = ((last.close - last.open) / last.open * 100)
  const range = ((last.high - last.low) / last.low * 100)
  return {
    date,
    open: last.open,
    high: last.high,
    low: last.low,
    close: last.close,
    change,
    range
  }
})

const movingAverages = ref([
  { period: 7, value: 0, color: 'yellow' },
  { period: 25, value: 0, color: 'red' },
  { period: 99, value: 0, color: 'purple' },
])

function calculateMA(period) {
  if (store.candles.length < period) return 0
  const slice = store.candles.slice(-period)
  const sum = slice.reduce((acc, c) => acc + c.close, 0)
  return sum / period
}

watch(() => store.candles, () => {
  if (store.candles.length >= 7) {
    movingAverages.value[0].value = calculateMA(7)
  }
  if (store.candles.length >= 25) {
    movingAverages.value[1].value = calculateMA(25)
  }
  if (store.candles.length >= 99) {
    movingAverages.value[2].value = calculateMA(99)
  }
}, { immediate: true })
</script>

<template>
  <div class="border-t border-panel bg-panel">
    <!-- View Mode Tabs -->
    <div class="flex items-center gap-1 border-b border-panel" style="height: 40px; padding: 0 16px;">
      <button
        v-for="mode in viewModes"
        :key="mode.id"
        class="px-4 py-2 text-sm font-medium relative transition-colors"
        :class="viewMode === mode.id ? 'text-yellow' : 'text-muted hover:text-text'"
        @click="viewMode = mode.id"
        style="font-size: 14px; padding: 8px 16px;"
      >
        {{ mode.label }}
        <span v-if="viewMode === mode.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow" style="height: 2px;"></span>
      </button>
    </div>

    <!-- Candle Info and MA (only for Original view) -->
    <div v-if="viewMode === 'original'" class="border-b border-panel" style="padding: 8px 16px; font-size: 12px;">
      <div class="flex items-center gap-6 mb-2 flex-wrap">
        <span class="text-muted" style="font-size: 11px;">{{ selectedCandle.date }}</span>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Open:</span>
            <span class="font-mono font-semibold" :class="selectedCandle.change >= 0 ? 'text-buy' : 'text-sell'" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.open.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">High:</span>
            <span class="text-buy font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Low:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Close:</span>
            <span class="font-mono font-semibold" :class="selectedCandle.change >= 0 ? 'text-buy' : 'text-sell'" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">CHANGE:</span>
            <span class="font-mono font-semibold" :class="selectedCandle.change >= 0 ? 'text-buy' : 'text-sell'" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.change >= 0 ? '+' : '' }}{{ selectedCandle.change.toFixed(2) }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Range:</span>
            <span class="font-mono font-semibold text-text" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.range.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Moving Averages -->
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-muted" style="font-size: 11px;">Moving Averages:</span>
        <div
          v-for="ma in movingAverages"
          :key="ma.period"
          class="flex items-center gap-2"
        >
          <span class="text-muted" style="font-size: 11px;">MA({{ ma.period }}):</span>
          <span class="font-mono" :class="ma.color === 'yellow' ? 'text-yellow' : ma.color === 'red' ? 'text-sell' : 'text-purple-400'" style="font-size: 12px;">
            {{ ma.value > 0 ? ma.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-' }}
          </span>
        </div>
      </div>
    </div>

    <!-- TradingView Placeholder -->
    <div v-if="viewMode === 'tradingview'" class="border-b border-panel" style="padding: 16px; text-align: center;">
      <div class="text-muted" style="font-size: 14px;">
        TradingView widget would be embedded here
      </div>
      <div class="text-muted mt-2" style="font-size: 12px; margin-top: 8px;">
        To integrate TradingView, add the TradingView widget script
      </div>
    </div>

    <!-- Depth Chart Placeholder -->
    <div v-if="viewMode === 'depth'" class="border-b border-panel" style="padding: 8px 16px; font-size: 12px;">
      <div class="flex items-center justify-between mb-2">
        <span class="text-muted" style="font-size: 11px;">Order Book Depth</span>
        <span class="text-muted" style="font-size: 11px;">{{ store.symbol }}</span>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-muted" style="font-size: 11px;">Best Bid:</span>
          <span class="text-buy font-mono font-semibold" style="font-size: 12px; font-weight: 600;">
            {{ store.bids.length > 0 ? store.bids[0][0].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted" style="font-size: 11px;">Best Ask:</span>
          <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">
            {{ store.asks.length > 0 ? store.asks[0][0].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted" style="font-size: 11px;">Spread:</span>
          <span class="font-mono font-semibold text-text" style="font-size: 12px; font-weight: 600;">
            {{ store.bids.length > 0 && store.asks.length > 0 
              ? ((store.asks[0][0] - store.bids[0][0]) / store.bids[0][0] * 100).toFixed(4) + '%'
              : '-' }}
          </span>
        </div>
      </div>
      <div class="mt-2 text-muted" style="font-size: 11px; margin-top: 8px;">
        Depth chart visualization would be displayed here
      </div>
    </div>

    <!-- Tools Bar -->
    <div class="flex items-center gap-4" style="height: 40px; padding: 0 16px;">
      <div class="flex items-center gap-1">
        <button class="px-2 py-1 text-xs text-muted hover:text-text hover:bg-panel-hover rounded" style="font-size: 12px; padding: 4px 8px;">Indicators</button>
        <button class="px-2 py-1 text-xs text-muted hover:text-text hover:bg-panel-hover rounded" style="font-size: 12px; padding: 4px 8px;">Drawings</button>
        <button class="px-2 py-1 text-xs text-muted hover:text-text hover:bg-panel-hover rounded" style="font-size: 12px; padding: 4px 8px;">Alerts</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
