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
        reconnect: [],
    }
    let orderBookSnapshot = { bids: [], asks: [] }
    let lastUpdateId = null

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

                if (streamType === 'orderbook') {
                    orderBookSnapshot = { bids: [], asks: [] }
                    lastUpdateId = null
                }

                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        try {
                            ws.send(JSON.stringify({ method: 'ping', id: Date.now() }))
                        } catch (err) {
                            console.error('WS ping error:', err)
                        }
                    }
                }, 30000)

                if (reconnectAttempts[streamType] > 0) {
                    listeners.reconnect.forEach(fn => fn(streamType))
                }
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

                if (event.code !== 1000 && event.code !== 1001) {
                    reconnect(streamType, streamName)
                }
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
            console.error(`Max reconnect attempts reached for ${streamType}`)
            reconnectAttempts[streamType] = 0
            setTimeout(() => reconnect(streamType, streamName), 60000)
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
            const price = parseFloat(data.c)
            const changePercent = parseFloat(data.P)
            const high = parseFloat(data.h)
            const low = parseFloat(data.l)
            const volume = parseFloat(data.v)

            if (isNaN(price) || price === 0) return

            listeners.ticker.forEach(fn => fn({
                price,
                changePercent: isNaN(changePercent) ? 0 : changePercent,
                high: isNaN(high) ? price : high,
                low: isNaN(low) ? price : low,
                volume: isNaN(volume) ? 0 : volume,
            }))
        } else if (streamType === 'orderbook') {
            const updateId = data.u || data.lastUpdateId

            if (lastUpdateId === null) {
                lastUpdateId = updateId
            } else if (updateId < lastUpdateId) {
                return
            }

            lastUpdateId = updateId

            const bids = (data.b || []).map(([p, q]) => [parseFloat(p), parseFloat(q)]).filter(([p, q]) => p > 0 && q > 0)
            const asks = (data.a || []).map(([p, q]) => [parseFloat(p), parseFloat(q)]).filter(([p, q]) => p > 0 && q > 0)

            if (bids.length === 0 && asks.length === 0) return

            const bidsMap = new Map(orderBookSnapshot.bids)
            const asksMap = new Map(orderBookSnapshot.asks)

            bids.forEach(([price, qty]) => {
                if (qty === 0) {
                    bidsMap.delete(price)
                } else {
                    bidsMap.set(price, qty)
                }
            })

            asks.forEach(([price, qty]) => {
                if (qty === 0) {
                    asksMap.delete(price)
                } else {
                    asksMap.set(price, qty)
                }
            })

            const sortedBids = Array.from(bidsMap.entries())
                .sort(([a], [b]) => b - a)
                .slice(0, 20)
                .map(([p, q]) => [p, q])

            const sortedAsks = Array.from(asksMap.entries())
                .sort(([a], [b]) => a - b)
                .slice(0, 20)
                .map(([p, q]) => [p, q])

            orderBookSnapshot = { bids: sortedBids, asks: sortedAsks }

            if (sortedBids.length > 0 || sortedAsks.length > 0) {
                listeners.orderbook.forEach(fn => fn({ bids: sortedBids, asks: sortedAsks }))
            }
        } else if (streamType === 'trades') {
            const price = parseFloat(data.p)
            const qty = parseFloat(data.q)

            if (isNaN(price) || price === 0 || isNaN(qty) || qty === 0) return

            listeners.trades.forEach(fn => fn({
                side: data.m ? 'sell' : 'buy',
                price,
                qty,
                time: data.T || Date.now(),
            }))
        } else if (streamType === 'kline') {
            if (data.k && data.k.x) {
                const k = data.k
                const open = parseFloat(k.o)
                const high = parseFloat(k.h)
                const low = parseFloat(k.l)
                const close = parseFloat(k.c)
                const volume = parseFloat(k.v)

                if (isNaN(close) || close === 0) return

                listeners.candleUpdate.forEach(fn => fn({
                    time: Math.floor(k.t / 1000),
                    open: isNaN(open) ? close : open,
                    high: isNaN(high) ? close : high,
                    low: isNaN(low) ? close : low,
                    close,
                    volume: isNaN(volume) ? 0 : volume,
                }))
            }
        }
    }

    return {
        subscribeTicker(fn) { listeners.ticker.push(fn) },
        subscribeOrderBook(fn) { listeners.orderbook.push(fn) },
        subscribeTrades(fn) { listeners.trades.push(fn) },
        subscribeCandleUpdate(fn) { listeners.candleUpdate.push(fn) },
        subscribeReconnect(fn) { listeners.reconnect.push(fn) },
        subscribeCandlesInit() {}, // Initial candles loaded via REST
        start() {
            startConnections()
        },
        stop() {
            Object.keys(connections).forEach(key => {
                if (key === '_klinePoll') {
                    if (connections[key].interval) {
                        clearInterval(connections[key].interval)
                    }
                } else if (connections[key] && connections[key].close) {
                    connections[key].close()
                }
            })
            Object.values(reconnectTimers).forEach(timer => {
                if (timer) clearTimeout(timer)
            })
            connections = {}
            reconnectTimers = {}
            reconnectAttempts = {}
        },
    }
}