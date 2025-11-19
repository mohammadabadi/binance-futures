<script setup>
import { watch } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()
const timeframes = [
  { label: '1s', value: '1s' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d', active: true },
  { label: '1W', value: '1w' },
]

const chartTabs = [
  { id: 'chart', label: 'Chart', active: true },
  { id: 'info', label: 'Info' },
  { id: 'trading', label: 'Trading Data' },
]

async function setTf(tf) {
	store.timeframe = tf
	try {
		const { fetchKlines } = await import('../services/binanceApi')
		const klines = await fetchKlines(store.symbol, tf)
		store.setCandles(klines)
	} catch (err) {
		console.error('Failed to load klines:', err)
	}
}

watch(() => store.timeframe, setTf)
</script>

<template>
  <div class="border-b border-panel bg-panel">
    <!-- Tabs: Chart, Info, Trading Data -->
    <div class="flex items-center gap-6 border-b border-panel" style="height: 40px; padding: 0 16px;">
      <button
        v-for="tab in chartTabs"
        :key="tab.id"
        class="relative py-2 text-sm font-medium"
        :class="tab.active ? 'text-yellow' : 'text-muted hover:text-text'"
        style="font-size: 14px; padding: 8px 0;"
      >
        {{ tab.label }}
        <span v-if="tab.active" class="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow" style="height: 2px;"></span>
      </button>
    </div>

    <!-- Timeframes and Tools -->
    <div class="flex items-center justify-between" style="height: 40px; padding: 0 16px;">
      <!-- Timeframes -->
      <div class="flex items-center gap-2">
        <button
          v-for="tf in timeframes"
          :key="tf.value"
          class="px-2 py-1 text-xs font-medium transition-colors"
          :class="tf.active ? 'text-text font-bold' : 'text-muted hover:text-text'"
          @click="setTf(tf.value)"
          style="font-size: 12px; padding: 4px 8px;"
        >
          {{ tf.label }}
        </button>
      </div>

      <!-- Chart Tools -->
      <div class="flex items-center gap-2">
        <button class="p-1.5 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 6px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </button>
        <button class="p-1.5 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 6px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
          </svg>
        </button>
        <button class="p-1.5 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 6px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </button>
        <button class="p-1.5 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 6px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <button class="p-1.5 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 6px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        </button>
        <select class="px-2 py-1 text-xs bg-panel border border-panel rounded text-text" style="font-size: 12px; padding: 4px 8px;">
          <option>Last Price</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
