let timerInt
let startedT = false
let secs = 0
let mins = 0
let secsS = ""
let minsS = ""
function tick() {
    secs++
    if (secs >= 60) {
        secs = 0
        mins++
    }

    if (String(secs).length == 1) {
        secsS = `0${secs}`
    } else secsS = secs

    if (String(mins).length == 1) {
        minsS = `0${mins}`
    } else minsS = mins

    document.querySelector('#timer').innerText = `${minsS}:${secsS}`
}
addEventListener('keydown', () => {
    dispatchEvent(new Event('start'))
})
addEventListener('start', () => {
    if (startedT) return

    startedT = true
    timerInt = setInterval(tick, 1000)
})