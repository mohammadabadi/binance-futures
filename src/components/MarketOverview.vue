<script setup>
import { useMarketStore } from '../stores/market'
const store = useMarketStore()
</script>

<template>
  <div class="flex items-center px-6 gap-6 scrollable" style="height: 30px; overflow-x: auto; overflow-y: hidden; background: transparent;">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-text" style="font-size: 12px; font-weight: 500;">BTCUSDT</span>
      <span class="text-xs text-muted" style="font-size: 12px;">0.00%</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-text" style="font-size: 12px; font-weight: 500;">ETHUSDT</span>
      <span class="text-xs text-buy" style="font-size: 12px;">+1.07%</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-text" style="font-size: 12px; font-weight: 500;">BNBUSDT</span>
      <span class="text-xs text-buy" style="font-size: 12px;">+0.52%</span>
    </div>
  </div>
</template>

<style scoped>
</style>
