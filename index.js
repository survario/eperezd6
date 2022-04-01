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

const productos = [
    { title: 'Libro', price: 5, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-science-vol-1-1/512/reading_book_read_learn-512.png'}
]

io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado')

    socket.emit('productos', productos)
    socket.on('nota', (datos) => {
        console.log(datos)
    })
    socket.on('new-producto', (datos) => {
        productos.push(datos)
        io.sockets.emit('productos', productos)
    })

    const response = await fs.promises.readFile('./mensajes.txt', 'utf-8');
    const messages = JSON.parse(response);

    socket.emit('messages', messages)
    socket.on('notificacion',(data) => {
        console.log(data)
    })
    socket.on('new-message', async (data) => {
        messages.push(data)
        await fs.promises.writeFile('./mensajes.txt', JSON.stringify(messages, null, 2));
        io.sockets.emit('messages', messages)
    })
})

app.get('/', (req, res) => {
    res.render('formulario.ejs', {productos})
})