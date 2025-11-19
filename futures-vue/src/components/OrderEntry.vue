<script setup>
import { ref, computed } from 'vue'
import { useMarketStore } from '../stores/market'
const store = useMarketStore()

const side = ref('buy')
const marginMode = ref('Cross')
const type = ref('Limit')
const price = ref('91450.0')
const qty = ref('')
const leverage = ref(20)
const postOnly = ref(false)
const reduceOnly = ref(false)
const availableBalance = ref(100000)

const notional = computed(() => (Number(price.value||0) * Number(qty.value||0)))
const margin = computed(() => (notional.value / Math.max(1, leverage.value)))
const fee = computed(() => (notional.value * 0.0004))

function submit() {
  alert(`[DEMO] ${side.value.toUpperCase()} ${type.value} price=${price.value||'mkt'} qty=${qty.value}x leverage=${leverage.value}`)
}

function setPrice(p) {
  price.value = p.toString()
}
</script>

<template>
  <div style="padding: 16px;">
    <!-- Margin Mode and Order Type -->
    <div class="flex items-center gap-2 mb-3">
      <button 
        class="px-3 py-1.5 text-xs font-medium rounded transition-colors"
        :class="marginMode === 'Cross' ? 'bg-yellow/20 text-yellow border border-yellow' : 'bg-panel-hover text-muted hover:text-text'"
        @click="marginMode = 'Cross'"
        style="font-size: 12px; padding: 6px 12px;"
      >
        Cross
      </button>
      <button 
        class="px-3 py-1.5 text-xs font-medium rounded transition-colors"
        :class="marginMode === 'Isolated' ? 'bg-yellow/20 text-yellow border border-yellow' : 'bg-panel-hover text-muted hover:text-text'"
        @click="marginMode = 'Isolated'"
        style="font-size: 12px; padding: 6px 12px;"
      >
        Isolated
      </button>
      <div class="ml-auto flex items-center gap-2">
        <button 
          class="px-3 py-1.5 text-xs font-medium rounded transition-colors"
          :class="type === 'Limit' ? 'bg-yellow/20 text-yellow border border-yellow' : 'bg-panel-hover text-muted hover:text-text'"
          @click="type = 'Limit'"
          style="font-size: 12px; padding: 6px 12px;"
        >
          Limit
        </button>
        <button 
          class="px-3 py-1.5 text-xs font-medium rounded transition-colors"
          :class="type === 'Market' ? 'bg-yellow/20 text-yellow border border-yellow' : 'bg-panel-hover text-muted hover:text-text'"
          @click="type = 'Market'"
          style="font-size: 12px; padding: 6px 12px;"
        >
          Market
        </button>
      </div>
    </div>

    <!-- Buy/Sell Tabs -->
    <div class="flex gap-1 mb-3">
      <button 
        class="flex-1 py-2 text-sm font-semibold rounded transition-colors"
        :class="side==='buy' ? 'bg-buy/20 text-buy' : 'bg-panel-hover text-muted hover:text-text'"
        @click="side='buy'"
        style="font-size: 14px; padding: 8px; font-weight: 600;"
      >
        Buy / Long
      </button>
      <button 
        class="flex-1 py-2 text-sm font-semibold rounded transition-colors"
        :class="side==='sell' ? 'bg-sell/20 text-sell' : 'bg-panel-hover text-muted hover:text-text'"
        @click="side='sell'"
        style="font-size: 14px; padding: 8px; font-weight: 600;"
      >
        Sell / Short
      </button>
    </div>

    <!-- Available Balance -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted" style="font-size: 12px;">Avbl</span>
        <span class="text-xs text-muted" style="font-size: 12px;">- USD</span>
      </div>
    </div>

    <!-- Price -->
    <div class="mb-3">
      <label class="block text-xs text-muted mb-1" style="font-size: 12px;">Price (USDT)</label>
      <input 
        class="w-full bg-input-bg border border-input-border rounded px-3 py-2 text-sm font-mono text-text focus:border-yellow"
        placeholder="Market Price"
        v-model="price" 
        :disabled="type==='Market'"
        style="font-size: 14px; padding: 8px 12px;"
      />
      <div class="flex gap-1 mt-1">
        <button @click="setPrice(store.lastPrice * 0.99)" class="text-xs text-muted hover:text-text" style="font-size: 11px;">-1%</button>
        <button @click="setPrice(store.lastPrice)" class="text-xs text-muted hover:text-text" style="font-size: 11px;">Mark</button>
        <button @click="setPrice(store.lastPrice * 1.01)" class="text-xs text-muted hover:text-text" style="font-size: 11px;">+1%</button>
      </div>
    </div>

    <!-- Quantity -->
    <div class="mb-3">
      <label class="block text-xs text-muted mb-1" style="font-size: 12px;">Size</label>
      <div class="relative">
        <input 
          class="w-full bg-input-bg border border-input-border rounded px-3 py-2 text-sm font-mono text-text focus:border-yellow"
          placeholder="0.00"
          v-model="qty"
          style="font-size: 14px; padding: 8px 12px;"
        />
        <button class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M12 2l10 10-10 10L2 12 12 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Leverage -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <label class="text-xs text-muted" style="font-size: 12px;">Leverage</label>
        <span class="text-sm font-semibold text-text" style="font-size: 14px; font-weight: 600;">{{ leverage }}x</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="125" 
        v-model.number="leverage"
        class="w-full"
      />
    </div>

    <!-- Options -->
    <div class="flex gap-3 mb-3 text-xs" style="font-size: 12px;">
      <label class="inline-flex items-center gap-1.5 cursor-pointer text-muted">
        <input type="checkbox" v-model="postOnly" class="w-3 h-3" style="width: 12px; height: 12px;"/>
        <span>Post-only</span>
      </label>
      <label class="inline-flex items-center gap-1.5 cursor-pointer text-muted">
        <input type="checkbox" v-model="reduceOnly" class="w-3 h-3" style="width: 12px; height: 12px;"/>
        <span>Reduce-only</span>
      </label>
    </div>

    <!-- Calculations -->
    <div class="mb-3 p-2 bg-panel-hover rounded text-xs space-y-1" style="font-size: 12px; padding: 8px;">
      <div class="flex justify-between text-muted">
        <span>Notional</span>
        <span class="text-text font-mono">{{ notional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
      </div>
      <div class="flex justify-between text-muted">
        <span>Margin</span>
        <span class="text-text font-mono">{{ margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
      </div>
      <div class="flex justify-between text-muted">
        <span>Fee (Est.)</span>
        <span class="text-text font-mono">{{ fee.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <button 
      class="w-full py-2.5 rounded text-sm font-semibold transition-colors"
      :class="side==='buy' ? 'bg-buy/20 text-buy hover:bg-buy/30' : 'bg-sell/20 text-sell hover:bg-sell/30'"
      @click="submit"
      style="font-size: 14px; padding: 10px; font-weight: 600;"
    >
      {{ side === 'buy' ? 'Buy / Long' : 'Sell / Short' }} BTCUSDT
    </button>
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--color-input-border);
  border-radius: 2px;
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--color-yellow);
  border-radius: 50%;
  cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--color-yellow);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
