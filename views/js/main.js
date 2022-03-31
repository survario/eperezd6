const socket = io.connect()

socket.on('mi producto', (datos) => {
  alert(datos)
  socket.emit('nota', 'producto agregado con exito')
})

function render(datos) {
  const html = datos
    .map((prod, index) => {
      return `
              <tr>
              <td>${prod.title}</td>
              <td>${prod.price}</td>
              <td> <img src=${prod.thumbnail} style='width:40px; height:40px;'></td>
              </tr>
              `
    })
    .join(' ')
  document.getElementById('productos').innerHTML = html
}

socket.on('productos', function (datos) {
  render(datos)
})

function addProduct(e) {
  const producto = {
    title: document.getElementById('title').value,
    price: document.getElementById('price').value,
    thumbnail: document.getElementById('thumbnail').value,
  }
  socket.emit('new-producto', producto)
  return false
}

socket.on('mi mensaje', (data) => {
  alert(data)
  socket.emit('notificacion', 'mensaje recibido con exito')
})

function renderizar(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
            <strong style="color: blue">${elem.author}</strong>
            <bdi style="color: brown">[${elem.date}]</bdi>:
            <em style="color: green">${elem.text}</em> 
              </div>`
    })
    .join(' ')
  document.getElementById('mensajes').innerHTML = html
}

socket.on('messages', function (data) {
  renderizar(data)
})

function fechaMensaje() {
  let date = new Date();
  let fecha = date.getFullYear() + "/" + (date.getMonth() +1) + "/" + 
  date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return fecha;
}

function addMessage(e) {

  let fecha = fechaMensaje()

  const mensaje = {
    author: document.getElementById('email').value,
    text: document.getElementById('texto').value,
    date: fecha,
  }
  socket.emit('new-message', mensaje)
  return false
}