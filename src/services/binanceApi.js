const REST_BASE = 'https://fapi.binance.com/fapi/v1'

export async function fetchTicker(symbol = 'BTCUSDT') {
    const res = await fetch(`${REST_BASE}/ticker/24hr?symbol=${symbol}`)
    if (!res.ok) throw new Error(`Ticker fetch failed: ${res.status}`)
    const data = await res.json()
    return {
        price: parseFloat(data.lastPrice),
        changePercent: parseFloat(data.priceChangePercent),
        high: parseFloat(data.highPrice),
        low: parseFloat(data.lowPrice),
        volume: parseFloat(data.volume),
    }
}

export async function fetchOrderBook(symbol = 'BTCUSDT', limit = 20) {
    const res = await fetch(`${REST_BASE}/depth?symbol=${symbol}&limit=${limit}`)
    if (!res.ok) throw new Error(`OrderBook fetch failed: ${res.status}`)
    const data = await res.json()
    return {
        bids: data.bids.map(([p, q]) => [parseFloat(p), parseFloat(q)]),
        asks: data.asks.map(([p, q]) => [parseFloat(p), parseFloat(q)]),
    }
}

export async function fetchTrades(symbol = 'BTCUSDT', limit = 100) {
    const res = await fetch(`${REST_BASE}/trades?symbol=${symbol}&limit=${limit}`)
    if (!res.ok) throw new Error(`Trades fetch failed: ${res.status}`)
    const data = await res.json()
    return data.map(t => ({
        side: t.isBuyerMaker ? 'sell' : 'buy',
        price: parseFloat(t.price),
        qty: parseFloat(t.qty),
        time: t.time,
    }))
}

export async function fetchKlines(symbol = 'BTCUSDT', interval = '1m', limit = 300) {
    const res = await fetch(`${REST_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
    if (!res.ok) throw new Error(`Klines fetch failed: ${res.status}`)
    const data = await res.json()
    return data.map(k => ({
        time: Math.floor(k[0] / 1000), // Unix timestamp in seconds
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
    }))
}

export function createBinanceWebSocket(symbol = 'BTCUSDT') {
    const sym = symbol.toLowerCase()
    let connections = {}
    let reconnectTimers = {}
    let reconnectAttempts = {}
    const maxReconnectAttempts = 10
    const listeners = {
        ticker: [],
        orderbook: [],
        trades: [],
        candleUpdate: [],
    }

    function connect(streamType, streamName) {
        try {
            if (connections[streamType]) {
                connections[streamType].close()
            }
            if (reconnectTimers[streamType]) {
                clearTimeout(reconnectTimers[streamType])
            }

            const ws = new WebSocket(`wss://fstream.binance.com/ws/${streamName}`)
            connections[streamType] = ws
            let pingInterval = null

            ws.onopen = () => {
                reconnectAttempts[streamType] = 0
                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        try {
                            ws.send(JSON.stringify({ method: 'ping', id: Date.now() }))
                        } catch (err) {
                            console.error('WS ping error:', err)
                        }
                    }
                }, 30000)
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.pong || data.result === null) return
                    handleMessage(streamType, data)
                } catch (err) {
                    console.error('WS parse error:', err)
                }
            }

            ws.onerror = (err) => {
                console.error('WS error:', err)
            }

            ws.onclose = (event) => {
                if (pingInterval) {
                    clearInterval(pingInterval)
                    pingInterval = null
                }
                reconnect(streamType, streamName)
            }
        } catch (err) {
            console.error('WS connect error:', err)
            reconnect(streamType, streamName)
        }
    }

    function reconnect(streamType, streamName) {
        if (!reconnectAttempts[streamType]) {
            reconnectAttempts[streamType] = 0
        }
        if (reconnectAttempts[streamType] >= maxReconnectAttempts) {
            console.error('Max reconnect attempts reached')
            return
        }
        reconnectAttempts[streamType]++
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts[streamType] - 1), 30000)
        reconnectTimers[streamType] = setTimeout(() => {
            connect(streamType, streamName)
        }, delay)
    }

    function startConnections() {
        connect('ticker', `${sym}@ticker`)
        connect('orderbook', `${sym}@depth20@100ms`)
        connect('trades', `${sym}@trade`)

        let klinePollInterval = setInterval(async() => {
            try {
                const res = await fetch(`${REST_BASE}/klines?symbol=${symbol}&interval=1m&limit=1`)
                if (res.ok) {
                    const data = await res.json()
                    if (data.length > 0) {
                        const k = data[0]
                        const latest = {
                            time: Math.floor(k[0] / 1000),
                            open: parseFloat(k[1]),
                            high: parseFloat(k[2]),
                            low: parseFloat(k[3]),
                            close: parseFloat(k[4]),
                            volume: parseFloat(k[5]),
                        }
                        listeners.candleUpdate.forEach(fn => fn(latest))
                    }
                }
            } catch (err) {
                console.error('Kline poll error:', err)
            }
        }, 60000)

        connections['_klinePoll'] = { interval: klinePollInterval }
    }

    function handleMessage(streamType, data) {
        if (streamType === 'ticker') {
            listeners.ticker.forEach(fn => fn({
                price: parseFloat(data.c || 0),
                changePercent: parseFloat(data.P || 0),
                high: parseFloat(data.h || 0),
                low: parseFloat(data.l || 0),
                volume: parseFloat(data.v || 0),
            }))
        } else if (streamType === 'orderbook') {
            const bids = (data.b || []).map(([p, q]) => [parseFloat(p), parseFloat(q)])
            const asks = (data.a || []).map(([p, q]) => [parseFloat(p), parseFloat(q)])
            listeners.orderbook.forEach(fn => fn({ bids, asks }))
        } else if (streamType === 'trades') {
            listeners.trades.forEach(fn => fn({
                side: data.m ? 'sell' : 'buy',
                price: parseFloat(data.p || 0),
                qty: parseFloat(data.q || 0),
                time: data.T || Date.now(),
            }))
        } else if (streamType === 'kline') {
            if (data.k && data.k.x) {
                const k = data.k
                listeners.candleUpdate.forEach(fn => fn({
                    time: Math.floor(k.t / 1000),
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                    volume: parseFloat(k.v),
                }))
            }
        }
    }

    return {
        subscribeTicker(fn) { listeners.ticker.push(fn) },
        subscribeOrderBook(fn) { listeners.orderbook.push(fn) },
        subscribeTrades(fn) { listeners.trades.push(fn) },
        subscribeCandleUpdate(fn) { listeners.candleUpdate.push(fn) },
        subscribeCandlesInit() {}, // Initial candles loaded via REST
        start() {
            startConnections()
        },
        stop() {},
    }
}