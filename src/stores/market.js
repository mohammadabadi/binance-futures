import { defineStore } from 'pinia'

export const useMarketStore = defineStore('market', {
    state: () => ({
        symbol: 'BTCUSDT',
        lastPrice: 68500,
        priceChangePercent: 0,
        high24h: 68600,
        low24h: 66000,
        volume24h: 0,
        bids: [],
        asks: [],
        trades: [],
        candles: [],
        timeframe: '1m',
        indicators: { ma: true, ema: false, rsi: false },
        _connected: false,
    }),
    actions: {
        setTicker({ price, changePercent, high, low, volume }) {
            this.lastPrice = price
            if (typeof changePercent === 'number') this.priceChangePercent = changePercent
            if (typeof high === 'number') this.high24h = high
            if (typeof low === 'number') this.low24h = low
            if (typeof volume === 'number') this.volume24h = volume
        },
        setOrderBook({ bids, asks }) {
            this.bids = bids
            this.asks = asks
        },
        pushTrade(trade) {
            this.trades.unshift(trade)
            if (this.trades.length > 500) this.trades.length = 500
        },
        setCandles(list) {
            this.candles = list
        },
        updateLastCandle(partial) {
            if (this.candles.length === 0) return
            Object.assign(this.candles[this.candles.length - 1], partial)
        },
        async loadInitialData() {
            try {
                const { fetchTicker, fetchOrderBook, fetchTrades, fetchKlines } = await
                import ('../services/binanceApi')
                const [ticker, orderBook, trades, klines] = await Promise.all([
                    fetchTicker(this.symbol),
                    fetchOrderBook(this.symbol),
                    fetchTrades(this.symbol),
                    fetchKlines(this.symbol, this.timeframe),
                ])
                this.setTicker(ticker)
                this.setOrderBook(orderBook)
                this.setCandles(klines)
                trades.forEach(t => this.pushTrade(t))
            } catch (err) {
                console.error('Failed to load initial data:', err)
            }
        },
        connectRealtime(realtime) {
            if (this._connected) return
            this._connected = true
            
            const handleReconnect = async (streamType) => {
                if (streamType === 'orderbook' || streamType === 'ticker' || streamType === 'trades') {
                    try {
                        const { fetchTicker, fetchOrderBook, fetchTrades } = await import('../services/binanceApi')
                        if (streamType === 'ticker') {
                            const ticker = await fetchTicker(this.symbol)
                            this.setTicker(ticker)
                        } else if (streamType === 'orderbook') {
                            const orderBook = await fetchOrderBook(this.symbol)
                            this.setOrderBook(orderBook)
                        } else if (streamType === 'trades') {
                            const trades = await fetchTrades(this.symbol, 50)
                            this.trades = []
                            trades.forEach(t => this.pushTrade(t))
                        }
                    } catch (err) {
                        console.error(`Failed to reload ${streamType} after reconnect:`, err)
                    }
                }
            }
            
            realtime.subscribeTicker((t) => {
                if (t.price > 0) {
                    this.setTicker(t)
                }
            })
            realtime.subscribeOrderBook((ob) => {
                if (ob.bids && ob.bids.length > 0 || ob.asks && ob.asks.length > 0) {
                    this.setOrderBook(ob)
                }
            })
            realtime.subscribeTrades((tr) => {
                if (tr.price > 0 && tr.qty > 0) {
                    this.pushTrade(tr)
                }
            })
            realtime.subscribeCandlesInit((list) => {
                this.setCandles(list)
            })
            realtime.subscribeCandleUpdate((c) => {
                if (c.close > 0) {
                    const last = this.candles[this.candles.length - 1]
                    if (last && last.time === c.time) {
                        this.updateLastCandle(c)
                    } else {
                        this.candles.push(c)
                        if (this.candles.length > 500) this.candles.shift()
                    }
                }
            })
            realtime.subscribeReconnect(handleReconnect)
            realtime.start()
        },
    },
})