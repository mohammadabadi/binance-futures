<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="h-14 flex items-center px-6 relative" style="height: 56px; background: transparent; min-width: 0;">
    <div class="flex items-center gap-2 mr-4 lg:mr-8 shrink-0">
      <span class="text-base font-bold text-text hidden sm:inline" style="font-size: 16px; font-weight: 700;">BINANCE FUTURES</span>
      <span class="text-base font-bold text-text sm:hidden" style="font-size: 14px; font-weight: 700;">BINANCE</span>
    </div>
    
    <div class="flex-1 hidden lg:flex items-center gap-0 overflow-x-auto scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none; min-width: 0;">
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Futures
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Options
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Trading Bots
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Copy Trading
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Smart Money
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Campaigns
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        Data
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button class="px-4 py-2 text-sm font-medium text-text hover:text-yellow flex items-center gap-1 shrink-0" style="font-size: 14px; padding: 8px 16px; white-space: nowrap;">
        More
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <div class="hidden lg:flex ml-auto items-center gap-4 shrink-0">
      <button class="px-4 py-1.5 text-sm text-text hover:text-yellow shrink-0" style="font-size: 14px; padding: 6px 16px; white-space: nowrap;">
        Log In
      </button>
      <button class="px-4 py-1.5 text-sm font-medium bg-yellow text-bg rounded hover:bg-yellow/90 shrink-0" style="font-size: 14px; padding: 6px 16px; font-weight: 500; white-space: nowrap;">
        Sign Up
      </button>
    </div>

    <div class="flex lg:hidden ml-auto items-center gap-2 shrink-0">
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="p-2 text-text hover:text-yellow transition-colors"
        style="padding: 8px;"
      >
        <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div 
      v-if="mobileMenuOpen"
      class="absolute top-full left-0 right-0 bg-panel border-t border-panel z-50 md:hidden"
      style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-height: calc(100vh - 56px); overflow-y: auto;"
    >
      <div class="flex flex-col py-2">
        <button class="px-4 py-3 text-sm font-medium text-text hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Futures</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Options</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Trading Bots</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Copy Trading</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Smart Money</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Campaigns</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>Data</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="px-4 py-3 text-sm font-medium text-text hover:text-yellow hover:bg-panel-hover flex items-center justify-between" style="font-size: 14px;">
          <span>More</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <div class="px-4 py-3 border-t border-panel mt-2 flex gap-2">
          <button class="flex-1 px-4 py-2 text-sm text-text hover:text-yellow border border-panel rounded" style="font-size: 14px; padding: 8px 16px;">
            Log In
          </button>
          <button class="flex-1 px-4 py-2 text-sm font-medium bg-yellow text-bg rounded hover:bg-yellow/90" style="font-size: 14px; padding: 8px 16px; font-weight: 500;">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  nav {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

@media (max-width: 768px) {
  nav {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}
</style>
