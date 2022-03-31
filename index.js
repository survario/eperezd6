const express = require('express')
const fs = require('fs')
const PORT = 8080
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer} = require('http')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set('view engine', 'ejs')

app.use(express.static('./views'))

httpServer.listen(8080, () => console.log('Servidor Levantado'))

const messages = [
    { author: 'juan@coder,com', text: '¡Hola! ¿Que tal?' },
    { author: 'pedro@coder.com', text: '¡Muy bien! ¿Y vos?' },
    { author: 'ana@coder.com', text: '¡Genial!' },
  ]

const productos = [
    { title: 'Libro', price: 5, thumbnail: 'https://www.iconfinder.com/icons/4488274/book_education_library_open_school_study_icon'}
]

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado')

    socket.emit('productos', productos)
    socket.on('nota', (datos) => {
        console.log(datos)
    })
    socket.on('new-producto', (datos) => {
        productos.push(datos)
        io.sockets.emit('productos', productos)
    })

    socket.emit('messages', messages)
    socket.on('notificacion',(data) => {
        console.log(data)
    })
    socket.on('new-message', (data) => {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })
})

app.get('/', (req, res) => {
    res.render('formulario.ejs', {productos})
})