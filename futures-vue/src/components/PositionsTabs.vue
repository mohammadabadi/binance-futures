<script setup>
import { ref } from 'vue'
const tab = ref('positions')
const tabs = [
  { id: 'positions', label: 'Positions' },
  { id: 'orders', label: 'Open Orders' },
  { id: 'history', label: 'Order History' },
  { id: 'wallet', label: 'Wallet Balance' },
]
</script>

<template>
  <div class="flex flex-col h-full" style="height: 100%; overflow: hidden;">
    <div class="flex h-10 items-center gap-1 border-b border-panel shrink-0" style="height: 40px; padding: 0 16px; flex-shrink: 0;">
      <button 
        v-for="t in tabs" 
        :key="t.id" 
        class="px-3 py-1.5 text-sm font-medium relative shrink-0"
        :class="tab === t.id ? 'text-yellow border-b-2 border-yellow' : 'text-muted hover:text-text'"
        @click="tab = t.id"
        style="font-size: 14px; padding: 6px 12px;"
      >
        {{ t.label }}
      </button>
      <div class="ml-auto text-xs text-muted shrink-0" style="font-size: 12px;">Demo Mode</div>
    </div>
    <div class="flex-1 scrollable" style="padding: 16px; overflow-y: auto; overflow-x: hidden; min-height: 0;">
      <div v-if="tab === 'positions'" class="text-center text-muted text-sm py-8" style="font-size: 14px; padding: 32px 0;">
        No positions
      </div>
      <div v-else-if="tab === 'orders'" class="text-center text-muted text-sm py-8" style="font-size: 14px; padding: 32px 0;">
        <div class="mb-4">No open orders</div>
        <button class="px-4 py-2 bg-panel-hover rounded text-text hover:bg-panel-hover/80 transition-colors" style="font-size: 14px; padding: 8px 16px;">
          Cancel All
        </button>
      </div>
      <div v-else-if="tab === 'history'" class="text-center text-muted text-sm py-8" style="font-size: 14px; padding: 32px 0;">
        No order history
      </div>
      <div v-else class="text-muted text-sm" style="font-size: 14px;">
        <div class="space-y-2">
          <div class="flex justify-between items-center py-2 border-b border-panel">
            <span>Available Balance</span>
            <span class="text-text font-mono font-semibold" style="font-weight: 600;">$100,000.00</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-panel">
            <span>Unrealized P&L</span>
            <span class="text-text font-mono">$0.00</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span>Total Balance</span>
            <span class="text-text font-mono font-semibold" style="font-weight: 600;">$100,000.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
