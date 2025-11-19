# Binance Futures Trading Interface

پیاده‌سازی رابط کاربری Binance Futures برای معاملات BTC/USDT با Vue 3 و Tailwind CSS.

## 🚀 تکنولوژی‌ها

- Vue 3 (Composition API)
- Tailwind CSS v4
- Pinia
- Vite
- Lightweight Charts v5
- Binance Futures API

## 📁 ساختار پروژه

```
futures-vue/
├── src/
│   ├── components/
│   │   ├── NavigationBar.vue
│   │   ├── MarketOverview.vue
│   │   ├── HeaderTopBar.vue
│   │   ├── ChartArea.vue
│   │   ├── ChartControls.vue
│   │   ├── ChartTools.vue
│   │   ├── OrderBook.vue
│   │   ├── RecentTrades.vue
│   │   ├── OrderEntry.vue
│   │   └── PositionsTabs.vue
│   ├── stores/
│   │   └── market.js
│   ├── services/
│   │   └── binanceApi.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
├── postcss.config.cjs
└── package.json
```

## 🎯 ویژگی‌ها

### Navigation Bar
- منوی اصلی با آیتم‌های مختلف
- Responsive: scroll افقی در desktop، hamburger menu در mobile

### Market Overview
- نمایش جفت‌های ارزی با قیمت و تغییرات

### Header Top Bar
- نمایش نماد، قیمت، و آمار بازار
- Layout مطابق Binance

### Chart
- کندل‌استیک با lightweight-charts
- تایم‌فریم‌های مختلف
- اندیکاتورهای MA, EMA, RSI

### Chart Tools
- تب‌های Original, Trading View, Depth
- نمایش اطلاعات کندل و Moving Averages

### Order Book
- Layout تک ستونی
- رنگ‌بندی سبز/قرمز
- حجم تجمعی

### Recent Trades
- لیست معاملات با رنگ‌بندی
- Auto-scroll

### Order Entry
- انواع سفارش: Market, Limit
- Margin modes: Cross, Isolated
- Leverage slider
- محاسبه Notional, Margin, Fee

### Positions/Orders Tabs
- Positions, Open Orders, Order History, Wallet Balance

### Real-time Data
- اتصال به Binance Futures API
- REST API برای داده‌های اولیه
- WebSocket برای به‌روزرسانی‌های لحظه‌ای
- Reconnect خودکار

### Responsive Design
- Desktop, Tablet, Mobile layouts

## 🛠️ نصب و اجرا

```bash
npm install
npm run dev
npm run build
```

## ⚙️ تنظیمات

### Proxy Configuration

در `vite.config.js` برای حل مشکل CORS:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://fapi.binance.com',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, '/fapi/v1'),
    },
  },
}
```

### Tailwind CSS v4

استفاده از `@tailwindcss/postcss` در `postcss.config.cjs`.

### CSS Variables

رنگ‌های Binance در `src/style.css`:

```css
--color-bg: #102821;
--color-panel: #1e2026;
--color-buy: #0ecb81;
--color-sell: #f6465d;
--color-yellow: #f0b90b;
```

## 📝 نکات

- API Keys در کلاینت ذخیره نمی‌شوند
- فرم سفارش در حالت demo است
- در development از Vite proxy استفاده می‌شود
- WebSocket با reconnect خودکار

## 🔧 مشکلات شناخته شده

- Kline WebSocket stream ممکن است مشکل داشته باشد، از REST polling استفاده می‌شود
- برای production نیاز به backend proxy است

## 📚 منابع

- [Binance Futures API Docs](https://binance-docs.github.io/apidocs/futures/en/)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Vue 3 Docs](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
