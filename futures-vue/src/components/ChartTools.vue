<script setup>
import { ref } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()

const viewMode = ref('original')
const viewModes = [
  { id: 'original', label: 'Original' },
  { id: 'tradingview', label: 'Trading View' },
  { id: 'depth', label: 'Depth' },
]

const selectedCandle = ref({
  date: '2025/11/19',
  open: 92916.8,
  high: 92944.8,
  low: 89966.0,
  close: 91440.9,
  change: -1.58,
  range: 3.20
})

const movingAverages = ref([
  { period: 7, value: 94359.6, color: 'yellow' },
  { period: 25, value: 103368.8, color: 'red' },
  { period: 99, value: 111174.0, color: 'purple' },
])
</script>

<template>
  <div class="border-t border-panel bg-panel">
    <!-- View Mode Tabs -->
    <div class="flex items-center gap-4 border-b border-panel" style="height: 40px; padding: 0 16px;">
      <button
        v-for="mode in viewModes"
        :key="mode.id"
        class="px-3 py-1.5 text-xs font-medium transition-colors"
        :class="viewMode === mode.id ? 'text-yellow border-b-2 border-yellow' : 'text-muted hover:text-text'"
        @click="viewMode = mode.id"
        style="font-size: 12px; padding: 6px 12px;"
      >
        {{ mode.label }}
      </button>
    </div>

    <!-- Candle Info and MA -->
    <div class="border-b border-panel" style="padding: 8px 16px; font-size: 12px;">
      <div class="flex items-center gap-6 mb-2">
        <span class="text-muted" style="font-size: 11px;">{{ selectedCandle.date }}</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Open:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.open.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">High:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.high.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Low:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.low.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Close:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.close.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">CHANGE:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.change.toFixed(2) }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted" style="font-size: 11px;">Range:</span>
            <span class="text-sell font-mono font-semibold" style="font-size: 12px; font-weight: 600;">{{ selectedCandle.range.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Moving Averages -->
      <div class="flex items-center gap-4">
        <span class="text-muted" style="font-size: 11px;">Moving Averages:</span>
        <div
          v-for="ma in movingAverages"
          :key="ma.period"
          class="flex items-center gap-2"
        >
          <span class="text-muted" style="font-size: 11px;">MA({{ ma.period }}):</span>
          <span class="font-mono" :class="ma.color === 'yellow' ? 'text-yellow' : ma.color === 'red' ? 'text-sell' : 'text-purple-400'" style="font-size: 12px;">
            {{ ma.value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
          </span>
        </div>
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
