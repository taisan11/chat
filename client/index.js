const ws = new WebSocket('ws://localhost:3000/chatServer')
ws.onmessage = (event) => {
  console.log(event.data)
}
function send(username,ms) {
    ws.send(`${username}>${ms}`)
}
