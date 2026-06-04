const clicker = document.getElementById('click')
const amountEl = document.getElementById('amount')
const upgradeBtn = document.getElementById('upgrade')
const investmentPanel = document.getElementById('inv-panel')
const investingUnlock = document.getElementById('investing')
const shopBtn = document.getElementById('shop-btn')
const shopPanel = document.getElementById('shop-panel')
const shopBuyBtn = document.getElementById('shop-buy')

const GOAL = 1_000_000

let amount = 0
let bonus = 1
let passive = 0
let won = false
let upgradeCost = 50
let shopOpen = false
const investingCost = 100

let investments = [
    { name: 'Mining Rig',  cost: 100,  income: 1,  count: 0 },
    { name: 'Crypto Farm', cost: 500,  income: 5,  count: 0 },
    { name: 'Data Center', cost: 2000, income: 20, count: 0 },
    { name: 'Hedge Fund',  cost: 8000, income: 80, count: 0 },
]

let investments_example = [
    { name: 'Mining Rig',  cost: 100,  income: 1,  count: 0 },
    { name: 'Crypto Farm', cost: 500,  income: 5,  count: 0 },
    { name: 'Data Center', cost: 2000, income: 20, count: 0 },
    { name: 'Hedge Fund',  cost: 8000, income: 80, count: 0 },
]

let multiplier = 1.0
let betAmount  = 0
let betActive  = false

shopPanel.style.display = 'none'
investmentPanel.style.display = 'none'
shopBtn.style.display = 'none'

clicker.addEventListener('click', () => {
    amount += bonus
    clicker.style.scale = 1.1
    setTimeout(() => {
        clicker.style.scale = 1;
    }, 100);
    update()
    checkWin()
})


upgradeBtn.addEventListener('click', () => {
    if (amount < upgradeCost) {
        alert('Not enough BTC!')
        return
    }
    amount -= upgradeCost
    bonus++
    upgradeCost = Math.floor(upgradeCost * 2.5)
    update()
})


investingUnlock.addEventListener('click', () => {
    if (amount < investingCost) {
        alert('Not enough BTC!')
        return
    }
    amount -= 100
    investmentPanel.style.display = 'block'
    investingUnlock.style.display = 'none'
    shopBtn.style.display = 'block'
    update()
})

shopBtn.addEventListener('click', () => {
    if (amount < 2000) {
        alert('Not enough BTC!')
        return
    }
    amount -= 2000
    shopBtn.style.display = 'none'
    shopPanel.style.display = 'block'
    shopOpen = true
    shopReroll()
    update()
})

shopBuyBtn.addEventListener('click', () => {
    if (shopOption === 0) {
        if (amount < 40000) { alert('Not enough BTC!'); return }
        if (!betActive) { alert('You need to place a bet first!'); return }
        amount -= 40000
        betAmount *= 5
        update()
    } else if (shopOption === 1) {
        if (amount < 10000) { alert('Not enough BTC!'); return }
        amount -= 10000
        bonus *= 2
        update()
    } else {
        if (amount < 10000) { alert('Not enough BTC!'); return }
        amount -= 10000
        let ticks = 0
        const interval = setInterval(() => {
            amount += 1000
            update()
            if (++ticks >= 15) clearInterval(interval)
        }, 1000)
    }
    shopBuyBtn.style.display = 'none'
    update()
})


function buyInvestment(index) {
    const inv = investments[index]
    if (amount < inv.cost) return
    amount -= inv.cost
    inv.cost *= 2.5
    passive += inv.income
    inv.count++
    update()
}

function setMaxBet() {
    document.getElementById('bet-input').value = Math.floor(amount)
}

let shopOption = 2

function shopReroll() {
    const shopRoll = Math.random()
    if (shopRoll < 0.06) shopOption = 0
    else if (shopRoll < 0.21) shopOption = 1
    else shopOption = 2

    if (shopOption === 0) {
        document.getElementById('shop-offer').innerHTML =
            `Insider Trading<br>Quintuple your current betted amount!<br><b>Price: 40K BTC</b>`
    } else if (shopOption === 1) {
        document.getElementById('shop-offer').innerHTML =
            `Overclocked Clicker<br>Double your BTC per click<br><b>Price: 10K BTC</b>`
    } else {
        document.getElementById('shop-offer').innerHTML =
            `Smart Investing<br>Pay 10K to gain 15K over 15 seconds<br><b>Price: 10K BTC</b>`
    }
    shopBuyBtn.style.display = 'block'
}


setInterval(() => {
    if (!won && shopOpen) shopReroll()
}, 30000)

function placeBet() {
    if (betActive) return
    const val = Math.floor(Number(document.getElementById('bet-input').value))
    if (!val || val <= 0 || val > amount) { alert('Invalid amount!'); return }
    betAmount = val
    amount -= betAmount
    betActive = true
    document.getElementById('bet-btn').disabled = true
    document.getElementById('bet-result').textContent = 'Waiting...'
    update()
}

function collectBet() {
    if (!betActive) return
    const payout = Math.floor(betAmount * multiplier)
    amount += payout
    betAmount = 0
    betActive = false
    document.getElementById('bet-btn').disabled = false
    document.getElementById('bet-result').textContent = ''
    update()
    checkWin()
}


setInterval(() => {
    const roll = Math.random()
    if (roll < 0.04) multiplier = +(3   + Math.random() * 5  ).toFixed(2)
    else if (roll < 0.15) multiplier = +(1.5 + Math.random() * 1.5).toFixed(2)
    else if (roll < 0.45) multiplier = +(1.0 + Math.random() * 0.5).toFixed(2)
    else if (roll < 0.99) multiplier = +(0.1 + Math.random() * 0.9).toFixed(2)
    else {
        if (betActive) alert('The Crypto market has crashed! Investment lost.')
        multiplier = 0
        betActive  = false
    }
    const el = document.getElementById('multiplier-val')
    if (!el) return
    el.textContent = multiplier.toFixed(2) + 'x'
    el.style.color  = multiplier >= 1.5 ? '#3ec97e' : multiplier >= 1.0 ? '#f7c948' : '#e05555'
}, 500)


setInterval(() => {
    if (passive > 0 && !won) {
        amount += passive
        update()
        checkWin()
    }
}, 1000)


function checkWin() {
    if (won || amount < GOAL) return
    won = true
    document.getElementById('win-screen').style.display = 'flex'
}

document.getElementById('restart-btn').addEventListener('click', () => {
    amount = 0; bonus = 1; passive = 0; won = false; upgradeCost = 50
    betAmount = 0; betActive = false
    document.getElementById('win-screen').style.display = 'none'
    investments = investments_example.map(inv => ({ ...inv }))
    shopOpen = false
    shopBuyBtn.style.display = 'block'
    shopPanel.style.display = 'none'
    shopBtn.style.display = 'none'
    investmentPanel.style.display = 'none'
    investingUnlock.style.display = 'block'
    update()
})


function update() {
    amountEl.textContent  = fmt(amount)
    upgradeBtn.textContent = `Upgrade click - ${fmt(upgradeCost)} BTC`

    const pct = Math.min(amount / GOAL * 100, 100)
    document.getElementById('goal-fill').style.width = pct.toFixed(2) + '%'
    document.getElementById('goal-pct').textContent = pct.toFixed(1) + '%'

    for (let index_check = 0; index_check < 4; index_check++) {
    document.querySelectorAll('.inv-btn')[index_check].innerHTML = 
        `<b>${investments[index_check].name}</b><br>${fmt(investments[index_check].cost)} BTC | owned: ${investments[index_check].count}<br>${investments[index_check].income} BTC/s`
}

    const bb = document.getElementById('bet-btn')
    if (bb) bb.disabled = betActive

    document.getElementById('passive').textContent = `${passive} BTC/s`
}

function fmt(n) {
    n = Math.floor(n)
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
    return n.toString()
}

update()