<script setup>
import { ref, onMounted } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()
const scroller = ref(null)
const paused = ref(false)

onMounted(() => {
  let lastLen = store.trades.length
  setInterval(() => {
    if (paused.value) return
    if (store.trades.length !== lastLen) {
      lastLen = store.trades.length
      if (scroller.value) scroller.value.scrollTop = 0
    }
  }, 400)
})
</script>

<template>
  <div class="flex flex-col h-full" style="height: 100%;">
    <div class="flex items-center justify-between text-xs text-muted border-b border-panel shrink-0" style="height: 40px; padding: 0 16px; font-size: 14px;">
      <span>Recent Trades</span>
      <label class="inline-flex items-center gap-1 cursor-pointer" style="font-size: 10px;">
        <input type="checkbox" v-model="paused" class="w-3 h-3" style="width: 12px; height: 12px;"/>
        <span>Pause</span>
      </label>
    </div>
    
    <div class="flex-1 scrollable" ref="scroller" style="flex: 1 1 0%; height: 0; overflow-y: auto; overflow-x: hidden;">
      <div style="padding: 4px 16px;">
        <div 
          v-for="(t, i) in store.trades.slice(0, 50)" 
          :key="i" 
          class="flex justify-between items-center hover:bg-panel-hover"
          :class="t.side === 'buy' ? 'text-buy' : 'text-sell'"
          style="padding: 2px 0; font-size: 12px;"
        >
          <span class="font-mono">{{ t.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
          <span class="text-muted font-mono">{{ t.qty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }}</span>
          <span class="text-muted" style="font-size: 10px;">{{ new Date(t.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
