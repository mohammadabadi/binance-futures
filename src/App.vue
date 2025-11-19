<script setup>
import NavigationBar from './components/NavigationBar.vue'
import MarketOverview from './components/MarketOverview.vue'
import HeaderTopBar from './components/HeaderTopBar.vue'
import ChartArea from './components/ChartArea.vue'
import ChartControls from './components/ChartControls.vue'
import ChartTools from './components/ChartTools.vue'
import OrderBook from './components/OrderBook.vue'
import RecentTrades from './components/RecentTrades.vue'
import OrderEntry from './components/OrderEntry.vue'
import PositionsTabs from './components/PositionsTabs.vue'
import { useMarketStore } from './stores/market'
import { onMounted, onBeforeUnmount } from 'vue'
import { createBinanceWebSocket } from './services/binanceApi'

const store = useMarketStore()
let ws = null

onMounted(async () => {
	await store.loadInitialData()
	ws = createBinanceWebSocket(store.symbol)
	store.connectRealtime(ws)
})

onBeforeUnmount(() => {
	if (ws) {
		ws.stop()
		ws = null
	}
})
</script>

<template>
  <div class="h-screen bg-[--color-bg] flex flex-col overflow-hidden" style="padding: 8px; gap: 8px;">
    <div class="bg-panel rounded-lg shrink-0" style="border-radius: 8px; flex-shrink: 0;">
      <NavigationBar />
    </div>

    <div class="flex-1 flex flex-col lg:flex-row min-h-0 overflow-x-hidden" style="gap: 8px;">
      <div class="flex-1 flex flex-col w-full lg:w-[40.8449%] min-h-96" style="gap: 8px; overflow-x: hidden;">
        <div class="bg-panel rounded-lg shrink-0" style="border-radius: 8px;">
          <MarketOverview />
        </div>
        
        <div class="bg-panel rounded-lg shrink-0" style="border-radius: 8px;">
          <HeaderTopBar />
        </div>
        
        <div class="flex-1 flex flex-col bg-panel rounded-lg overflow-x-hidden overflow-y-auto" style="border-radius: 8px; min-height: 500px;">
          <ChartControls />
          <div class="flex-1 min-h-0 relative overflow-hidden" style="min-height: 0; position: relative;">
            <ChartArea />
          </div>
          <ChartTools />
        </div>
        
        <div class="bg-panel rounded-lg posTabs" style="height: 200px; border-radius: 8px; min-height: 200px; max-height: 200px; flex-shrink: 0;">
          <PositionsTabs />
        </div>
      </div>

      <div class="flex flex-col shrink-0 w-full lg:w-[16.6898%]" style="gap: 8px; min-height: 0;">
        <div class="flex-1 bg-panel rounded-lg overflow-hidden" style="border-radius: 8px; min-height: 0;">
          <OrderBook />
        </div>
        <div class="flex-1 bg-panel rounded-lg overflow-hidden" style="border-radius: 8px; min-height: 0;">
          <RecentTrades />
        </div>
      </div>

      <div class="flex flex-col shrink-0 bg-panel rounded-lg w-full lg:w-[20.8449%]" style="border-radius: 8px;">
        <OrderEntry />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1400px) {
  div[style*="width: 320px"] {
    width: 280px !important;
    min-width: 240px !important;
  }
}

@media (max-width: 768px) {
  .h-screen {
    padding: 4px !important;
    gap: 4px !important;
  }
  
  .flex-1.flex[style*="gap: 8px"] {
    flex-direction: column !important;
    gap: 4px !important;
  }
  
  div[style*="width: 320px"] {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  div[style*="height: 200px"] {
    height: auto !important;
    min-height: 150px !important;
  }
}
</style>
