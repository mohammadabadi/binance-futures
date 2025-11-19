<script setup>
import { computed, ref } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()
const asks = computed(() => Array.isArray(store.asks) ? store.asks : [])
const bids = computed(() => Array.isArray(store.bids) ? store.bids : [])
const precision = ref('0.1')

function buildCumulative(levels, accumulateFromFarSide = false) {
  if (!Array.isArray(levels) || levels.length === 0) return { rows: [], maxTotal: 0 }
  let running = 0
  const src = accumulateFromFarSide ? [...levels].reverse() : levels
  const accumulated = src.map(([price, qty]) => {
    running += qty
    return { price, qty, total: running }
  })
  const restored = accumulateFromFarSide ? accumulated.reverse() : accumulated
  const maxTotal = accumulated.length ? accumulated[accumulated.length - 1].total : 0
  return { rows: restored, maxTotal }
}

const cumAsks = computed(() => buildCumulative(asks.value, true))
const cumBids = computed(() => buildCumulative(bids.value, false))

const spread = computed(() => {
  if (asks.value.length === 0 || bids.value.length === 0) return { value: 0, percent: 0 }
  const bestAsk = asks.value[0]?.[0] || 0
  const bestBid = bids.value[0]?.[0] || 0
  const spreadValue = bestAsk - bestBid
  const spreadPercent = bestBid > 0 ? (spreadValue / bestBid) * 100 : 0
  return { value: spreadValue, percent: spreadPercent }
})

const maxTotal = computed(() => {
  return Math.max(cumAsks.value.maxTotal, cumBids.value.maxTotal)
})
</script>

<template>
  <div class="flex flex-col h-full" style="height: 100%;border-radius: 8px;">
    <div class="flex items-center justify-between border-b border-panel shrink-0 bg-panel" style="height: 40px; padding: 0 16px; border-radius: 8px;">
      <div class="flex items-center gap-2">
        <span class="text-text font-medium" style="font-size: 12px; font-weight: 500;">Order Book</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="p-1 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 4px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </button>
        <button class="p-1 text-muted hover:text-text hover:bg-panel-hover rounded" style="padding: 4px;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <select v-model="precision" class="px-2 py-1 text-xs bg-panel border border-panel rounded text-text" style="font-size: 12px; padding: 4px 8px;">
          <option>0.1</option>
          <option>1</option>
          <option>10</option>
        </select>
      </div>
    </div>

    <div class="flex items-center text-muted border-b border-panel shrink-0 bg-panel" style="height: 32px; padding: 0 5px; font-size: 10px;">
      <div class="flex-1 text-right" style="width: 33.3%;">Price (USDT)</div>
      <div class="w-20 text-right" style="width: 33.3%;">Size (BTC)</div>
      <div class="w-20 text-right" style="width: 33.3%;">Sum (BTC)</div>
    </div>
    
    <div class="flex-1 flex flex-col" style="overflow: hidden; height: 0;">
      <div class="scrollable" style="flex: 1 1 50%; height: 0;">
        <div 
          v-for="(l, i) in cumAsks.rows.slice(0, 25)" 
          :key="'a'+i" 
          class="relative hover:bg-panel-hover cursor-pointer group"
          style="padding: 2px 5px; font-size: 10px;"
        >
          <div class="absolute inset-y-0 right-0 bg-sell/10" :style="{ width: (maxTotal ? Math.min(100, (l.total / maxTotal) * 100) : 0) + '%' }"></div>
          <div class="relative flex items-center">
            <div class="flex-1 text-right" style="width: 33.3%;">
              <span class="text-sell font-mono">{{ l.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
            </div>
            <div class="w-20 text-right" style="width: 33.3%;">
              <span class="text-text font-mono">{{ l.qty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
            </div>
            <div class="w-20 text-right" style="width: 33.3%;">
              <span class="text-text font-mono">{{ l.total.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-between border-y border-panel" style="padding: 8px 16px; background-color: var(--color-panel);">
        <div class="flex-1 text-right">
          <span class="font-bold text-buy font-mono" style="font-size: 16px; font-weight: 700;">{{ store.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
        </div>
        <div class="flex items-center gap-2 ml-4">
          <svg class="w-4 h-4 text-buy" fill="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M7 14l5-5 5 5z"/>
          </svg>
          <span class="text-muted font-mono" style="font-size: 12px;">{{ (store.lastPrice * 1.0002).toFixed(1) }}</span>
        </div>
      </div>
      
      <div class="scrollable" style="flex: 1 1 50%; height: 0;">
        <div 
          v-for="(l, i) in cumBids.rows.slice(0, 25)" 
          :key="'b'+i" 
          class="relative hover:bg-panel-hover cursor-pointer group"
          style="padding: 2px 16px; font-size: 10px;"
        >
          <div class="absolute inset-y-0 left-0 bg-buy/10" :style="{ width: (maxTotal ? Math.min(100, (l.total / maxTotal) * 100) : 0) + '%' }"></div>
          <div class="relative flex items-center">
            <div class="flex-1 text-right" style="width: 33.3%;">
              <span class="text-buy font-mono">{{ l.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
            </div>
            <div class="w-20 text-right" style="width: 33.3%;">
              <span class="text-text font-mono">{{ l.qty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
            </div>
            <div class="w-20 text-right" style="width: 33.3%;">
              <span class="text-text font-mono">{{ l.total.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
