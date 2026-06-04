const clicker = document.getElementById('click')
const amountEl = document.getElementById('amount')
const upgradeBtn = document.getElementById('upgrade')
const investmentPanel = document.getElementById('inv-panel')
const investingUnlock = document.getElementById('investing')

const GOAL = 1_000_000

let amount = 0
let bonus = 1
let passive = 0
let won = false
let upgradeCost = 50
const investingCost = 100

let investments = [
    { name: 'Mining Rig',  cost: 100,  income: 1,  bought: false },
    { name: 'Crypto Farm', cost: 500,  income: 5,  bought: false },
    { name: 'Data Center', cost: 2000, income: 20, bought: false },
    { name: 'Hedge Fund',  cost: 8000, income: 80, bought: false },
]

let multiplier = 1.0
let betAmount  = 0
let betActive  = false


investmentPanel.style.display = 'none'

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
    investmentPanel.style.display = 'block'
    investingUnlock.style.display = 'none'
})


function buyInvestment(index) {
    const inv = investments[index]
    if (inv.bought || amount < inv.cost) return
    amount -= inv.cost
    inv.bought = true
    passive += inv.income
    const btn = document.querySelectorAll('.inv-btn')[index]
    btn.disabled = true
    btn.innerHTML = `<b>${inv.name}</b><br>✓ +${inv.income}/s`
    update()
}


function setMaxBet() {
    document.getElementById('bet-input').value = Math.floor(amount)
}

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
    if      (roll < 0.04) multiplier = +(3   + Math.random() * 5  ).toFixed(2)
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
    investments.forEach(inv => inv.bought = false)
    document.getElementById('win-screen').style.display = 'none'
    document.querySelectorAll('.inv-btn').forEach((btn, i) => {
        btn.disabled = false
        btn.innerHTML = `<b>${investments[i].name}</b><br>${fmt(investments[i].cost)} BTC`
    })
    update()
})


function update() {
    amountEl.textContent  = fmt(amount)
    upgradeBtn.textContent = `Upgrade click - ${fmt(upgradeCost)} BTC`

    const pct = Math.min(amount / GOAL * 100, 100)
    document.getElementById('goal-fill').style.width = pct.toFixed(2) + '%'
    document.getElementById('goal-pct').textContent = pct.toFixed(1) + '%'


    document.querySelectorAll('.inv-btn').forEach((btn, i) => {
        if (!investments[i].bought) btn.disabled = amount < investments[i].cost
    })

    const bb = document.getElementById('bet-btn')
    if (bb) bb.disabled = betActive
}

function fmt(n) {
    n = Math.floor(n)
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
    return n.toString()
}

update()