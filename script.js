import '/socket.io/socket.io.js'
var socket = io()

let aliveInt = setInterval(() => socket.emit('alive'), 10000)

let connected = false
let started = false
socket.on('players', count => {
    if (!connected && count < 2) {
        document.querySelector('#jointxt').innerText = `${count} out of 2 connected`
        document.querySelector('#joinbtn').style.display = 'block'
        document.querySelector('#readybtn').style.display = 'none'
    } else if (!connected && count == 2) {
        document.querySelector('#jointxt').innerText = "Game is full"
        document.querySelector('#joinbtn').style.display = 'none'
        document.querySelector('#readybtn').style.display = 'none'
    } else if (connected && count == 1) {

        document.querySelector('#jointxt').innerText = "Waiting for another player..."
        document.querySelector('#joinbtn').style.display = 'none'
        document.querySelector('#readybtn').style.display = 'none'
        document.querySelector('#readybtn').classList.remove('ready') = 'none'
    } else if (connected && count == 2) {
        document.querySelector('#jointxt').innerText = "Waiting to start..."
        document.querySelector('#joinbtn').style.display = 'none'
        document.querySelector('#readybtn').style.display = 'block'
    }
})

document.querySelector('#joinbtn').addEventListener('click', () => {
    socket.emit('join')
})

socket.on('join', is => {
    if (!is) return

    connected = true
})

socket.on('disc', () => {
    if (started) {
        alert("Your opponent left, you won!!!")
        location = location
    }
})

document.querySelector('#readybtn').addEventListener('click', () => {
    document.querySelector('#readybtn').classList.add('ready')
    socket.emit('ready')
})

socket.on('start', () => {
    started = true
    document.querySelector('#joinoverlay').style.display = 'none'
    dispatchEvent(new Event('start'))
})

socket.on('boardstart', (r1, r2, r3) => {
    console.log(`${r1}, ${r2}, ${r3}`)
})