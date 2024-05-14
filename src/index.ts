import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import { serveStatic } from 'hono/bun'
import { createPost, getPosts } from './db'

const { upgradeWebSocket, websocket } = createBunWebSocket()
const app = new Hono()

app.use('/client/*', serveStatic({ root: './client/' }))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get('/history', async (c) =>{
  const posts = await getPosts()
  const formattedData = posts.map(obj => `${obj.name}>${obj.ms}`).join('\n');
  return c.text(formattedData)
})
app.get(
  '/chatServer',
  upgradeWebSocket(async(c) => {
    return {
      onOpen(event,ws) {
        console.log(ws.send('system>新しい人が入室しました'))
      },
      async onMessage(event, ws) {
        const [name, ms] = String(event.data).split('>');
        await createPost(name.trim(),ms.trim())
        ws.send(String(event.data))
      },      
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

Bun.serve({
  fetch: app.fetch,
  websocket,
})
