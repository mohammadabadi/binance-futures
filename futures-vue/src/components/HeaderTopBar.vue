<script setup>
import { computed } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()
const changeClass = computed(() => store.priceChangePercent >= 0 ? 'text-buy' : 'text-sell')
const changeSign = computed(() => store.priceChangePercent >= 0 ? '+' : '')
const priceChange = computed(() => {
  const change = store.lastPrice * (store.priceChangePercent / 100)
  return Math.abs(change).toFixed(2)
})
</script>

<template>
  <header style="background: transparent;">
    <div class="flex items-center justify-between px-4 py-3" style="padding: 12px 12px;">
      <div class="flex items-center gap-3" style="gap: 6px;">
        <button class="border border-panel-hover/80 rounded flex items-center justify-center hover:bg-panel-hover/80 transition-colors" style="width: 25px; height: 25px; border-radius: 6px; padding: 0;">
          <svg class="w-3 h-3 text-yellow" fill="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
        
        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="width: 25px; height: 25px; background-color: #f7931a;">
          <span class="text-white font-bold" style="font-size: 12px; font-weight: 700;">B</span>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-text font-semibold" style="font-size: 18px; font-weight: 600;">BTCUSDT</span>
          <button class="bg-panel-hover text-text-secondary hover:text-text px-1 py-0.5 rounded flex items-center gap-1 transition-colors" style="padding: 4px 5px; border-radius: 4px; font-size: 12px;">
            <span>Perp</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        
        <div class="flex items-baseline flex-col justify-center gap-3 mx-[16px]">
          <span class="font-bold font-mono" :class="changeClass" style="font-size: 18px; font-weight: 700; line-height: 1;">
            {{ store.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
          </span>
          <span class="font-semibold font-mono" :class="changeClass" style="font-size: 10px; font-weight: 600; line-height: 1;">
            {{ priceChange }} {{ changeSign }}{{ store.priceChangePercent.toFixed(2) }}%
          </span>
        </div>
      </div>

      <div class="flex items-center gap-6 overflow-x-auto" style="gap: 20px;">
        <div class="flex items-center gap-6" style="gap: 20px; font-size: 10px;">
          <div class="flex flex-col">
            <span class="text-muted mb-0.5" style="font-size: 11px; line-height: 1.2;">Mark</span>
            <span class="text-text font-mono font-semibold" style="font-size: 13px; font-weight: 600;">{{ (store.lastPrice * 1.0002).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-0.5">
              <span class="text-muted" style="font-size: 11px; line-height: 1.2;">Index</span>
              <svg class="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 10px; height: 10px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </div>
            <span class="text-text font-mono font-semibold" style="font-size: 10px; font-weight: 600;">{{ (store.lastPrice * 1.0005).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-muted mb-0.5" style="font-size: 9px; line-height: 1.2;">Funding (8h) / Countdown</span>
            <div class="flex items-center gap-2">
              <span class="text-sell font-mono font-semibold" style="font-size: 10px; font-weight: 600;">0.00609%</span>
              <span class="text-text font-mono" style="font-size: 10px;">/</span>
              <span class="text-text font-mono" style="font-size: 10px;">03:01:27</span>
            </div>
          </div>
          
          <div class="flex flex-col">
            <span class="text-muted mb-0.5" style="font-size: 11px; line-height: 1.2;">24h High</span>
            <span class="text-text font-mono font-semibold" style="font-size: 10px; font-weight: 600;">{{ store.high24h.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-muted mb-0.5" style="font-size: 11px; line-height: 1.2;">24h Low</span>
            <span class="text-text font-mono font-semibold" style="font-size: 10px; font-weight: 600;">{{ store.low24h.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          </div>
          
          <div class="flex flex-col">
            <span class="text-muted mb-0.5" style="font-size: 9px; line-height: 1.2;">24h Volume(BTC)</span>
            <span class="text-text font-mono font-semibold" style="font-size: 9px; font-weight: 600;">{{ store.volume24h.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
