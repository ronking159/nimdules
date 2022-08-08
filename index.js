const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

let players = []
let started = false
let turn = 0

async function exitEmit() {
    io.emit('disc')
    await new Promise(resolve => setTimeout(resolve, 10))
    process.exit(1)
}

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}\\index.html`)
})

app.get('/script.js', (req, res) => {
    res.sendFile(`${__dirname}\\script.js`)
})

app.get('/style.css', (req, res) => {
    res.sendFile(`${__dirname}\\style.css`)
})

app.get('/timer.js', (req, res) => {
    res.sendFile(`${__dirname}\\timer.js`)
})

app.get('/favicon', (req, res) => {
    res.sendFile(`${__dirname}\\icon.png`)
})

io.on('connection', socket => {
    socket.emit('players', players.length)
    socket.on('alive', () => socket.emit('alive'))
    socket.on('join', () => {
        if (players.length < 2) {
            players.push({id: socket.id, ready: false})
            io.to(socket.id).emit('join', true)
        } else {
            io.to(socket.id).emit('join', false)
        }
        io.emit('players', players.length)
    })
    socket.on('ready', () => {
        players[players.map(o => {
            return o.id
        }).indexOf(socket.id)].ready = true

        let temp = 0
        for (player of players) {
            if (player.ready) temp++
        }
        if (temp != 2) return

        io.emit('start')
        started = true
    })
    socket.on('disconnect', () => {
        players.splice(players.map(o => {
            return o.id
        }).indexOf(socket.id), 1)
        io.emit('players', players.length)

        for (i in players) {
            players[i].ready = false
        }

        if (started) {
            exitEmit()
        }
    })
})

server.listen(3000, () => {
    console.log("listening on port 3000")
})